import { Role } from './Role';

/**
 * A scene card placed at a Location.
 *
 * Responsibility: track remaining shot counters and on-card roles.
 * Does NOT know about the board, players, or rewards — those are
 * managed by the Game class when a scene wraps.
 */
export class SceneCard {
  private _remainingShots: number;
  private _isWrapped: boolean = false;

  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    /**
     * The acting difficulty for this scene. A player must roll
     * (die + rehearsal tokens) >= budget to succeed.
     */
    public readonly budget: number,
    public readonly totalShots: number,
    /** On-card roles — created by SceneDeckFactory and owned by this card. */
    public readonly roles: Role[],
  ) {
    this._remainingShots = totalShots;
  }

  get remainingShots(): number {
    return this._remainingShots;
  }

  get isWrapped(): boolean {
    return this._isWrapped;
  }

  /**
   * Remove one shot counter.
   * @returns true if the scene is now wrapped (all shots removed).
   *
   * TODO: implement this method
   * Hint: decrement _remainingShots (not below 0), set _isWrapped when it reaches 0, return _isWrapped
   */
  removeShot(): boolean {
    throw new Error('Not implemented');
  }

  /** Return on-card roles that are not yet taken. */
  getAvailableRoles(): Role[] {
    return this.roles.filter((r) => r.isAvailable());
  }
}
