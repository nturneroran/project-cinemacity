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

  isAvailable(): boolean {
    return this._takenByPlayerId === null;
  }

  assign(playerId: string): void {
    if (!this.isAvailable()) {
      throw new Error(`Role "${this.id}" is already taken.`);
    }
    this._takenByPlayerId = playerId;
  }

  vacate(): void {
    this._takenByPlayerId = null;
  }
}
