import { Location } from './Location';

/**
 * The game board: an indexed collection of interconnected locations.
 *
 * Responsibilities:
 *  - Store and retrieve Location objects by ID.
 *  - Answer neighbor queries (used by MoveAction for validation).
 *  - Provide filtered subsets of locations (e.g., scene-eligible locations).
 *
 * Does NOT know about players, turns, or rules.
 */
export class Board {
  private readonly _locations: Map<string, Location>;

  constructor(locations: Location[]) {
    this._locations = new Map(locations.map((l) => [l.id, l]));
  }

  getLocation(id: string): Location {
    const location = this._locations.get(id);
    if (!location) throw new Error(`Unknown location ID: "${id}"`);
    return location;
  }

  getAllLocations(): Location[] {
    return Array.from(this._locations.values());
  }

  getNeighbors(locationId: string): Location[] {
    return this.getLocation(locationId).neighborIds.map((id) => this.getLocation(id));
  }

  isNeighbor(fromId: string, toId: string): boolean {
    return this.getLocation(fromId).isNeighborOf(toId);
  }

  /**
   * Returns all locations that can receive scene cards.
   * Upgrade locations are excluded since they never host scenes.
   *
   * Upgrade locations are excluded because they never receive scene cards.
   */
  getSceneLocations(): Location[] {
    return this.getAllLocations().filter((location) => !location.isUpgradeLocation);
  }

  /**
   * Convenience: return the single upgrade location (throws if none).
   *
   * Throws if the board does not contain an upgrade location.
   */
  getUpgradeLocation(): Location {
    const location = this.getAllLocations().find((candidate) => candidate.isUpgradeLocation);
    if (!location) throw new Error('Board has no upgrade location.');
    return location;
  }
}
