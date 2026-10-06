import { describe, it, expect } from 'vitest';
import { makeGame, makeMinimalGame } from './helpers';

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
    const game = makeGame();
    const alice = game.players[0];
    alice.earnCredits(3);
    alice.earnReputation(4);
    expect(alice.calculateScore()).toBe(17);
  });

  it('emits stateChanged events on player actions', () => {
    const game = makeGame();
    const events: string[] = [];
    game.events.subscribe((event) => events.push(event.type));
    game.endTurn();
    expect(events.filter((type) => type === 'stateChanged')).toHaveLength(1);
  });

  it('emits turnEnded event with correct player references', () => {
    const game = makeGame();
    let turnEnded: { previousPlayer: string; nextPlayer: string } | undefined;
    game.events.subscribe((event) => {
      if (event.type === 'turnEnded') {
        turnEnded = {
          previousPlayer: event.payload.previousPlayer.name,
          nextPlayer: event.payload.nextPlayer.name,
        };
      }
    });
    game.endTurn();
    expect(turnEnded).toEqual({ previousPlayer: 'Alice', nextPlayer: 'Bob' });
  });

  it('does not allow game actions after game over', () => {
    const game = makeGame();
    Reflect.set(game, '_isOver', true);
    const result = game.endTurn();
    expect(result.success).toBe(false);
    expect(result.message).toContain('over');
  });

  it('has expected starting locations for all players', () => {
    const game = makeGame(['Alice', 'Bob', 'Carol']);
    expect(game.players.map((player) => player.locationId)).toEqual([
      'trailerPark',
      'trailerPark',
      'trailerPark',
    ]);
  });

  it('board has at least one upgrade location', () => {
    const game = makeGame();
    expect(game.board.getAllLocations().filter((location) => location.isUpgradeLocation).length)
      .toBeGreaterThan(0);
  });

  it('all non-upgrade locations start with a scene card', () => {
    const game = makeGame();
    expect(game.board.getSceneLocations().every((location) => location.hasScene())).toBe(true);
  });

  it('game emits gameOver event when game ends', () => {
    const { game, locA } = makeMinimalGame({ shots: 1, budget: 1, rollDie: () => 6 });
    game.board.getLocation('locB').clearScene();
    const events: string[] = [];
    game.events.subscribe((event) => events.push(event.type));
    game.takeRole('scene-a-lead');
    game.act();
    expect(game.isOver).toBe(true);
    expect(events).toContain('gameOver');
  });

  it('game winner is the player with the highest score', () => {
    const { game, alice } = makeMinimalGame({ shots: 1, budget: 1, rollDie: () => 6 });
    game.board.getLocation('locB').clearScene();
    alice.earnCredits(100);
    let winnerId: string | undefined;
    game.events.subscribe((event) => {
      if (event.type === 'gameOver') winnerId = event.payload.winner.id;
    });
    game.takeRole('scene-a-lead');
    game.act();
    expect(winnerId).toBe(alice.id);
  });

  it('remainingScenes decreases after a scene wraps', () => {
    const game = makeGame(['Alice', 'Bob'], () => 6);
    const location = game.board.getLocation('trailerPark');
    const scene = location.currentScene!;
    while (scene.remainingShots > 1) scene.removeShot();
    const role = scene.getAvailableRoles().find((candidate) => candidate.requiredRank <= game.currentPlayer.rank)!;
    const remainingBefore = game.remainingScenes;
    expect(game.takeRole(role.id).success).toBe(true);
    expect(game.act().sceneCompleted).toBe(true);
    expect(game.remainingScenes).toBe(remainingBefore - 1);
  });
});
