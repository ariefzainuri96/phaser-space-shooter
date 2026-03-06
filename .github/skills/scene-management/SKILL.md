# SKILL: Scene Management

## Pattern Name
Scene Management (Boot to Preload to Game)

## Directory
`code/boot_scene.ts`, `code/preload_scene.ts`, `code/game_scene.ts`, `code/game.ts`

## Purpose
Structure the Phaser game lifecycle into three distinct scenes so that each stage of
initialisation is isolated: metadata loading, asset loading + animation registration,
and live gameplay.

## Scene Flow
```
BootScene  ->  PreloadScene  ->  GameScene
  (JSON)     (assets + anims)   (gameplay)
```

### BootScene (`boot_scene.ts`)
- Loads only lightweight JSON files (e.g. `animations.json`) needed by PreloadScene.
- Transitions to `PreloadScene` in `create()`.

### PreloadScene (`preload_scene.ts`)
- Uses `this.load.pack("game_assets", "assets/data/assets.json")` to load all assets.
- Registers all animations by iterating the cached `animations_json` data.
- Transitions to `GameScene` in `create()` after setup is complete.

### GameScene (`game_scene.ts`)
- Extends `Phaser.Scene`. The `preload()` method is empty - no asset loading here.
- Creates game objects, wires physics overlaps/colliders, and runs the gameplay loop.

## Conventions
- Scene keys are registered in `game.ts` via `game.scene.add()` before `game.scene.start("BootScene")`.
- Scene constructors must call `super({ key: "SceneName" })`.
- Never load assets in `GameScene`; loading belongs in BootScene/PreloadScene.
- Use `this.scene.start("NextScene")` rather than `launch()` to avoid running scenes in parallel.

## Asset Manifest Pattern (`assets.json`)
```json
[
  {
    "path": "assets/images/...",
    "files": [
      { "type": "image", "key": "ship", "url": "ship.png" },
      { "type": "spritesheet", "key": "bullet", "url": "bullet.png",
        "frameConfig": { "frameWidth": 32, "frameHeight": 32 } }
    ]
  }
]
```
`Phaser.Loader.pack()` resolves each file relative to its `"path"` field.

## Adding a New Scene
1. Create `code/my_scene.ts` extending `Phaser.Scene`.
2. Register it in `game.ts`: `game.scene.add("MyScene", MyScene)`.
3. Transition to it from the previous scene: `this.scene.start("MyScene")`.
