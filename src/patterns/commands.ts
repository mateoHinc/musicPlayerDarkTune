// import type { PlayerState, Track, RepeatMode } from "../types/music";

// Command Interface
interface Command {
  execute(): void;
  undo?(): void;
}

// Concrete Commands
export class PlayCommand implements Command {
  private audioElement: HTMLAudioElement;

  constructor(audioElement: HTMLAudioElement) {
    this.audioElement = audioElement;
  }

  execute() {
    this.audioElement.play();
  }

  undo() {
    this.audioElement.pause();
  }
}

export class PauseCommand implements Command {
  private audioElement: HTMLAudioElement;

  constructor(audioElement: HTMLAudioElement) {
    this.audioElement = audioElement;
  }

  execute() {
    this.audioElement.pause();
  }

  undo() {
    this.audioElement.play();
  }
}

export class SetVolumeCommand implements Command {
  private audioElement: HTMLAudioElement;
  private volume: number;
  private previousVolume: number;

  constructor(audioElement: HTMLAudioElement, volume: number) {
    this.audioElement = audioElement;
    this.volume = volume;
    this.previousVolume = audioElement.volume;
  }

  execute() {
    this.previousVolume = this.audioElement.volume;
    this.audioElement.volume = this.volume;
  }

  undo() {
    this.audioElement.volume = this.previousVolume;
  }
}

export class SeekCommand implements Command {
  private audioElement: HTMLAudioElement;
  private time: number;
  private previousTime: number;

  constructor(audioElement: HTMLAudioElement, time: number) {
    this.audioElement = audioElement;
    this.time = time;
    this.previousTime = audioElement.currentTime;
  }

  execute() {
    this.previousTime = this.audioElement.currentTime;
    this.audioElement.currentTime = this.time;
  }

  undo() {
    this.audioElement.currentTime = this.previousTime;
  }
}

// Command Invoker
export class AudioCommandInvoker {
  private commands: Command[] = [];
  private undoStack: Command[] = [];

  execute(command: Command) {
    this.commands.push(command);
    this.undoStack = [];
  }

  undo() {
    const command = this.commands.pop();
    if (command?.undo) {
      command.undo();
      this.undoStack.push(command);
    }
  }

  redo() {
    const command = this.undoStack.pop();
    if (command) {
      command.execute();
      this.commands.push(command);
    }
  }
}
