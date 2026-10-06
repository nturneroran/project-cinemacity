/**
 * Represents a single role that a player can occupy.
 *
 * A role may be:
 *  - On-card: printed on a SceneCard. Vacated when the scene wraps.
 *  - Off-card: permanently attached to a Location. Also vacated on scene wrap.
 *
 * Responsibility: know who (if anyone) holds this role and whether it is
 * available. Does NOT know about game rules or rewards.
 */
export class Role {
  private _takenByPlayerId: string | null = null;

  constructor(
    public readonly id: string,
    public readonly name: string,
    /** Minimum player rank required to take this role. */
    public readonly requiredRank: number,
    /** Credits earned by the player who holds this role when the scene wraps. */
    public readonly pay: number,
    /** True if this role appears on the scene card; false if it is a location role. */
    public readonly isOnCard: boolean,
    /** Sample dialogue line shown in the UI. */
    public readonly line: string,
  ) {}

  get takenByPlayerId(): string | null {
    return this._takenByPlayerId;
  }

  // TODO: implement this method
  // Hint: returns true when no player currently holds this role
  isAvailable(): boolean {
    throw new Error('Not implemented');
  }

  // TODO: implement this method
  // Hint: record that the given player now occupies this role
  assign(playerId: string): void {
    throw new Error('Not implemented');
  }

  // TODO: implement this method
  // Hint: clear the player assignment so this role is available again
  vacate(): void {
    throw new Error('Not implemented');
  }
}
