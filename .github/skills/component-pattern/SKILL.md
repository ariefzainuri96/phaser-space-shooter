# SKILL: Component-Based Architecture

## Pattern Name
Component-Based Game Object Architecture

## Directory
`code/components/`, `code/objects/`

## Purpose
Avoid deep inheritance hierarchies for game objects. Each `Phaser.GameObjects.Container`
subclass (Player, ScoutEnemy) owns a set of single-responsibility component instances
and delegates behaviour to them.

## Component Tree
```
GameObject (Container)
  |- LifeComponent          - health tracking and death state
  |- ColliderComponent      - collision response (delegates to LifeComponent)
  |- InputComponent         - abstracted directional + shoot intent
  |- HorizontalMovementComponent - applies horizontal physics velocity
  |- VerticalMovementComponent   - applies vertical physics velocity
  |- WeaponComponent        - bullet pool management and firing logic
```

## Component Lifecycle
Components are instantiated inside the game object constructor.
They expose an `update()` method called every frame via the Phaser UPDATE event:

```typescript
scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
this.once(Phaser.GameObjects.Events.DESTROY, () => {
    scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
});
```

Each component update is called from the parent:
```typescript
update(_ts: number, dt: number) {
    this.inputComponent.update();
    this.horizontalMovementComponent.update();
    this.verticalMovementComponent.update();
    this.weaponComponent?.update(dt);
}
```

## Conventions
- Components are plain TypeScript classes, not Phaser objects.
- Components receive the parent Container and dependencies via constructor injection.
- Components do NOT hold a scene reference - receive what they need at construction time.
- Use TypeScript private fields (`#field`) for components that must not be exposed.
- Expose only what GameScene needs via `get` accessors (e.g. `get weaponComponentBulletGroup()`).

## Adding a New Component
1. Create `code/components/my_component.ts` as a plain TypeScript class.
2. Expose an `update(dt?: number)` method if it needs per-frame logic.
3. Instantiate it in the relevant game object constructor.
4. Call its `update()` from the object update method.
