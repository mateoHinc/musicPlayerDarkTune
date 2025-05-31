import React from "react";
import { usePlayer } from "../contexts/PlayerContext";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Shuffle,
} from "lucide-react";

const PlayerControls: React.FC = () => {
  const { state, dispatch } = usePlayer();
  const { isPlaying, repeatMode, isMuted, isShuffled } = state;

  const handlePlayPause = () => {
    dispatch({ type: "TOGGLE_PLAY" });
  };

  const handlePrev = () => {
    dispatch({ type: "PREV_TRACK" });
  };

  const handleNext = () => {
    dispatch({ type: "NEXT_TRACK" });
  };

  const handleRepeat = () => {
    const modes = ["off", "all", "one"] as const;
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    dispatch({ type: "SET_REPEAT_MODE", payload: nextMode });
  };

  const handleShuffle = () => {
    dispatch({ type: "TOGGLE_SHUFFLE" });
  };

  const handleMute = () => {
    dispatch({ type: "TOGGLE_MUTE" });
  };

  return (
    <div className="flex items-center space-x-4 py-2 justify">
      <button
        className={`p-2 rounded-full transition-colors ${
          isShuffled ? "text-blue-400" : "text-gray-300 hover:text-white"
        }`}
        onClick={handleShuffle}
        aria-label="Shuffle"
      >
        <Shuffle size={18} />
      </button>

      <button
        className="p-2 rounded-full text-gray-300 hover:text-white transition-colors"
        onClick={handlePrev}
        aria-label="Previous track"
      >
        <SkipBack size={24} />
      </button>

      <button
        className="bg-white hover:bg-opacity-90 p-3 rounded-full text-black hover:scale-105 transition-all transform"
        onClick={handlePlayPause}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
      </button>

      <button
        className="p-2 rounded-full text-gray-300 hover:text-white transition-colors"
        onClick={handleNext}
        aria-label="Next track"
      >
        <SkipForward size={24} />
      </button>

      <button
        className={`p-2 rounded-full transition-colors ${
          repeatMode !== "off"
            ? "text-blue-400"
            : "text-gray-300 hover:text-white"
        }`}
        onClick={handleRepeat}
        aria-label="Repeat mode"
      >
        {repeatMode === "one" ? <Repeat1 size={18} /> : <Repeat size={18} />}
      </button>

      <button
        className="ml-2 p-2 rounded-full text-gray-300 hover:text-white transition-colors"
        onClick={handleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  );
};

export default PlayerControls;
