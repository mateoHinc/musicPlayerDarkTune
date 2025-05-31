import React, { useState, useRef, useEffect } from "react";
import { usePlayer } from "../contexts/PlayerContext";
import { SeekCommand } from "../patterns/commands";

const ProgressBar: React.FC = () => {
  const { state, dispatch, audioRef, commandInvoker } = usePlayer();
  const { progress, tracks, currentTrackIndex } = state;
  const [isDragging, setIsDragging] = useState(false);
  const [temProgress, setTemProgress] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const currentTrack = tracks[currentTrackIndex];
  const duration = currentTrack?.duration || 0;

  useEffect(() => {
    if (!isDragging) {
      setTemProgress(progress);
    }
  }, [progress, isDragging]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const calculateProgress = (clientX: number) => {
    if (!progressBarRef.current) return 0;

    const rect = progressBarRef.current.getBoundingClientRect();
    const position = clientX - rect.left;
    const percentage = position / rect.width;
    return Math.max(0, Math.min(percentage * duration, duration));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const newProgress = calculateProgress(e.clientX);
    setIsDragging(true);
    setTemProgress(newProgress);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const newProgress = calculateProgress(e.clientX);
    setTemProgress(newProgress);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const newProgress = calculateProgress(touch.clientX);
    setTemProgress(newProgress);
  };

  const handleMouseUp = () => {
    if (!isDragging || !audioRef.current) return;

    setIsDragging(false);
    const seekCommand = new SeekCommand(audioRef.current, temProgress);
    commandInvoker.execute(seekCommand);
    dispatch({ type: "SET_PROGRESS", payload: temProgress });
  };

  const handleBarClick = (e: React.MouseEvent) => {
    if (!audioRef.current) return;

    const newProgress = calculateProgress(e.clientX);
    const seekCommand = new SeekCommand(audioRef.current, newProgress);
    commandInvoker.execute(seekCommand);
    dispatch({ type: "SET_PROGRESS", payload: newProgress });
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, [isDragging, temProgress]);

  const progressPercentage = duration ? (temProgress / duration) * 100 : 0;

  return (
    <div className="px-4 w-full select-none">
      <div
        className="group relative bg-gray-600 rounded-full h-1 cursor-pointer"
        ref={progressBarRef}
        onClick={handleBarClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onTouchStart={() => setIsDragging(true)}
      >
        <div
          className="absolute bg-white group-hover:bg-blue-400 rounded-full h-full transition-all"
          style={{ width: `${progressPercentage}%` }}
        />
        <div
          className={`absolute h-3 w-3 bg-white rounded-full -mt-1 transform -translate-y-1/2 transition-opacity ${
            isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          style={{ left: `${progressPercentage}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-gray-400 text-xs">
        <span>{formatTime(temProgress)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
