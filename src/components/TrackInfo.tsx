import { usePlayer } from "../contexts/PlayerContext";

const TrackInfo: React.FC = () => {
  const { state } = usePlayer();
  const { tracks, currentTrackIndex } = state;

  if (tracks.length === 0) {
    return (
      <div className="flex items-center p-4">
        <div className="ml-4">
          <p className="font-medium text-white text-lg">No track selected</p>
          <p className="text-gray-400 text-sm">
            Add some tracks to get started
          </p>
        </div>
      </div>
    );
  }

  const currentTrack = tracks[currentTrackIndex];

  return (
    <div className="flex items-center p-4">
      <div className="flex-shrink-0 shadow-lg rounded-md w-16 h-16 overflow-hidden">
        <img
          src={currentTrack.coverUrl}
          alt={`${currentTrack.title} cover`}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="ml-4">
        <h3 className="font-medium text-white text-lg truncate">
          {currentTrack.title}
        </h3>
        <p className="text-gray-400 text-sm truncate">
          {currentTrack.artist} • {currentTrack.album}
        </p>
      </div>
    </div>
  );
};

export default TrackInfo;
