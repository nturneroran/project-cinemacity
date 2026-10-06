import { Game } from '../Game';
import { Player } from '../Player';
import { BoardFactory } from './BoardFactory';
import { SceneDeckFactory } from './SceneDeckFactory';
import { LocationData, SceneCardData } from '../types';

/** The four colors assigned to players in order. */
const PLAYER_COLORS: string[] = ['red', 'blue', 'green', 'yellow'];

/** Location ID where all players begin the game. */
const STARTING_LOCATION = 'trailerPark';

/**
 * DESIGN PATTERN: Factory
 *
 * Assembles a fully initialized Game from raw data and player names.
 * This is the single entry point for constructing the entire game object
 * graph — callers do not need to know about the internal structure.
 *
 * Usage (from main.ts):
 *   const game = GameFactory.create(['Alice', 'Bob'], locationsData, sceneCardsData);
 *
 * Usage (from tests):
 *   const game = GameFactory.create(['Alice', 'Bob'], locationsData, sceneCardsData,
 *                                   () => 4); // fixed die roll
 */
export class GameFactory {
  static create(
    playerNames: string[],
    locationsData: LocationData[],
    sceneCardsData: SceneCardData[],
    rollDie?: () => number,
    shuffleDeck: boolean = true,
  ): Game {
    if (playerNames.length < 2 || playerNames.length > 4) {
      throw new Error('CinemaCity requires 2–4 players.');
    }

    // Build board from JSON.
    const board = BoardFactory.create(locationsData);

    // Build shuffled scene deck from JSON.
    const deck = SceneDeckFactory.create(sceneCardsData, shuffleDeck);

    // Create player objects (each starts at Trailer Park with rank 1 and 2 credits).
    const players = playerNames.map(
      (name, index) =>
        new Player(
          `player-${index}`,
          name,
          PLAYER_COLORS[index],
          STARTING_LOCATION,
          1,   // rank
          2,   // starting credits
          0,   // starting reputation
        ),
    );

    // Deal one scene card to each non-upgrade location.
    const sceneLocations = board.getSceneLocations();
    for (const location of sceneLocations) {
      if (!deck.isEmpty()) {
        const card = deck.draw();
        if (card) location.setScene(card);
      }
    }

    return new Game(board, players, deck, rollDie);
  }
}
