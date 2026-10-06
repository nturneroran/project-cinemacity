import { Game } from '../domain/Game';
import { Currency } from '../domain/types';

/**
 * Handles all DOM events (button clicks) and translates them into Game actions.
 *
 * MVC analogy: this is the Controller layer.
 * It bridges the UI (DOM events) and the domain (Game methods) without
 * containing any business logic of its own.
 *
 * Uses event delegation on the action panel to avoid re-attaching listeners
 * after every re-render.
 */
export class ActionHandler {
  private _lastResult: HTMLElement | null = null;

  constructor(
    private readonly _game: Game,
    private readonly _root: HTMLElement,
  ) {}

  attach(): void {
    this._root.addEventListener('click', (e) => this._handleClick(e));
  }

  private _handleClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    const button = target.closest('button') as HTMLButtonElement | null;
    if (!button || button.disabled) return;

    // Move
    const moveTo = button.dataset['moveTo'];
    if (moveTo) {
      this._exec(() => this._game.move(moveTo));
      return;
    }

    // Take role
    const roleId = button.dataset['roleId'];
    if (roleId) {
      this._exec(() => this._game.takeRole(roleId));
      return;
    }

    // Upgrade
    const upgradeRank = button.dataset['upgradeRank'];
    const upgradeCurrency = button.dataset['upgradeCurrency'] as Currency | undefined;
    if (upgradeRank && upgradeCurrency) {
      this._exec(() => this._game.upgrade(parseInt(upgradeRank, 10), upgradeCurrency));
      return;
    }

    // Fixed-ID buttons
    if (button.id === 'btn-act') {
      this._exec(() => this._game.act());
      return;
    }
    if (button.id === 'btn-rehearse') {
      this._exec(() => this._game.rehearse());
      return;
    }
    if (button.id === 'btn-end-turn') {
      this._exec(() => this._game.endTurn());
      return;
    }
  }

  /**
   * Execute a game action and display the result message briefly.
   * The renderer will re-render via the Observer (stateChanged event).
   */
  private _exec(action: () => { success: boolean; message: string }): void {
    const result = action();
    this._showResult(result.message, result.success);
  }

  private _showResult(message: string, success: boolean): void {
    if (!message) return;
    let el = document.getElementById('action-result');
    if (!el) {
      el = document.createElement('div');
      el.id = 'action-result';
      document.querySelector('.action-section')?.prepend(el);
    }
    el.textContent = message;
    el.className = `action-result ${success ? 'success' : 'error'}`;
    clearTimeout((el as HTMLElement & { _timer?: number })._timer);
    (el as HTMLElement & { _timer?: number })._timer = window.setTimeout(
      () => {
        el!.textContent = '';
      },
      4000,
    );
    this._lastResult = el;
  }
}
