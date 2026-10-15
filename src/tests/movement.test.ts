import { describe, it, expect } from 'vitest';
import { makeMinimalGame, makeGame } from './helpers';

describe('Movement rules', () => {
  it('allows moving to an adjacent location', () => {
    const { game } = makeMinimalGame();

    const result = game.move('locB');

    expect(result.success).toBe(true);
    expect(game.currentPlayer.locationId).toBe('locB');
  });

  it('rejects moving to a non-adjacent location', () => {
    const game = makeGame(['Alice', 'Bob'], () => 4);

    const result = game.move('soundStage');

    expect(result.success).toBe(false);
  });

  it('prevents moving while committed to a role', () => {
    const { game, locA, alice } = makeMinimalGame();
    const sceneRole = locA.currentScene!.roles[0];
    sceneRole.assign(alice.id);
    alice.takeRole(sceneRole.id, true);

    const result = game.move('locB');

    expect(result.success).toBe(false);
    expect(result.message.toLowerCase()).toContain('role');
  });

  it('prevents moving twice in the same turn', () => {
    const { game } = makeMinimalGame();

    const first = game.move('locB');
    const second = game.move('locA');

    expect(first.success).toBe(true);
    expect(second.success).toBe(false);
    expect(second.message.toLowerCase()).toContain('already');
  });

  it('updates player location after a successful move', () => {
    const { game } = makeMinimalGame();

    expect(game.currentPlayer.locationId).toBe('locA');
    const result = game.move('locB');

    expect(result.success).toBe(true);
    expect(game.currentPlayer.locationId).toBe('locB');
  });

  it('allows movement again after turn ends', () => {
    const { game } = makeMinimalGame();

    const first = game.move('locB');
    game.endTurn();
    game.endTurn();
    const second = game.move('locA');

    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    expect(game.currentPlayer.locationId).toBe('locA');
  });
});
