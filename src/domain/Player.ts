/**
 * Represents a single player in the game.
 *
 * Responsibilities:
 *  - Own all player state: identity, position, rank, resources, role, tokens.
 *  - Provide mutation methods that validate preconditions (e.g., spendCredits).
 *  - Calculate the final score for winner determination.
 *
 * Does NOT know about the board, rules, or other players.
 */
export class Player {
  private _locationId: string;
  private _rank: number;
  private _credits: number;
  private _reputation: number;
  private _currentRoleId: string | null = null;
  private _currentRoleIsOnCard: boolean = false;
  private _rehearsalTokens: number = 0;

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly color: string,
    startingLocationId: string,
    startingRank: number = 1,
    startingCredits: number = 2,
    startingReputation: number = 0,
  ) {
    this._locationId = startingLocationId;
    this._rank = startingRank;
    this._credits = startingCredits;
    this._reputation = startingReputation;
  }

  // --- Getters ---

  get locationId(): string {
    return this._locationId;
  }
  get rank(): number {
    return this._rank;
  }
  get credits(): number {
    return this._credits;
  }
  get reputation(): number {
    return this._reputation;
  }
  get currentRoleId(): string | null {
    return this._currentRoleId;
  }
  get currentRoleIsOnCard(): boolean {
    return this._currentRoleIsOnCard;
  }
  get rehearsalTokens(): number {
    return this._rehearsalTokens;
  }

  hasRole(): boolean {
    return this._currentRoleId !== null;
  }

  // --- Mutators ---

  // TODO: implement this method
  // Hint: update _locationId to the given locationId
  moveTo(locationId: string): void {
    throw new Error('Not implemented');
  }

  // TODO: implement this method
  // Hint: set _currentRoleId and _currentRoleIsOnCard; reset _rehearsalTokens to 0
  takeRole(roleId: string, isOnCard: boolean): void {
    throw new Error('Not implemented');
  }

  // TODO: implement this method
  // Hint: set _currentRoleId to null, _currentRoleIsOnCard to false, _rehearsalTokens to 0
  clearRole(): void {
    throw new Error('Not implemented');
  }

  // TODO: implement this method
  // Hint: increment _rehearsalTokens by 1
  addRehearsalToken(): void {
    throw new Error('Not implemented');
  }

  earnCredits(amount: number): void {
    this._credits += amount;
  }

  earnReputation(amount: number): void {
    this._reputation += amount;
  }

  // TODO: implement this method
  // Hint: throw if amount > _credits; otherwise deduct from _credits
  spendCredits(amount: number): void {
    throw new Error('Not implemented');
  }

  // TODO: implement this method
  // Hint: throw if amount > _reputation; otherwise deduct from _reputation
  spendReputation(amount: number): void {
    throw new Error('Not implemented');
  }

  // TODO: implement this method
  // Hint: set _rank to toRank
  upgradeRank(toRank: number): void {
    throw new Error('Not implemented');
  }

  /**
   * Final score for winner calculation.
   * Formula: reputation × 2 + credits + rank
   * Reputation is worth the most because it reflects artistic success.
   *
   * TODO: implement this method
   * Hint: return _reputation * 2 + _credits + _rank
   */
  calculateScore(): number {
    throw new Error('Not implemented');
  }
}
