import { ActionResult } from '../types';

/**
 * DESIGN PATTERN: Command
 *
 * Every player action is represented as an object that implements this interface.
 * Each action knows how to:
 *  1. validate() — check whether the action is legal given the current game state.
 *  2. execute() — carry out the action (calls validate() internally).
 *
 * Benefits for this course:
 *  - Separates action definition from action dispatch (Game just calls execute()).
 *  - Makes actions independently testable (mock only what the action needs).
 *  - Allows easy action history or undo in an extended version.
 *  - Keeps the Game class from becoming a god object.
 */
export interface Action {
  readonly type: string;

  /**
   * Check legality without mutating state.
   * Returns { success: false, message: reason } if illegal.
   */
  validate(): ActionResult;

  /**
   * Execute the action. Calls validate() first; returns the validation
   * result unchanged if the action is illegal.
   */
  execute(): ActionResult;
}
