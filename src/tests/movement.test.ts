import { describe, it, expect } from 'vitest';
import { makeMinimalGame, makeGame } from './helpers';

describe('Movement rules', () => {
  it('allows moving to an adjacent location', () => {
    const { game, alice } = makeMinimalGame();
    const result = game.move('locB');
    expect(result.success).toBe(true);
    expect(alice.locationId).toBe('locB');
  });

  it('rejects moving to a non-adjacent location', () => {
    const game = makeGame();
    const result = game.move('soundStage');
    expect(result.success).toBe(false);
  });

  it('prevents moving while committed to a role', () => {
    const { game, alice, locA } = makeMinimalGame();
    const role = locA.currentScene!.roles[0];
    alice.takeRole(role.id, role.isOnCard);
    role.assign(alice.id);
    const result = game.move('locB');
    expect(result.success).toBe(false);
    expect(result.message).toContain('role');
  });

  it('prevents moving twice in the same turn', () => {
    const { game } = makeMinimalGame();
    expect(game.move('locB').success).toBe(true);
    expect(game.move('locA').success).toBe(false);
  });

  it('updates player location after a successful move', () => {
    const { game, alice } = makeMinimalGame();
    expect(alice.locationId).toBe('locA');
    game.move('locB');
    expect(alice.locationId).toBe('locB');
  });

  it('allows movement again after turn ends', () => {
    const { game } = makeMinimalGame();
    expect(game.move('locB').success).toBe(true);
    game.endTurn();
    game.endTurn();
    expect(game.move('locA').success).toBe(true);
  });
});
