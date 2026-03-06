# SKILL: Enemy Spawner

## Pattern Name
EnemySpawnerComponent - Timed, Configurable Enemy Spawning

## Directory
`code/components/enemy_spawner_component.ts`

## Purpose
Encapsulate the logic for periodically adding enemy instances into a Phaser Group,
supporting configurable spawn intervals and initial delay. Decouples spawn timing
from `GameScene`.

## API
```typescript
new EnemySpawnerComponent(
    scene: Phaser.Scene,
    enemyBulletGroup: Phaser.Physics.Arcade.Group,  // shared bullet pool
    enemyClass: typeof ScoutEnemy,                  // constructor reference
    spawnConfig: {
        spawnInterval: number,  // ms between spawns
        spawnAt: number,        // ms until first spawn
    }
);

spawner.phaserGroup  // Phaser.Group - use for collision registration
```

## How It Works
1. Creates a Phaser Group with `classType = enemyClass` and `runChildUpdate: true`.
2. Listens to `Phaser.Scenes.Events.UPDATE` to decrement `spawnAt` by delta each frame.
3. When `spawnAt <= 0`, calls `this.group.get(x, -20)` to acquire a pooled or new enemy
   at a random X position above the viewport.
4. Resets `spawnAt = spawnInterval` after each spawn.
5. A `createCallback` fires once per new enemy to inject the shared bullet group.

## Usage in GameScene
```typescript
const scoutSpawner = new EnemySpawnerComponent(
    this,
    this.enemyBulletGroup,
    ScoutEnemy,
    { spawnInterval: 4000, spawnAt: 1000 },
);

this.physics.add.overlap(this.player, scoutSpawner.phaserGroup, callback);
this.physics.add.overlap(scoutSpawner.phaserGroup, this.player.weaponComponentBulletGroup, callback);
```

## Conventions
- `runChildUpdate: true` means each active enemy update() is called automatically.
- The `createCallback` is the correct place to inject dependencies (bullet groups)
  into enemies; it fires once per object creation, not on every pool reuse.
- Enemies obtained via `group.get()` are re-used, not re-constructed. Implement a
  `spawn(x, y)` method on the enemy to reset health and flags on reuse.
- Clean up all listeners in the scene DESTROY event to prevent leaks on scene restart.
