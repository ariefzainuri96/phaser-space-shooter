# SKILL: Object Pooling

## Pattern Name
Phaser Group-Based Object Pooling (Bullets and Enemies)

## Directory
`code/components/weapon_component.ts`, `code/components/enemy_spawner_component.ts`

## Purpose
Avoid allocating and garbage-collecting game objects every frame. Pre-allocate a fixed
pool of objects using Phaser Group / physics.add.group(). Inactive objects sit in the
pool; when needed, the group re-activates and repositions an existing one.

## Bullet Pool (WeaponComponent)
```typescript
// Pre-allocate in constructor
this.bulletGroup = scene.physics.add.group({ name: "bullets_...", enable: false });
this.bulletGroup.createMultiple({
    key: "bullet",
    frameQuantity: bulletConfig.maxBulletCount,
    active: false,
    visible: false,
});

// Acquire from pool at fire time
const bullet = this.bulletGroup.getFirstDead(false) as Phaser.Physics.Arcade.Image;
if (!bullet) return; // pool exhausted - skip shot
bullet.setActive(true).setVisible(true).setPosition(x, y);
(bullet.body as Phaser.Physics.Arcade.Body).setVelocityY(bulletConfig.bulletSpeed);
```

### Shared vs. Private Pool
- Pass `existingGroup` to `WeaponComponent` constructor to share a pool across enemies.
- Omit it to let the component create its own private pool.

## Enemy Pool (EnemySpawnerComponent)
```typescript
this.group = scene.add.group({
    classType: EnemyClass,
    runChildUpdate: true,              // calls child update() automatically
    createCallback: (enemy) => { ... } // called once when object is first created
});

// Acquire during spawn timer
const enemy = this.group.get(x, -20); // reuses inactive object or creates new one
```

## Conventions
- Pool sizes are set via `BulletConfig.maxBulletCount` or grow lazily for enemies.
- Always verify `getFirstDead()` returns non-null before using the object.
- Return objects to the pool by calling `.setActive(false).setVisible(false)` plus
  disabling the physics body - never call `.destroy()` on pooled objects.
- Bullet lifespan is tracked via a counter in `WeaponComponent` and deactivated on expiry.

## Collision Deactivation Example
```typescript
// In GameScene overlap callback:
(bullet as Phaser.Physics.Arcade.Image).setActive(false).setVisible(false);
(bullet.body as Phaser.Physics.Arcade.Body).stop();
```

## `runChildUpdate: true`
Automatically calls `update(time, delta)` on every active child each frame.
No manual child iteration needed in the spawner or scene.
