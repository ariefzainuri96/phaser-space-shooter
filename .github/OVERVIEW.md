# Project Overview: Phaser Space Shooter

## Summary
A top-down space shooter built with Phaser 3 and TypeScript 5, bundled by Bun.
The player fights waves of enemy scouts using arcade physics, sprite animations, and a component-based object system.

## Tech Stack
| Concern | Tool |
|---|---|
| Framework | Phaser 3 (^3.90.0) |
| Language | TypeScript 5 (strict mode) |
| Bundler | Bun (bun build --watch) |
| Physics | Arcade Physics (zero gravity) |
| Renderer | Phaser.CANVAS |

## Build and Run
Watch mode (rebundles on every save):

    bun run game:watch

Open in browser (no dev server needed):

    open index.html

## Folder Structure

    code/
      game.ts            Entry point - Phaser.Game config + scene registration
      boot_scene.ts      Scene 1 - loads JSON metadata, starts PreloadScene
      preload_scene.ts   Scene 2 - loads assets via pack(), registers animations
      game_scene.ts      Scene 3 - main gameplay, player, enemies, collisions
      utils.ts           Shared helpers (delay)
      constants/
        number_constant.ts   Centralised numeric tuning values
      components/        Reusable behaviour components
      objects/
        player.ts        Player - Container + assembled components
        scout_enemy.ts   Scout enemy - Container + assembled components
    assets/
      data/
        assets.json      Asset manifest consumed by Phaser.Loader.pack()
        animations.json  Animation definitions consumed by PreloadScene
      images/            Spritesheets and static images
      audio/             BGM / SFX

## Architecture Patterns
All major patterns are documented in .github/skills/.
Each skill directory contains a SKILL.md with rationale, structure, and implementation guidelines.

---

## Skills Map
| Pattern | Skill | Description |
|---|---|---|
| Scene Management | [scene-management](skills/scene-management/SKILL.md) | 3-scene boot to preload to game lifecycle |
| Component-Based Architecture | [component-pattern](skills/component-pattern/SKILL.md) | Composition over inheritance for game objects |
| Input Abstraction | [input-abstraction](skills/input-abstraction/SKILL.md) | InputComponent base enabling player and AI to share movement and weapon logic |
| Object Pooling | [object-pooling](skills/object-pooling/SKILL.md) | Phaser group-based bullet and enemy object reuse |
| Enemy Spawner | [enemy-spawner](skills/enemy-spawner/SKILL.md) | Timed, configurable enemy spawning via EnemySpawnerComponent |
