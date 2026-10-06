# CinemaCity — Student Starter Template

> **CSCI 345 — Object-Oriented Design | Student Assignment**
> See the assignment document distributed on Canvas for the full instructions.

---

## Project Overview

**CinemaCity** is a browser-playable movie studio board game for 2–4 players. Players move between studio locations, take acting roles, rehearse and act in scenes, earn credits and reputation, and upgrade their rank. Highest score wins.

This project is your hands-on practice with:
- Object-oriented design (SRP, encapsulation, responsibility assignment)
- Three design patterns: Command, Observer, and Factory
- Test-driven development with Vitest

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start the dev server
```bash
npm run dev
```
Opens at `http://localhost:5173`. The game UI loads immediately, but actions will throw `"Not implemented"` errors until you implement the domain classes.

### 3. Run tests
```bash
npm test              # single run
npm run test:watch    # watch mode — re-runs on save
```

### 4. Type-check
```bash
npm run typecheck
```

---

## Project Structure

```
src/
  data/
    locations.json        ← Board layout and off-card roles (given)
    scenecards.json       ← Scene card data (given)
  domain/
    types.ts              ← Shared type definitions (given)
    Role.ts               ← ★ YOU IMPLEMENT
    SceneCard.ts          ← ★ YOU IMPLEMENT
    SceneDeck.ts          ← ★ YOU IMPLEMENT
    Location.ts           ← ★ YOU IMPLEMENT
    Board.ts              ← ★ YOU IMPLEMENT
    Player.ts             ← ★ YOU IMPLEMENT
    TurnManager.ts        ← ★ YOU IMPLEMENT
    Game.ts               ← ★ YOU IMPLEMENT
    events/
      GameEvents.ts       ← Typed event definitions (given)
      GameEventEmitter.ts ← Observer event bus (given)
    actions/
      Action.ts           ← Command interface (given)
      MoveAction.ts       ← ★ YOU IMPLEMENT
      TakeRoleAction.ts   ← ★ YOU IMPLEMENT
      ActAction.ts        ← ★ YOU IMPLEMENT
      RehearseAction.ts   ← ★ YOU IMPLEMENT
      UpgradeAction.ts    ← ★ YOU IMPLEMENT
      EndTurnAction.ts    ← ★ YOU IMPLEMENT
    factories/
      BoardFactory.ts     ← Factory: JSON → Board (given)
      SceneDeckFactory.ts ← Factory: JSON → SceneDeck (given)
      GameFactory.ts      ← Factory: assembles full Game (given)
  tests/
    helpers.ts            ← Test helper utilities (given)
    movement.test.ts      ← ★ YOU FILL IN TEST BODIES
    roles.test.ts         ← ★ YOU FILL IN TEST BODIES
    acting.test.ts        ← ★ YOU FILL IN TEST BODIES
    scenes.test.ts        ← ★ YOU FILL IN TEST BODIES
    upgrades.test.ts      ← ★ YOU FILL IN TEST BODIES
    turns.test.ts         ← ★ YOU FILL IN TEST BODIES
    game.test.ts          ← ★ YOU FILL IN TEST BODIES
  ui/
    GameRenderer.ts       ← DOM rendering (given)
    ActionHandler.ts      ← DOM event controller (given)
  main.ts                 ← App entry point (given)
  style.css               ← All styles (given)
docs/
  ai-use-log-example.md  ← Model AI log (reference)
  ai-use-log.md          ← ★ YOUR AI USE LOG (create this)
```

---

## Implementation Order (Recommended)

Work bottom-up to minimize dependency issues:

1. **`Role`** — no dependencies on other domain classes
2. **`SceneCard`** — depends on `Role`
3. **`SceneDeck`** — depends on `SceneCard`
4. **`Location`** — depends on `Role`, `SceneCard`
5. **`Board`** — depends on `Location`
6. **`Player`** — independent of board
7. **`TurnManager`** — depends on `Player`
8. **Action classes** — depend on all of the above
9. **`Game`** — the facade, depends on everything

Write tests **before** or **alongside** implementing each class.

---

## AI Use Policy

You may use AI assistants. You **must** document each substantive AI interaction in `docs/ai-use-log.md`. See `docs/ai-use-log-example.md` for the expected format, and refer to the assignment document for the full policy.
