import { describe, it, expect } from 'vitest';
import { makeGame } from './helpers';
import { Role } from '../domain/Role';
import { SceneCard } from '../domain/SceneCard';

/**
 * Integration-level tests covering game-over and winner logic.
 * These use the real JSON data loaded through the factories.
 */
describe('Game state', () => {
  it('starts with isOver === false', () => {
    const game = makeGame();

    expect(game.isOver).toBe(false);
  });

  it('starts with completedScenes === 0', () => {
    const game = makeGame();

    expect(game.completedScenes).toBe(0);
  });

  it('does not end while scenes are still active', () => {
    const game = makeGame();
    game.endTurn();
    game.endTurn();

    expect(game.isOver).toBe(false);
  });

  it('Player.calculateScore returns correct formula (rep×2 + credits + rank)', () => {
    const game = makeGame(['Alice', 'Bob']);
    const alice = game.players[0];

    alice.earnCredits(3); // 8 total credits
    alice.earnReputation(4); // 4 rep
    alice.upgradeRank(3);

    expect(alice.calculateScore()).toBe(4 * 2 + 8 + 3);
  });

  it('emits stateChanged events on player actions', () => {
    const game = makeGame();
    let stateChangedCount = 0;

    game.events.subscribe((event) => {
      if (event.type === 'stateChanged') stateChangedCount += 1;
    });

    game.endTurn();

    expect(stateChangedCount).toBeGreaterThan(0);
  });

  it('emits turnEnded event with correct player references', () => {
    const game = makeGame(['Alice', 'Bob']);
    let payload: any = null;

    game.events.subscribe((event) => {
      if (event.type === 'turnEnded') payload = event.payload;
    });

    game.endTurn();

    expect(payload).not.toBeNull();
    expect(payload.previousPlayer.name).toBe('Alice');
    expect(payload.nextPlayer.name).toBe('Bob');
  });

  it('does not allow game actions after game over', () => {
    const game = makeGame();
    (game as any)._isOver = true;

    const result = game.endTurn();

    expect(result.success).toBe(false);
    expect(result.message.toLowerCase()).toContain('over');
  });

  it('has expected starting locations for all players', () => {
    const game = makeGame(['Alice', 'Bob', 'Cara']);

    expect(game.players.map((p) => p.locationId)).toEqual(['trailerPark', 'trailerPark', 'trailerPark']);
  });

  it('board has at least one upgrade location', () => {
    const game = makeGame();
    const upgrades = game.board.getAllLocations().filter((loc) => loc.isUpgradeLocation);

    expect(upgrades.length).toBeGreaterThan(0);
  });

  it('all non-upgrade locations start with a scene card', () => {
    const game = makeGame();

    const allHaveScenes = game.board.getSceneLocations().every((location) => location.hasScene());

    expect(allHaveScenes).toBe(true);
  });

  it('game emits gameOver event when game ends', () => {
    const game = makeGame();
    let seenGameOver = false;

    game.events.subscribe((event) => {
      if (event.type === 'gameOver') seenGameOver = true;
    });

    const internalDeck = (game as any)._sceneDeck;
    while (!internalDeck.isEmpty()) internalDeck.draw();
    for (const loc of game.board.getSceneLocations()) loc.clearScene();
    (game as any)._checkGameOver();

    expect(game.isOver).toBe(true);
    expect(seenGameOver).toBe(true);
  });

  it('game winner is the player with the highest score', () => {
    const game = makeGame(['Alice', 'Bob']);
    const [alice, bob] = game.players;

    alice.earnCredits(10);
    alice.earnReputation(5);
    bob.earnCredits(1);

    let winnerName = '';
    game.events.subscribe((event) => {
      if (event.type === 'gameOver') winnerName = event.payload.winner.name;
    });

    const internalDeck = (game as any)._sceneDeck;
    while (!internalDeck.isEmpty()) internalDeck.draw();
    for (const loc of game.board.getSceneLocations()) loc.clearScene();
    (game as any)._checkGameOver();

    expect(winnerName).toBe('Alice');
  });

  it('remainingScenes decreases after a scene wraps', () => {
    const game = makeGame(['Alice', 'Bob'], () => 6);
    const targetLocation = game.board.getNeighbors('trailerPark').find((loc) => loc.hasScene())!;

    targetLocation.setScene(
      new SceneCard('test-scene', 'Test Scene', 'For test', 1, 1, [
        new Role('test-role', 'Test Role', 1, 2, true, 'Line'),
      ]),
    );

    const beforeRemaining = game.remainingScenes;
    game.move(targetLocation.id);
    game.takeRole('test-role');
    const result = game.act();

    expect(result.success).toBe(true);
    expect(result.sceneCompleted).toBe(true);
    expect(game.remainingScenes).toBe(beforeRemaining - 1);
  });
});
