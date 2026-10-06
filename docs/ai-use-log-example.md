# AI Use Log — Example Student Documentation

> **Purpose:** This file models how a student might document responsible AI use
> in the CinemaCity project. Students should maintain a similar log for their
> own AI interactions.

---

## Entry 1 — Implementing `ActAction.validate()`

**Date:** (student fills in)  
**Tool:** GitHub Copilot Chat

### Prompt used

> I have an `ActAction` class that checks whether a player can act on their
> current turn. The player needs to have a role, must not have already acted
> or rehearsed this turn, and there must be an active scene at their location.
> Write a `validate()` method that checks these conditions and returns an
> `ActionResult`.

### AI output summary

Copilot produced a `validate()` method with these checks (in order):
1. `if (!this.player.hasRole()) return { success: false, message: ... }`
2. `if (this.turnManager.hasActed || this.turnManager.hasRehearsed) ...`
3. `if (!this.location.currentScene) ...`

It also suggested adding a check for `this.player.rehearsalTokens > scene.totalShots`
to warn if rehearsal tokens exceed what's useful.

### Human critique

The three main checks were correct and matched my design. However:

- The AI hardcoded the location as a constructor parameter instead of looking
  it up from the Board, which would cause a stale-reference bug if the scene
  changes. I changed the action to look up the location from the Board in
  `validate()` and `execute()` each time they're called.
- The "excess rehearsal tokens" warning was clever but not part of the spec.
  I left it out to keep the method focused.

### Accepted suggestions

- The structure of the three checks (order and error messages) — matches
  what I planned.
- Using `||` to combine `hasActed || hasRehearsed` in one condition.

### Rejected suggestions

- Hardcoded `this.location` parameter in the constructor — replaced with
  a Board lookup.
- The `rehearsalTokens > scene.totalShots` warning — out of scope, adds
  complexity not required by the spec.

### Final changes made by the student

Kept the three checks as suggested, but changed the location lookup:
```typescript
const location = this.board.getLocation(this.player.locationId);
if (!location.currentScene) { ... }
```
instead of using `this.location` directly. This ensures the action always
sees the current state of the board.

---

## Entry 2 — Designing the Observer event system

**Date:** (student fills in)  
**Tool:** Claude (via GitHub Copilot)

### Prompt used

> I need a way for my Game class to notify the UI when state changes, without
> the domain importing the UI. I'm thinking of a simple event emitter pattern.
> What's a clean TypeScript way to implement this with type safety?

### AI output summary

The AI suggested:
1. A discriminated union for event types (using `| { type: 'X'; payload: Y }`).
2. A generic `EventEmitter<T>` class with `on(event, callback)` and `emit(event, data)`.
3. Using `Map<string, Listener[]>` for storing listeners by event name.

### Human critique

The discriminated union idea was excellent — I hadn't thought to use a union
type for the events, but it gives much better type inference than a generic
string-keyed map.

The generic `EventEmitter<T>` was over-engineered for this project. I only
need one emitter, and making it generic added complexity without benefit.

The `Map<string, Listener[]>` approach would work, but since all listeners
receive all events (and filter by type themselves), a simple `Listener[]` array
was sufficient.

### Accepted suggestions

- Discriminated union for `GameEvent` — adopted directly.
- Unsubscribe function returned by `subscribe()` — clean pattern.

### Rejected suggestions

- Generic `EventEmitter<T>` — replaced with a simpler `GameEventEmitter`
  that is specific to `GameEvent`.
- `Map<string, Listener[]>` per-event-type — replaced with a single `Listener[]`
  since listeners check the event type themselves.

### Final changes made by the student

Implemented a non-generic `GameEventEmitter` class:
```typescript
export class GameEventEmitter {
  private _listeners: Listener[] = [];
  subscribe(listener: Listener): () => void { ... }
  emit(event: GameEvent): void { ... }
}
```
This is simpler, easier to understand, and sufficient for the project's needs.

---

## Entry 3 — Writing tests for illegal move detection

**Date:** (student fills in)  
**Tool:** GitHub Copilot (inline suggestion)

### Prompt used

(Inline — typed the test description and let Copilot autocomplete)

```typescript
it('prevents moving while committed to a role', () => {
  // set up player with role, then try to move
```

### AI output summary

Copilot autocompleted:
```typescript
  const { game } = makeMinimalGame();
  game.takeRole('scene-a-lead');
  const result = game.move('locB');
  expect(result.success).toBe(false);
```

### Human critique

Close, but the `takeRole` call might fail if Alice doesn't have the right rank.
I needed to check that `makeMinimalGame` sets up the correct rank. Also, I wanted
to be explicit that the failure message contains a meaningful string.

### Accepted suggestions

- Overall structure of the test — set up, act, assert pattern.
- Using `expect(result.success).toBe(false)`.

### Rejected suggestions

- Missing rank precondition — I added `playerRank: 2` to `makeMinimalGame`.
- Missing message check — I added `expect(result.message).toContain('role')`.

### Final changes made by the student

```typescript
it('prevents moving while committed to a role', () => {
  const { game, alice } = makeMinimalGame({ playerRank: 2 });
  alice.takeRole('scene-a-lead', true);
  const scene = game.board.getLocation('locA').currentScene!;
  scene.roles[0].assign('alice');
  const result = game.move('locB');
  expect(result.success).toBe(false);
  expect(result.message).toContain('role');
});
```

---

## General Reflection

AI tools are most useful for:
- **Boilerplate structure** (test skeletons, method signatures).
- **TypeScript syntax** (discriminated unions, generics, utility types).
- **Suggesting approaches** that the student can evaluate and adapt.

AI tools are least reliable for:
- **Domain-specific correctness** — the AI doesn't know our game rules.
- **Design decisions** — it will suggest patterns without context. You must decide.
- **Integration** — suggestions often work in isolation but break when combined.

**Rule of thumb:** If you can't explain why the AI's suggestion is correct (or
why you modified it), you haven't learned enough from it yet. Pause and understand
before accepting.
