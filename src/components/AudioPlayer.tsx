import PlayerControls from "./PlayerControls";
import ProgressBar from "./ProgressBar";
import TrackInfo from "./TrackInfo";
import TrackList from "./TrackList";

const AudioPlayer: React.FC = () => {
  return (
    <div className="flex flex-col bg-gradient-to-b from-gray-900 to-black shadow-2xl border border-gray-800 rounded-lg h-full overflow-hidden text-white">
      <div className="flex flex-col flex-1 overflow-hidden">
        <TrackList />
      </div>

      <div className="bg-black bg-opacity-40 backdrop-blur-md border-gray-800 border-t">
        <TrackInfo />
        <div className="px-4 pb-2">
          <ProgressBar />
        </div>
        <div className="flex items-center px-4 pb-4 justify between">
          <div className="hidden sm:block w-28"></div>
          <PlayerControls />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
