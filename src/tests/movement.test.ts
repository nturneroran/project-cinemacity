import { describe, it, expect } from 'vitest';
import { makeMinimalGame, makeGame } from './helpers';

describe('Movement rules', () => {
  it('allows moving to an adjacent location', () => {
    // TODO: implement this test
    // Hint: use makeMinimalGame(); call game.move('locB'); assert result.success and updated locationId
    expect(true).toBe(false);
  });

  it('rejects moving to a non-adjacent location', () => {
    // TODO: implement this test
    // Hint: use makeGame(); trailerPark and soundStage are NOT adjacent; assert result.success === false
    expect(true).toBe(false);
  });

  it('prevents moving while committed to a role', () => {
    // TODO: implement this test
    // Hint: take a role first (alice.takeRole + scene.roles[0].assign), then try to move
    expect(true).toBe(false);
  });

  it('prevents moving twice in the same turn', () => {
    // TODO: implement this test
    // Hint: move once to locB successfully, then try to move again; second should fail
    expect(true).toBe(false);
  });

  it('updates player location after a successful move', () => {
    // TODO: implement this test
    // Hint: assert locationId before and after a successful move
    expect(true).toBe(false);
  });

  it('allows movement again after turn ends', () => {
    // TODO: implement this test
    // Hint: move, endTurn for both players, then move again successfully
    expect(true).toBe(false);
  });
});
