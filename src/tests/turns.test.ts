import { describe, it, expect } from 'vitest';
import { makeMinimalGame } from './helpers';

describe('Turn management', () => {
  it('starts with the first player active', () => {
    // TODO: implement this test
    // Hint: makeMinimalGame(); assert game.currentPlayer.id === alice.id
    expect(true).toBe(false);
  });

  it('advances to the next player after endTurn', () => {
    // TODO: implement this test
    // Hint: endTurn(); assert game.currentPlayer.id === bob.id
    expect(true).toBe(false);
  });

  it('wraps back to the first player after all have gone', () => {
    // TODO: implement this test
    // Hint: endTurn twice; assert game.currentPlayer.id === alice.id
    expect(true).toBe(false);
  });

  it('increments turn number after all players complete a round', () => {
    // TODO: implement this test
    // Hint: turnNumber starts at 1; after both players end turn it becomes 2
    expect(true).toBe(false);
  });

  it('resets hasMoved flag when turn advances', () => {
    // TODO: implement this test
    // Hint: move (hasMoved===true), endTurn; Bob's turn — hasMoved should be false
    expect(true).toBe(false);
  });

  it('resets hasActed flag when turn advances', () => {
    // TODO: implement this test
    // Hint: take role, act (hasActed===true), endTurn; hasActed should be false
    expect(true).toBe(false);
  });

  it('resets hasRehearsed flag when turn advances', () => {
    // TODO: implement this test
    // Hint: take role, rehearse (hasRehearsed===true), endTurn; hasRehearsed should be false
    expect(true).toBe(false);
  });

  it('endTurn always succeeds (pass is always legal)', () => {
    // TODO: implement this test
    // Hint: call endTurn without taking any action; assert result.success === true
    expect(true).toBe(false);
  });
});
