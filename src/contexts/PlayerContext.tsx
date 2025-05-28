import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react";
import type { PlayerState, PlayerAction } from "../types/music";
import { sampleTracks } from "../data/sampleTracks";
import {
  AudioCommandInvoker,
  PlayCommand,
  PauseCommand,
  SetVolumeCommand,
  SeekCommand,
} from "../patterns/commands";
import { Subject } from "../patterns/observer";
import type { Observer } from "../patterns/observer";

const initialState: PlayerState = {
  tracks: sampleTracks,
  currentTrackIndex: 0,
  isPlaying: false,
  progress: 0,
  volume: 0.7,
  isMuted: false,
  repeatMode: "off",
  isShuffled: false,
};

const PlayerContext = createContext<
  | {
      state: PlayerState;
      dispatch: React.Dispatch<PlayerAction>;
      audioRef: React.RefObject<HTMLAudioElement | null>;
      commandInvoker: AudioCommandInvoker;
    }
  | undefined
>(undefined);

// Create a subject for player state changes
const playerStateSubject = new Subject();

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  const newState = (() => {
    switch (action.type) {
      case "SET_TRACKS":
        return {
          ...state,
          tracks: action.payload,
          currentTrackIndex: 0,
          progress: 0,
        };
      case "PLAY":
        return { ...state, isPlaying: true };
      case "PAUSE":
        return { ...state, isPlaying: false };
      case "TOGGLE_PLAY":
        return { ...state, isPlaying: !state.isPlaying };
      case "NEXT_TRACK": {
        if (state.tracks.length === 0) return state;

        let nextIndex = state.currentTrackIndex + 1;
        if (nextIndex >= state.tracks.length) {
          nextIndex = state.repeatMode === "off" ? state.currentTrackIndex : 0;
        }

        return {
          ...state,
          currentTrackIndex: nextIndex,
          progress: 0,
          isPlaying:
            state.repeatMode !== "off" || nextIndex !== state.currentTrackIndex,
        };
      }
      case "PREV_TRACK": {
        if (state.tracks.length === 0) return state;

        const prevIndex =
          state.currentTrackIndex > 0
            ? state.currentTrackIndex - 1
            : state.repeatMode !== "off"
            ? state.tracks.length - 1
            : 0;

        return { ...state, currentTrackIndex: prevIndex, progress: 0 };
      }
      case "SET_TRACK_INDEX":
        if (action.payload >= 0 && action.payload < state.tracks.length) {
          return { ...state, currentTrackIndex: action.payload, progress: 0 };
        }
        return state;
      case "SET_PROGRESS":
        return { ...state, progress: action.payload };
      case "SET_VOLUME":
        return { ...state, volume: action.payload, isMuted: false };
      case "TOGGLE_MUTE":
        return { ...state, isMuted: !state.isMuted };
      case "TOGGLE_SHUFFLE":
        return { ...state, isShuffled: !state.isShuffled };
      case "SET_REPEAT_MODE":
        return { ...state, repeatMode: action.payload };
      default:
        return state;
    }
  })();

  playerStateSubject.notify(newState);
  return newState;
}

const playerStateLogger: Observer = {
  update(state: PlayerState) {
    console.log("Player State Updated:", {
      isPlaying: state.isPlaying,
      currentTrack: state.tracks[state.currentTrackIndex]?.title,
      progress: state.progress,
      volume: state.volume,
    });
  },
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef<HTMLAudioElement>(null);
  const commandInvoker = useRef(new AudioCommandInvoker());

  //Add logger observer
  useEffect(() => {
    playerStateSubject.addObserver(playerStateLogger);
    return () => playerStateSubject.removeObserver(playerStateLogger);
  }, []);

  // Handle play/pause status using Command Pattern
  useEffect(() => {
    if (!audioRef.current) return;

    if (state.isPlaying) {
      const playCommand = new PlayCommand(audioRef.current);
      commandInvoker.current.execute(playCommand);
    } else {
      const pauseCommand = new PauseCommand(audioRef.current);
      commandInvoker.current.execute(pauseCommand);
    }
  }, [state.isPlaying, state.currentTrackIndex]);

  // Handle volume changes using Command Pattern
  useEffect(() => {
    if (!audioRef.current) return;
    const volume = state.isMuted ? 0 : state.volume;
    const volumeCommand = new SetVolumeCommand(audioRef.current, volume);
    commandInvoker.current.execute(volumeCommand);
  }, [state.volume, state.isMuted]);

  // Handle progress updates
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio.duration) {
        dispatch({ type: "SET_PROGRESS", payload: audio.currentTime });
      }
    };

    const handleEnded = () => {
      if (state.repeatMode === "one") {
        const seekCommand = new SeekCommand(audio, 0);
        commandInvoker.current.execute(seekCommand);
        const playCommand = new PlayCommand(audio);
        commandInvoker.current.execute(playCommand);
      } else {
        dispatch({ type: "NEXT_TRACK" });
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [state.repeatMode]);

  return (
    <PlayerContext.Provider
      value={{
        state,
        dispatch,
        audioRef,
        commandInvoker: commandInvoker.current,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        src={state.tracks[state.currentTrackIndex]?.audioUrl}
        preload="metadata"
      />
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("userPlayer must be used within a PlayerProvider");
  }
  return context;
};
