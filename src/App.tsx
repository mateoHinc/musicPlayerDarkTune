// import React from "react";
import AudioPlayer from "./components/AudioPlayer";
import { PlayerProvider } from "./contexts/PlayerContext";
import { Music } from "lucide-react";

function App() {
  return (
    <div className="flex flex-col bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 min-h-screen">
      <header className="justify-center sm:justify-start items-center p-4">
        <div className="flex items-center">
          <Music size={28} className="mr-2 text-white" />
          <h1 className="font-bold text-white text-xl">Dark Tune Play</h1>
        </div>
      </header>

      <main className="flex flex-col flex-1 mx-auto p-4 md:p-8 w-full max-w-5xl">
        <PlayerProvider>
          <div className="rounded-lg h-[calc(100vh-120px)] overflow-hidden">
            <AudioPlayer />
          </div>
        </PlayerProvider>
      </main>

      <footer className="py-2 text-gray-400 text-sm text-center">
        <p>Dark Tune © 2025 - Your Music, Your Way</p>
      </footer>
    </div>
  );
}

export default App;
