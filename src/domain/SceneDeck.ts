import { SceneCard } from './SceneCard';

/**
 * The draw pile of scene cards, shuffled at game start.
 *
 * Responsibility: provide the next scene card on demand and report
 * when the deck is exhausted (which triggers game-over checks).
 */
export class SceneDeck {
  private _cards: SceneCard[];

  constructor(cards: SceneCard[]) {
    // Shallow copy so the original array is not mutated by draw().
    this._cards = [...cards];
  }

  /**
   * Draw and remove the top card from the deck.
   * Returns null if the deck is empty.
   *
   */
  draw(): SceneCard | null {
    return this._cards.shift() ?? null;
  }

  get remaining(): number {
    return this._cards.length;
  }

  isEmpty(): boolean {
    return this._cards.length === 0;
  }
}
