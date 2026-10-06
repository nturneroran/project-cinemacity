/**
 * Test helpers — creates minimal domain objects for unit tests
 * without relying on JSON files or the GameFactory.
 *
 * This approach lets tests control every parameter precisely and
 * verifies that domain classes work independently of data loading.
 */
import { Game } from '../domain/Game';
import { Board } from '../domain/Board';
import { Location } from '../domain/Location';
import { Player } from '../domain/Player';
import { Role } from '../domain/Role';
import { SceneCard } from '../domain/SceneCard';
import { SceneDeck } from '../domain/SceneDeck';
import { BoardFactory } from '../domain/factories/BoardFactory';
import { SceneDeckFactory } from '../domain/factories/SceneDeckFactory';
import locationsData from '../data/locations.json';
import sceneCardsData from '../data/scenecards.json';

// --- Minimal object builders ---

export function makeRole(overrides: Partial<{
  id: string; name: string; requiredRank: number; pay: number; isOnCard: boolean; line: string;
}> = {}): Role {
  return new Role(
    overrides.id ?? 'role-test',
    overrides.name ?? 'Test Role',
    overrides.requiredRank ?? 1,
    overrides.pay ?? 2,
    overrides.isOnCard ?? true,
    overrides.line ?? 'Test line.',
  );
}

export function makeScene(overrides: Partial<{
  id: string; title: string; budget: number; shots: number; roles: Role[];
}> = {}): SceneCard {
  const roles = overrides.roles ?? [
    makeRole({ id: 'r-lead', name: 'Lead', requiredRank: 2, pay: 3, isOnCard: true }),
    makeRole({ id: 'r-support', name: 'Support', requiredRank: 1, pay: 1, isOnCard: true }),
  ];
  return new SceneCard(
    overrides.id ?? 'scene-test',
    overrides.title ?? 'Test Scene',
    'A scene for testing.',
    overrides.budget ?? 3,
    overrides.shots ?? 2,
    roles,
  );
}

export function makeLocation(overrides: Partial<{
  id: string; name: string; neighbors: string[]; offCardRoles: Role[]; isUpgradeLocation: boolean;
}> = {}): Location {
  return new Location(
    overrides.id ?? 'loc-a',
    overrides.name ?? 'Location A',
    'Test location.',
    overrides.neighbors ?? [],
    overrides.offCardRoles ?? [],
    overrides.isUpgradeLocation ?? false,
  );
}

export function makePlayer(overrides: Partial<{
  id: string; name: string; color: string; locationId: string;
  rank: number; credits: number; reputation: number;
}> = {}): Player {
  return new Player(
    overrides.id ?? 'player-test',
    overrides.name ?? 'Tester',
    overrides.color ?? 'red',
    overrides.locationId ?? 'loc-a',
    overrides.rank ?? 1,
    overrides.credits ?? 5,
    overrides.reputation ?? 0,
  );
}

// --- Full game with fixed die roll ---

/**
 * Creates a fully initialized Game using the real JSON data files.
 * Pass rollDie to control act outcomes in tests.
 */
export function makeGame(
  playerNames: string[] = ['Alice', 'Bob'],
  rollDie: () => number = () => 4,
): Game {
  const board = BoardFactory.create(locationsData);
  const deck = SceneDeckFactory.create(sceneCardsData, false /* no shuffle */);
  const players = playerNames.map(
    (name, i) =>
      new Player(`player-${i}`, name, ['red', 'blue', 'green', 'yellow'][i], 'trailerPark', 1, 5, 0),
  );
  // Deal scenes to non-upgrade locations.
  const sceneLocations = board.getSceneLocations();
  for (const loc of sceneLocations) {
    if (!deck.isEmpty()) {
      const card = deck.draw();
      if (card) loc.setScene(card);
    }
  }
  return new Game(board, players, deck, rollDie);
}

/**
 * Creates a minimal 2-player game with a hand-crafted board (no JSON).
 * Useful for testing exact state without side effects from the real data.
 *
 * Map:  locA ─── locB ─── upgrade
 *       (scene)  (scene)
 */
export function makeMinimalGame(overrides: {
  budget?: number;
  shots?: number;
  rollDie?: () => number;
  playerRank?: number;
  playerCredits?: number;
  playerReputation?: number;
} = {}): {
  game: Game;
  locA: Location;
  locB: Location;
  upgrade: Location;
  alice: Player;
  bob: Player;
} {
  const offCardA = new Role('loc-a-extra', 'Extra', 1, 1, false, 'I am extra.');
  const locA = new Location('locA', 'Lot A', 'Filming lot A.', ['locB', 'upgrade'], [offCardA], false);

  const offCardB = new Role('loc-b-tech', 'Technician', 2, 1, false, 'Technical work.');
  const locB = new Location('locB', 'Lot B', 'Filming lot B.', ['locA'], [offCardB], false);

  const upgrade = new Location('upgrade', 'Agency', 'Casting agency.', ['locA'], [], true);

  const board = new Board([locA, locB, upgrade]);

  const sceneRoleA = makeRole({ id: 'scene-a-lead', name: 'Lead', requiredRank: 2, pay: 3, isOnCard: true });
  const sceneA = makeScene({ id: 'sceneA', budget: overrides.budget ?? 3, shots: overrides.shots ?? 2, roles: [sceneRoleA] });
  locA.setScene(sceneA);

  const sceneRoleB = makeRole({ id: 'scene-b-lead', name: 'Star', requiredRank: 1, pay: 2, isOnCard: true });
  const sceneB = makeScene({ id: 'sceneB', budget: overrides.budget ?? 3, shots: overrides.shots ?? 2, roles: [sceneRoleB] });
  locB.setScene(sceneB);

  const alice = new Player('alice', 'Alice', 'red', 'locA', overrides.playerRank ?? 2, overrides.playerCredits ?? 5, overrides.playerReputation ?? 0);
  const bob = new Player('bob', 'Bob', 'blue', 'locA', overrides.playerRank ?? 2, overrides.playerCredits ?? 5, overrides.playerReputation ?? 0);

  const deck = new SceneDeck([]);
  const game = new Game(board, [alice, bob], deck, overrides.rollDie ?? (() => 4));

  return { game, locA, locB, upgrade, alice, bob };
}
