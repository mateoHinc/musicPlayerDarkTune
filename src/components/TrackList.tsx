import React from "react";
import { usePlayer } from "../contexts/PlayerContext";
import { Play, Pause, Clock } from "lucide-react";

const TrackList: React.FC = () => {
  const { state, dispatch } = usePlayer();
  const { tracks, currentTrackIndex, isPlaying } = state;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleTrackSelect = (index: number) => {
    if (index === currentTrackIndex) {
      dispatch({ type: "TOGGLE_PLAY" });
    } else {
      dispatch({ type: "SET_TRACK_INDEX", payload: index });
      dispatch({ type: "PLAY" });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <table className="w-full text-left">
        <thead className="text-gray-400 text-xs uppercase">
          <tr>
            <th className="px-4 py-2 w-10">#</th>
            <th className="px-4 py-2">Title</th>
            <th className="hidden mg:table-cell px-4 py-2">Artist</th>
            <th className="hidden lg:table-cell px-4 py-2">Album</th>
            <th className="px-4 py-2 text-right">
              <Clock size={14} />
            </th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track, index) => (
            <tr
              key={track.id}
              className={`group hover:bg-white/10 transition-colors ${
                index === currentTrackIndex ? "bg-white/20" : ""
              }`}
              onClick={() => handleTrackSelect(index)}
            >
              <td className="relative px-4 py-3 w-10">
                {index === currentTrackIndex && isPlaying ? (
                  <div className="absolute inset-0 flex items-center justity-center">
                    <div className="flex space-x-[2px]">
                      <div className="bg-blue-400 w-[2px] h-3 animate-sound-wave"></div>
                      <div className="bg-blue-400 w-[2px] h-4 animate-sound-wave animation-delay-200"></div>
                      <div className="bg-blue-400 w-[2px] h-3 animate-sound-wave animation-delay-500"></div>
                    </div>
                  </div>
                ) : (
                  <span className="group-hover:hidden text-gray-400">
                    {index + 1}
                  </span>
                )}
                <button
                  className={`absolute inset-0 items-center justify-center ${
                    index === currentTrackIndex && isPlaying
                      ? "flex"
                      : "hidden group-hover:flex"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTrackSelect(index);
                  }}
                >
                  {index === currentTrackIndex && isPlaying ? (
                    <Pause size={14} className="text-white" />
                  ) : (
                    <Play size={14} className="ml-0.5 text-white" />
                  )}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <div className="hidden sm:block mr-3 rounded w-10 h-10 overflow-hidden">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className={`truncate ${
                      index === currentTrackIndex
                        ? "text-blue-400"
                        : "text-white"
                    }`}
                  >
                    {track.title}
                  </span>
                </div>
              </td>
              <td className="hidden md:table-cell px-4 py-3 text-gray-300 truncate">
                {track.artist}
              </td>
              <td className="hidden lg:table-cell px-4 py-3 text-gray-300 truncate">
                {track.album}
              </td>
              <td className="px-4 py-3 text-gray-400 text-right">
                {formatTime(track.duration)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrackList;
