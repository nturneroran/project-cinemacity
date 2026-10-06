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

  // TODO: implement this method
  // Hint: look up the id in _locations; throw Error(`Unknown location ID: "${id}"`) if not found
  getLocation(id: string): Location {
    throw new Error('Not implemented');
  }

  getAllLocations(): Location[] {
    return Array.from(this._locations.values());
  }

  // TODO: implement this method
  // Hint: get the location, then map its neighborIds to Location objects using getLocation
  getNeighbors(locationId: string): Location[] {
    throw new Error('Not implemented');
  }

  // TODO: implement this method
  // Hint: delegate to Location.isNeighborOf
  isNeighbor(fromId: string, toId: string): boolean {
    throw new Error('Not implemented');
  }

  /**
   * Returns all locations that can receive scene cards.
   * Upgrade locations are excluded since they never host scenes.
   *
   * TODO: implement this method
   * Hint: filter getAllLocations() where isUpgradeLocation is false
   */
  getSceneLocations(): Location[] {
    throw new Error('Not implemented');
  }

  /**
   * Convenience: return the single upgrade location (throws if none).
   *
   * TODO: implement this method
   * Hint: find a location where isUpgradeLocation is true; throw if none
   */
  getUpgradeLocation(): Location {
    throw new Error('Not implemented');
  }
}
