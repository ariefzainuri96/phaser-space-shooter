import Phaser from 'phaser';
import { delay } from './utils';
import { Player } from './objects/player';
import { ScoutEnemy } from './objects/scout_enemy';

// 1. Create a Scene Class
// Think of this like a "View" or "Activity" in mobile dev
export class GameScene extends Phaser.Scene {
    private maxEnemyFromRight = 100;
    private maxEnemyFromLeft = 100;
    private _player?: Player;

    constructor() {
        super({ key: 'GameScene' });
    }

    // A. PRELOAD: Load assets (images, audio) into memory
    preload() {}

    // B. CREATE: Initialize game objects
    create() {
        if (!this._player) {
            this._player = new Player(this);
        }

        const enemy = new ScoutEnemy(this, this.scale.width / 2, 0);

        this.physics.add.overlap(
            this._player,
            enemy,
            (playerGameObject, enemyGameObject) => {
                console.log("player collide with enemy body");
            },
        );

        this.physics.add.overlap(
            this._player.weaponComponentBulletGroup,
            enemy,
            (bulletGameObject, enemyGameObject) => {
                console.log("player bullet collide with enemy body");
            },
        )

        this.physics.add.overlap(
            this._player,
            enemy.weaponComponentBulletGroup,
            (player, enemyBullet) => {
                console.log("player collide with enemy bullet");
            },
        )
        // this.spawnNormalEnemy();
        // this.spawnEnemy(true)
        // this.spawnEnemy(false)
    }

    private async spawnNormalEnemy() {
        while (this.maxEnemyFromRight > 0) {
            new ScoutEnemy(this, this.scale.width / 2, 0);
            this.maxEnemyFromRight--;
            await delay(5000);
        }
    }

    private async spawnEnemy(fromRight: boolean) {
        while (
            fromRight ? this.maxEnemyFromRight > 0 : this.maxEnemyFromLeft > 0
        ) {
            const enemy = new ScoutEnemy(
                this,
                this.scale.width / 2 + (fromRight ? -80 : 80),
                0,
            );
            fromRight ? this.maxEnemyFromRight-- : this.maxEnemyFromLeft--;
            await delay(1000);
        }
    }

    // C. UPDATE: The game loop (runs 60 times per second)
    override update() {}
}
