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
            // We don't need runChildUpdate for bullets usually, as the WeaponComponent handles it,
            // but if your bullets update themselves, set this to true.
        });

        const scoutSpawner = new EnemySpawnerComponent(this, this.#enemyBulletGroup, ScoutEnemy, {
            spawnInterval: 5000,
            spawnAt: 1000,
        });

        // const enemy = new ScoutEnemy(
        //     this,
        //     this.scale.width / 2,
        //     0,
        //     this.#enemyBulletGroup,
        // );

        // this.setupCollisions();

        // this.startSpawning();

        // this.physics.add.overlap(
        //     this.#player,
        //     enemy,
        //     (playerGameObject, enemyGameObject) => {
        //         (
        //             playerGameObject as Player
        //         ).colliderComponent.collideWithEnemyShip();
        //         (
        //             enemyGameObject as ScoutEnemy
        //         ).colliderComponent.collideWithEnemyShip();
        //     },
        // );

        // this.physics.add.overlap(
        //     enemy,
        //     this.#player.weaponComponentBulletGroup,
        //     (enemyGameObject, bulletGameObject) => {
        //         console.log(
        //             `player bullet collide with enemy body, instance: ${enemyGameObject}`,
        //         );
        //         (
        //             enemyGameObject as ScoutEnemy
        //         ).colliderComponent.collideWithEnemyProjectile();

        //         (bulletGameObject as Phaser.Physics.Arcade.Sprite).disableBody(
        //             true,
        //             true,
        //         );
        //     },
        // );

        // this.physics.add.overlap(
        //     this.#player,
        //     this.#enemyBulletGroup,
        //     (player, enemyBullet) => {
        //         (
        //             player as Player
        //         ).colliderComponent.collideWithEnemyProjectile();

        //         (enemyBullet as Phaser.Physics.Arcade.Sprite).disableBody(
        //             true,
        //             true,
        //         );
        //     },
        // );
        // this.spawnNormalEnemy();
        // this.spawnEnemy(true)
        // this.spawnEnemy(false)
    }

    private setupCollisions() {
        // A. Player vs. Any Enemy in the group
        this.physics.add.overlap(
            this.#player,
            this.#enemyGroup, // <--- We check the whole group
            (playerGO, enemyGO) => {
                // Phaser passes the SPECIFIC enemy that was hit as the second argument
                const enemy = enemyGO as ScoutEnemy;
                const player = playerGO as Player;

                player.colliderComponent.collideWithEnemyShip();
                enemy.colliderComponent.collideWithEnemyShip();
            },
        );

        // B. Player vs. Global Enemy Bullet Group
        this.physics.add.overlap(
            this.#player,
            this.#enemyBulletGroup,
            (playerGO, bulletGO) => {
                const player = playerGO as Player;
                // You might need to cast bulletGO to your bullet type if you have one
                player.colliderComponent.collideWithEnemyProjectile();

                // Destroy/Disable bullet
                (bulletGO as Phaser.Physics.Arcade.Sprite).disableBody(
                    true,
                    true,
                );
            },
        );

        // C. Player Bullets vs. Enemy Group
        this.physics.add.overlap(
            this.#enemyGroup,
            this.#player.weaponComponentBulletGroup,
            (enemyGO, bulletGO) => {
                const enemy = enemyGO as ScoutEnemy;
                enemy.colliderComponent.collideWithEnemyProjectile();

                // Destroy/Disable player bullet
                (bulletGO as Phaser.Physics.Arcade.Sprite).disableBody(
                    true,
                    true,
                );
            },
        );
    }

    // private async startSpawning() {
    //     // Example: Create 5 enemies
    //     for (let i = 0; i < this.#maxEnemy; i++) {
    //         // Random X position
    //         // const x = Phaser.Math.Between(50, this.scale.width - 50);
    //         // const y = Phaser.Math.Between(-100, -300); // Start above screen

    //         this.spawnEnemy(this.scale.width / 2, 0);

    //         await delay(1000);
    //     }
    // }

    // private spawnEnemy(x: number, y: number) {
    //     // PASS THE SHARED BULLET GROUP TO THE ENEMY
    //     const enemy = new ScoutEnemy(this, x, y, this.#enemyBulletGroup);

    //     // Add the new enemy to the physics group
    //     this.#enemyGroup.add(enemy);
    // }

    // private async spawnNormalEnemy() {
    //     while (this.maxEnemyFromRight > 0) {
    //         new ScoutEnemy(this, this.scale.width / 2, 0);
    //         this.maxEnemyFromRight--;
    //         await delay(5000);
    //     }
    // }

    // private async spawnEnemy(fromRight: boolean) {
    //     while (
    //         fromRight ? this.maxEnemyFromRight > 0 : this.maxEnemyFromLeft > 0
    //     ) {
    //         const enemy = new ScoutEnemy(
    //             this,
    //             this.scale.width / 2 + (fromRight ? -80 : 80),
    //             0,
    //         );
    //         fromRight ? this.maxEnemyFromRight-- : this.maxEnemyFromLeft--;
    //         await delay(1000);
    //     }
    // }

    // C. UPDATE: The game loop (runs 60 times per second)
    override update() {}
}
