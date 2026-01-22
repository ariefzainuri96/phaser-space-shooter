import Phaser from 'phaser';
import { GameScene } from './game_scene';
import { BootScene } from './boot_scene';
import { PreloadScene } from './preload_scene';

// 2. The Configuration Object
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.CANVAS, // Tries WebGL, falls back to Canvas    
    backgroundColor: '#2d2d2d',
    roundPixels: true,
    pixelArt: true,
    scale: {
        parent: 'game-container', // ID of the HTML element to inject into
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 450,
        height: 640,
    },
    physics: {
        default: 'arcade', // Arcade physics is simple and fast
        arcade: {
            gravity: { y: 0, x: 0 },
            debug: true // Shows hitboxes (turn off for production)
        }
    },
};

// 3. Initialize the Game
const game = new Phaser.Game(config);

game.scene.add('BootScene', BootScene);
game.scene.add('PreloadScene', PreloadScene);
game.scene.add('MainScene', GameScene);
game.scene.start('BootScene');