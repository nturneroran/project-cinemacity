import { SceneDeck } from '../SceneDeck';
import { SceneCard } from '../SceneCard';
import { Role } from '../Role';
import { SceneCardData } from '../types';

/**
 * DESIGN PATTERN: Factory
 *
 * Converts raw JSON scene-card data into SceneCard domain objects,
 * then packages them into a shuffled SceneDeck.
 */
export class SceneDeckFactory {
  /**
   * Create a shuffled SceneDeck from the provided raw data array.
   * Shuffling is deterministic in tests when a seed is not needed;
   * random shuffle is used for normal gameplay.
   */
  static create(sceneCardsData: SceneCardData[], shuffle: boolean = true): SceneDeck {
    const cards = sceneCardsData.map((data) =>
      SceneDeckFactory.createCard(data),
    );
    if (shuffle) {
      SceneDeckFactory.shuffleInPlace(cards);
    }
    return new SceneDeck(cards);
  }

  static createCard(data: SceneCardData): SceneCard {
    const roles = data.roles.map((r) => {
      return new Role(r.id, r.name, r.requiredRank, r.pay, true /* isOnCard */, r.line);
    });
    return new SceneCard(data.id, data.title, data.description, data.budget, data.shots, roles);
  }

  /** Fisher-Yates shuffle, mutates in place. */
  private static shuffleInPlace<T>(arr: T[]): void {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
}
