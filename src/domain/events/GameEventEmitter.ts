import { GameEvent } from './GameEvents';

type Listener = (event: GameEvent) => void;

/**
 * A simple, typed publish/subscribe event bus.
 *
 * DESIGN PATTERN: Observer
 *
 * The domain (Game) emits events; the UI (GameRenderer) subscribes to them.
 * This keeps the two layers decoupled: the domain never imports UI code,
 * and the UI reacts to state changes rather than polling.
 *
 * Usage:
 *   const unsub = emitter.subscribe(event => { ... });
 *   // later:
 *   unsub(); // remove listener
 */
export class GameEventEmitter {
  private _listeners: Listener[] = [];

  /** Subscribe to all game events. Returns an unsubscribe function. */
  subscribe(listener: Listener): () => void {
    this._listeners.push(listener);
    return () => {
      this._listeners = this._listeners.filter((l) => l !== listener);
    };
  }

  emit(event: GameEvent): void {
    for (const listener of this._listeners) {
      listener(event);
    }
  }
}
