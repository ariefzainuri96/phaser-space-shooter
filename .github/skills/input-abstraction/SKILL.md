# SKILL: Input Abstraction

## Pattern Name
Input Abstraction via InputComponent Base Class

## Directory
`code/components/input_component.ts`
`code/components/keyboard_input_component.ts`
`code/components/bot_scout_enemy_input_component.ts`

## Purpose
Decouple movement and weapon components from the input source. All movement/weapon
components accept an `InputComponent`, so the same code drives both the player
(keyboard) and AI-controlled enemies (bot logic).

## Class Hierarchy
```
InputComponent                   <- base: exposes isUp/isDown/isLeft/isRight/isShoot
  |- KeyboardInputComponent      <- reads Phaser CursorKeys each frame
  |- BotScoutEnemyInputComponent <- computes direction from position each frame
```

## Base Class API
```typescript
class InputComponent {
    get isUp(): boolean
    get isDown(): boolean
    get isLeft(): boolean
    get isRight(): boolean
    get isShoot(): boolean
    reset(): void   // sets all flags to false
    update(): void  // overridden by subclasses
}
```

## Usage Pattern
```typescript
// Player uses keyboard:
this.inputComponent = new KeyboardInputComponent(scene);
this.horizontalMovement = new HorizontalMovementComponent(this, this.inputComponent);

// Enemy uses AI:
this.inputComponent = new BotScoutEnemyInputComponent(this, ENEMY_MAX_X_MOVEMENT);
this.horizontalMovement = new HorizontalMovementComponent(this, this.inputComponent);
// HorizontalMovementComponent code is identical for both.
```

## Conventions
- All input consumers type their parameter as `InputComponent` (the base), never the concrete type.
- Call `inputComponent.update()` before movement components each frame.
- `KeyboardInputComponent` supports `inputLocked` to freeze player input during death or cutscenes.
- AI components set `_shoot = true` at construction for always-shooting enemies.

## Adding a New AI Input Type
1. Create `code/components/my_ai_input_component.ts` extending `InputComponent`.
2. Override `update()` to compute flags from game state.
3. Pass it to movement and weapon components exactly as `KeyboardInputComponent` is used.
