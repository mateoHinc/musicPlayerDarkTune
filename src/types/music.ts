export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // En segundo //In seconds
  coverUrl: string;
  audioUrl: string;
}

export type RepeatMode = "off" | "all" | "one";

export interface PlayerState {
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  progress: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;
}

export type PlayerAction =
  | { type: "SET_TRACKS"; payload: Track[] }
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "TOGGLE_PLAY" }
  | { type: "NEXT_TRACK" }
  | { type: "PREV_TRACK" }
  | { type: "SET_TRACK_INDEX"; payload: number }
  | { type: "SET_PROGRESS"; payload: number }
  | { type: "SET_VOLUME"; payload: number }
  | { type: "TOGGLE_MUTE" }
  | { type: "TOGGLE_SHUFFLE" }
  | { type: "SET_REPEAT_MODE"; payload: RepeatMode };
