import { describe, it, expect } from 'vitest';
import { makeMinimalGame } from './helpers';

describe('Turn management', () => {
  it('starts with the first player active', () => {
    const { game, alice } = makeMinimalGame();
    expect(game.currentPlayer.id).toBe(alice.id);
  });

  it('advances to the next player after endTurn', () => {
    const { game, bob } = makeMinimalGame();
    game.endTurn();
    expect(game.currentPlayer.id).toBe(bob.id);
  });

  it('wraps back to the first player after all have gone', () => {
    const { game, alice } = makeMinimalGame();
    game.endTurn();
    game.endTurn();
    expect(game.currentPlayer.id).toBe(alice.id);
  });

  it('increments turn number after all players complete a round', () => {
    const { game } = makeMinimalGame();
    expect(game.turnManager.turnNumber).toBe(1);
    game.endTurn();
    game.endTurn();
    expect(game.turnManager.turnNumber).toBe(2);
  });

  it('resets hasMoved flag when turn advances', () => {
    const { game } = makeMinimalGame();
    game.move('locB');
    expect(game.turnManager.hasMoved).toBe(true);
    game.endTurn();
    expect(game.turnManager.hasMoved).toBe(false);
  });

  it('resets hasActed flag when turn advances', () => {
    const { game } = makeMinimalGame();
    game.takeRole('scene-a-lead');
    game.act();
    expect(game.turnManager.hasActed).toBe(true);
    game.endTurn();
    expect(game.turnManager.hasActed).toBe(false);
  });

  it('resets hasRehearsed flag when turn advances', () => {
    const { game } = makeMinimalGame();
    game.takeRole('scene-a-lead');
    game.rehearse();
    expect(game.turnManager.hasRehearsed).toBe(true);
    game.endTurn();
    expect(game.turnManager.hasRehearsed).toBe(false);
  });

  it('endTurn always succeeds (pass is always legal)', () => {
    const { game } = makeMinimalGame();
    expect(game.endTurn().success).toBe(true);
  });
});
