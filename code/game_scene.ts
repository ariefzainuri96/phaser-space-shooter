import Phaser from 'phaser';
import { delay } from './utils';
import { Player } from './objects/player';

// 1. Create a Scene Class
// Think of this like a "View" or "Activity" in mobile dev
export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    // A. PRELOAD: Load assets (images, audio) into memory
    preload() {

    }

    // B. CREATE: Initialize game objects
    create() {
        const player = new Player(this)
    }

    // C. UPDATE: The game loop (runs 60 times per second)
    override update() {

    }
}