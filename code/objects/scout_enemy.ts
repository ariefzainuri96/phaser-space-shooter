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
    private _weaponComponent: WeaponComponent;
    #colliderComponent: ColliderComponent;
    #lifeComponent: LifeComponent;

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
        const bulletConfig: BulletConfig = {
            maxBulletCount: 5,
            yOffset: 10,
            shootInterval: 500,
            bulletSpeed: 300,
            lifespan: 3,
            isFlipY: true,
        };
        this._weaponComponent = new WeaponComponent(
            this,
            this.inputComponent,
            bulletConfig,
        );

        scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
        });
    }

    get weaponComponentBulletGroup() {
        return this._weaponComponent.bulletGroup;
    }

    get weaponComponent() {
        return this._weaponComponent;
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
            this.#hide();
            this.setVisible(true);
            this.enemySprite.play({
                key: 'explosion',
            });
            return;
        }

        this.inputComponent.update();
        this.verticalMovementComponent.update();
        this.horizontalMovementComponent.update();
        this._weaponComponent.update(dt);
    }

    #hide() {
        this.setActive(false);
        this.setVisible(false);
        this.engineSprite.setVisible(false);
    }
}
