import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react";
import { PlayerState, PlayerAction, Track, RepeatMode } from "../types/music";
import { sampleTracks } from "../data/sampleTracks";
import {
  AudioCommandInvoker,
  PlayCommand,
  PauseCommand,
  SetVolumeCommand,
  SeekCommand,
} from "../patterns/commands";
import { Subject, Observer } from "../patterns/observer";

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
      audioRef: React.RefObject<HTMLAudioElement>;
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
