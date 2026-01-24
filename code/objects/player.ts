import { HorizontalMovementComponent } from '../components/horizontal_movement_component';
import { KeyboardInputComponent } from '../components/keyboard_input_component';
import { VerticalMovementComponent } from '../components/vertical_movement_component copy';
import { WeaponComponent } from '../components/weapon_component';

export class Player extends Phaser.GameObjects.Container {
    private playerSprite;
    private engineSprite;
    private engineThrusterSprite;
    private keyboardInputComponent;
    private horizontalMovementComponent;
    private verticalMovementComponent;
    private _weaponComponent: WeaponComponent;

    constructor(scene: Phaser.Scene) {
        super(scene, scene.scale.width / 2, scene.scale.height - 32, []);

        this.playerSprite = scene.add.sprite(0, 0, 'ship');
        this.engineSprite = scene.add.sprite(0, 0, 'ship_engine');
        this.engineThrusterSprite = scene.add.sprite(
            0,
            0,
            'ship_engine_thruster',
        );
        this.engineThrusterSprite.play('ship_engine_thruster');
        this.add([
            this.engineSprite,
            this.playerSprite,
            this.engineThrusterSprite,
        ]);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        const body = this.body as Phaser.Physics.Arcade.Body;

        body.setSize(24, 24);
        body.setOffset(-12, -12);
        body.setCollideWorldBounds(true);
        this.setDepth(2);

        this.keyboardInputComponent = new KeyboardInputComponent(scene);
        this.horizontalMovementComponent = new HorizontalMovementComponent(
            this,
            this.keyboardInputComponent,
        );
        this.verticalMovementComponent = new VerticalMovementComponent(
            this,
            this.keyboardInputComponent,
        );
        this._weaponComponent = new WeaponComponent(
            this,
            this.keyboardInputComponent,
            {
                maxBulletCount: 15,
                yOffset: -20,
                shootInterval: 200,
                bulletSpeed: -300,
                lifespan: 3,
                isFlipY: false,
            },
        );

        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            this.scene.events.off(
                Phaser.Scenes.Events.UPDATE,
                this.update,
                this,
            );
        });
    }

    get weaponComponentBulletGroup() {
        return this._weaponComponent.bulletGroup;
    }

    get weaponComponent() {
        return this._weaponComponent;
    }

    public override update(ts: number, dt: number) {
        this.keyboardInputComponent.update();
        this.horizontalMovementComponent.update();
        this.verticalMovementComponent.update();
        this._weaponComponent.update(dt);
    }
}
