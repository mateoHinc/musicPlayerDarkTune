import React, { useRef, useState } from "react";
import { usePlayer } from "../contexts/PlayerContext";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";

const VolumeControl: React.FC = () => {
  const { state, dispatch } = usePlayer();
  const { volume, isMuted } = state;
  const [isDragging, setIsDragging] = useState(false);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  const handleVolumeChange = (clientX: number) => {
    if (!volumeBarRef.current) return;

    const rect = volumeBarRef.current.getBoundingClientRect();
    const position = clientX - rect.left;
    const newVolumen = Math.max(0, Math.min(position / rect.width, 1));

    dispatch({ type: "SET_VOLUME", payload: newVolumen });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleVolumeChange(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleVolumeChange(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleBarClick = (e: React.MouseEvent) => {
    handleVolumeChange(e.clientX);
  };

  const handleMuteToggle = () => {
    dispatch({ type: "TOGGLE_MUTE" });
  };

  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging]);

  const effectiveVolume = isMuted ? 0 : volume;
  const VolumeIcon = () => {
    if (isMuted || effectiveVolume === 0) return <VolumeX size={16} />;
    if (effectiveVolume < 0.4) return <Volume size={16} />;
    if (effectiveVolume < 0.7) return <Volume1 size={16} />;
    return <Volume2 size={16} />;
  };

  return (
    <div className="flex-items-center space-x-2 w-28">
      <button
        onClick={handleMuteToggle}
        className="text-gray-300 hover:text-white trnasition-colors"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        <VolumeIcon />
      </button>
      <div
        ref={volumeBarRef}
        className="group relative flex-grow bg-gray-600 rounded-full h-1 cursor-pointer"
        onClick={handleBarClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          className="absolute bg-gray-300 group-hover:bg-blue-400 rounded-full h-full transition-colors"
          style={{ width: `${effectiveVolume * 100}%` }}
        />
        <div
          className={`absolute h-3 w-3 bg-white rounded-full -mt-1 transform -translate-y-1/2 transition-opacity ${
            isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          style={{ left: `${effectiveVolume * 100}%` }}
        />
      </div>
    </div>
  );
};

export default VolumeControl;
