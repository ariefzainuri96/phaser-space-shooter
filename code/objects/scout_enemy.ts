import {
    WeaponComponent,
    type BulletConfig,
} from './../components/weapon_component';
import { BotScoutEnemyInputComponent } from '../components/bot_scout_enemy_input_component';
import { HorizontalMovementComponent } from '../components/horizontal_movement_component';
import { VerticalMovementComponent } from '../components/vertical_movement_component copy';
import {
    DEFAULT_ENEMY_SPEED,
    ENEMY_HEALTH,
    ENEMY_MAX_X_MOVEMENT,
} from '../constants/number_constant';
import { ColliderComponent } from '../components/collider-component';
import { LifeComponent } from '../components/life_component';

export class ScoutEnemy extends Phaser.GameObjects.Container {
    private enemySprite: Phaser.GameObjects.Sprite;
    private engineSprite: Phaser.GameObjects.Sprite;
    private inputComponent: BotScoutEnemyInputComponent;
    private verticalMovementComponent: VerticalMovementComponent;
    private horizontalMovementComponent: HorizontalMovementComponent;
    #weaponComponent?: WeaponComponent;
    #colliderComponent: ColliderComponent;
    #lifeComponent: LifeComponent;

    #bulletConfig: BulletConfig = {
        maxBulletCount: 5,
        yOffset: 10,
        shootInterval: 500,
        bulletSpeed: 300,
        lifespan: 3,
        isFlipY: true,
    };

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, []);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setSize(24, 24);
        body.setOffset(-12, -12);

        this.enemySprite = scene.add.sprite(0, 0, 'scout', 0);
        this.engineSprite = scene.add
            .sprite(0, 0, 'scout_engine')
            .setFlipY(true);
        this.engineSprite.play('scout_engine');
        this.add([this.engineSprite, this.enemySprite]);

        this.#lifeComponent = new LifeComponent(ENEMY_HEALTH);
        this.#colliderComponent = new ColliderComponent(this.#lifeComponent);
        this.inputComponent = new BotScoutEnemyInputComponent(
            this,
            ENEMY_MAX_X_MOVEMENT,
        );
        this.verticalMovementComponent = new VerticalMovementComponent(
            this,
            this.inputComponent,
            DEFAULT_ENEMY_SPEED,
            true,
        );
        this.horizontalMovementComponent = new HorizontalMovementComponent(
            this,
            this.inputComponent,
            DEFAULT_ENEMY_SPEED,
        );

        // this.#weaponComponent = new WeaponComponent(
        //     this,
        //     this.inputComponent,
        //     this.#bulletConfig,
        // );

        scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
        });
    }

    get weaponComponent() {
        return this.#weaponComponent;
    }

    get lifeComponent() {
        return this.#lifeComponent;
    }

    get colliderComponent() {
        return this.#colliderComponent;
    }

    public override update(ts: number, dt: number) {
        if (!this.active) {
            return;
        }

        if (this.#lifeComponent.isDead) {
            // Disable logic loop
            this.setActive(false);

            // Disable Collision (So player flies through)
            const body = this.body as Phaser.Physics.Arcade.Body;
            body.setEnable(false);

            // Hide the ship parts
            this.engineSprite.setVisible(false);

            // Play Explosion
            this.enemySprite.play('explosion');

            // Destroy object after animation finishes to free memory
            this.enemySprite.once(
                Phaser.Animations.Events.ANIMATION_COMPLETE,
                () => {
                    this.destroy();
                },
            );

            return;
        }

        this.inputComponent.update();
        this.verticalMovementComponent.update();
        this.horizontalMovementComponent.update();
        if (this.#weaponComponent) {
            this.#weaponComponent.update(dt);
        }
    }

    // 2. New Method: Receive the dependency
    public setBulletGroup(group: Phaser.Physics.Arcade.Group) {
        // Initialize weapon component here, now that we have the group
        this.#weaponComponent = new WeaponComponent(
            this,
            this.inputComponent,
            this.#bulletConfig, // You need to store config as a property
            group,
        );
    }

    // // 3. New Method: Reset state for pooling
    // public spawn(x: number, y: number) {
    //     console.log('enemy spawned');
    //     this.setActive(true);
    //     this.setVisible(true);
    //     this.setPosition(x, y);

    //     // Reset Physics
    //     const body = this.body as Phaser.Physics.Arcade.Body;
    //     body.setEnable(true);
    //     body.setVelocity(0, 0);

    //     // Reset Logic
    //     this.#lifeComponent.reset(); // Reset HP to full
    //     this.engineSprite.setVisible(true); // Show engine again
    //     this.enemySprite.setTexture('scout'); // Reset texture from 'explosion' to 'ship'

    //     // Reset Inputs/Movement
    //     this.inputComponent.reset(); // If you have state there
    // }
}
