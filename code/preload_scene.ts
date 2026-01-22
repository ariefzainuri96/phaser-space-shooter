import Phaser from 'phaser';

type AnimationData = {
    key: string;
    assetKey: string;
    frames?: number[];
    frameRate: number;
    repeat: number;
}

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        this.load.pack('game_assets', '../assets/data/assets.json');
    }

    create() {
        this.createAnimation();
        this.scene.start('GameScene');
    }

    private createAnimation() {
        const data = this.cache.json.get('animations_json');

        data.forEach((element: AnimationData) => {
            const frames = element.frames ?
                this.anims.generateFrameNumbers(element.assetKey, { frames: element.frames }) :
                this.anims.generateFrameNumbers(element.assetKey);

            this.anims.create({
                key: element.key,
                frames: frames,
                frameRate: element.frameRate,
                repeat: element.repeat
            });
        });
    }
}