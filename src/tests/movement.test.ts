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
    const alice = game.players[0];
    const result = game.move('soundStage');
    expect(result.success).toBe(false);
    expect(alice.locationId).toBe('trailerPark');
  });

  it('prevents moving while committed to a role', () => {
    const { game, alice } = makeMinimalGame();
    expect(game.takeRole('scene-a-lead').success).toBe(true);
    const result = game.move('locB');
    expect(result.success).toBe(false);
    expect(alice.locationId).toBe('locA');
  });

  it('prevents moving twice in the same turn', () => {
    const { game } = makeMinimalGame();
    expect(game.move('locB').success).toBe(true);
    const result = game.move('locA');
    expect(result.success).toBe(false);
  });

  it('updates player location after a successful move', () => {
    const { game, alice } = makeMinimalGame();
    expect(alice.locationId).toBe('locA');
    expect(game.move('locB').success).toBe(true);
    expect(alice.locationId).toBe('locB');
  });

  it('allows movement again after turn ends', () => {
    const { game, alice } = makeMinimalGame();
    expect(game.move('locB').success).toBe(true);
    expect(game.endTurn().success).toBe(true);
    expect(game.endTurn().success).toBe(true);
    expect(game.move('locA').success).toBe(true);
    expect(alice.locationId).toBe('locA');
  });
});
