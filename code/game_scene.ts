import Phaser from 'phaser';
import { delay } from './utils';
import { Player } from './objects/player';
import { ScoutEnemy } from './objects/scout_enemy';
import { EnemySpawnerComponent } from './components/enemy_spawner_component';

// 1. Create a Scene Class
// Think of this like a "View" or "Activity" in mobile dev
export class GameScene extends Phaser.Scene {
    private maxEnemyFromRight = 100;
    private maxEnemyFromLeft = 100;
    #maxEnemy = 1000;
    #player!: Player;
    #enemyGroup!: Phaser.Physics.Arcade.Group;
    #enemyBulletGroup!: Phaser.Physics.Arcade.Group;

    constructor() {
        super({ key: 'GameScene' });
    }

    // A. PRELOAD: Load assets (images, audio) into memory
    preload() {}

    // B. CREATE: Initialize game objects
    create() {
        if (!this.#player) {
            this.#player = new Player(this);
        }

        // this.#enemyGroup = this.physics.add.group({
        //     runChildUpdate: true, // Important: This ensures enemy.update() is called automatically
        // });

        this.#enemyBulletGroup = this.physics.add.group({
            // runChildUpdate: true,
            // We don't need runChildUpdate for bullets usually, as the WeaponComponent handles it,
            // but if your bullets update themselves, set this to true.
        });

        const scoutSpawner = new EnemySpawnerComponent(
            this,
            this.#enemyBulletGroup,
            ScoutEnemy,
            {
                spawnInterval: 4000,
                spawnAt: 1000,
            },
        );

        // const enemy = new ScoutEnemy(
        //     this,
        //     this.scale.width / 2,
        //     0,
        //     this.#enemyBulletGroup,
        // );

        // this.setupCollisions();

        // this.startSpawning();

        this.physics.add.overlap(
            this.#player,
            scoutSpawner.phaserGroup,
            (playerGameObject, enemyGameObject) => {
                console.log('player collide with enemy spawner grup');

                (
                    playerGameObject as Player
                ).colliderComponent.collideWithEnemyShip();
                (
                    enemyGameObject as ScoutEnemy
                ).colliderComponent.collideWithEnemyShip();
            },
        );

        this.physics.add.overlap(
            scoutSpawner.phaserGroup,
            this.#player.weaponComponentBulletGroup,
            (enemyGameObject, bulletGameObject) => {
                console.log(
                    `player bullet collide with enemy body, instance: ${enemyGameObject}`,
                );
                (
                    enemyGameObject as ScoutEnemy
                ).colliderComponent.collideWithEnemyProjectile();

                (bulletGameObject as Phaser.Physics.Arcade.Sprite).disableBody(
                    true,
                    true,
                );
            },
        );

        this.physics.add.overlap(
            this.#player,
            this.#enemyBulletGroup,
            (player, enemyBullet) => {
                (
                    player as Player
                ).colliderComponent.collideWithEnemyProjectile();

                (enemyBullet as Phaser.Physics.Arcade.Sprite).disableBody(
                    true,
                    true,
                );
            },
        );

        this.physics.world.on(
            Phaser.Physics.Arcade.Events.WORLD_STEP,
            this.worldStep,
            this,
        );

        // this.gameObject.once(
        //     Phaser.GameObjects.Events.DESTROY,
        //     () => {
        //         this.gameObject.scene.physics.world.off(
        //             Phaser.Physics.Arcade.Events.WORLD_STEP,
        //             this.worldStep,
        //             this,
        //         );
        //     },
        //     this,
        // );
    }

    private worldStep(delta: number) {
        // Loop through the SHARED group
        this.#enemyBulletGroup.getChildren().forEach((item) => {
            const bullet = item as Phaser.Physics.Arcade.Sprite;

            if (!bullet.active) return;

            const state = bullet.state as number;

            // Logic moved from WeaponComponent
            bullet.setState(state - delta); // delta is in seconds (approx 0.016)

            if ((bullet.state as number) <= 0) {
                bullet.disableBody(true, true);
            }
        });
    }

    // C. UPDATE: The game loop (runs 60 times per second)
    override update() {}
}
