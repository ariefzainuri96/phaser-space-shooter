import { ColliderComponent } from './../components/collider-component';
import { HorizontalMovementComponent } from '../components/horizontal_movement_component';
import { KeyboardInputComponent } from '../components/keyboard_input_component';
import { VerticalMovementComponent } from '../components/vertical_movement_component copy';
import { WeaponComponent } from '../components/weapon_component';
import { LifeComponent } from '../components/life_component';
import { PLAYER_HEALTH } from '../constants/number_constant';

export class Player extends Phaser.GameObjects.Container {
    private playerSprite;
    private engineSprite;
    private engineThrusterSprite;
    private keyboardInputComponent;
    private horizontalMovementComponent;
    private verticalMovementComponent;
    #colliderComponent: ColliderComponent;
    #lifeComponent: LifeComponent;
    private _weaponComponent: WeaponComponent;

    #isDestroyed = false;

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

        this.#lifeComponent = new LifeComponent(PLAYER_HEALTH);
        this.#colliderComponent = new ColliderComponent(this.lifeComponent);
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

    get lifeComponent() {
        return this.#lifeComponent;
    }

    get colliderComponent() {
        return this.#colliderComponent;
    }

    get weaponComponentBulletGroup() {
        return this._weaponComponent.bulletGroup;
    }

    get weaponComponent() {
        return this._weaponComponent;
    }

    public override update(ts: number, dt: number) {
        if (!this.active) {
            return;
        }

        // 2. Modified Death Logic
        if (this.#lifeComponent.isDead) {
            // Only trigger the death sequence ONCE
            if (!this.#isDestroyed) {
                this.handleDeathSequence();
            }
            // Stop here. Do not update movement or input while dead.
            return; 
        }

        // Normal game loop
        this.keyboardInputComponent.update();
        this.horizontalMovementComponent.update();
        this.verticalMovementComponent.update();
        this._weaponComponent.update(dt);
    }

    private handleDeathSequence() {
        this.#isDestroyed = true;
        
        // Stop the ship's movement immediately 
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0, 0);
        body.setEnable(false);

        // Lock Input
        this.keyboardInputComponent.inputLocked = true;

        // Hide engine parts (we only want to see the explosion)
        this.engineSprite.setVisible(false);
        this.engineThrusterSprite.setVisible(false);

        // Play Explosion on the main sprite
        this.playerSprite.play('explosion');

        // 4. THE KEY FIX: Wait for animation to finish BEFORE resetting
        this.playerSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            // Optional: Add a small delay (e.g., 1 second) before respawning
            this.scene.time.delayedCall(100, () => {
                this.#reset();
            });
        });
    }

    #reset() {
        // Restore Logic
        this.lifeComponent.reset();        
        this.#isDestroyed = false;

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setEnable(true);

        // Restore Visuals
        this.setVisible(true);
        this.playerSprite.setTexture('ship'); // CRITICAL: Switch texture back from explosion to ship
        
        this.engineSprite.setVisible(true);
        this.engineThrusterSprite.setVisible(true);
        this.engineThrusterSprite.play('ship_engine_thruster'); // Restart engine anim

        // Unlock Input
        this.keyboardInputComponent.inputLocked = false;
                
        // Optional: Reset Position to spawn point?
        // this.setPosition(this.scene.scale.width / 2, this.scene.scale.height - 100);
    }
}
