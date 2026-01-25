import type { InputComponent } from './input_component';

export type BulletConfig = {
    maxBulletCount: number;
    yOffset: number;
    shootInterval: number;
    bulletSpeed: number;
    lifespan: number;
    isFlipY: boolean;
};

export class WeaponComponent {
    private gameObject: Phaser.GameObjects.Container;
    private inputComponent: InputComponent;
    private bulletConfig: BulletConfig;
    #bulletGroup: Phaser.Physics.Arcade.Group;
    private enableShootTimer: number;

    constructor(
        gameObject: Phaser.GameObjects.Container,
        inputComponent: InputComponent,
        bulletConfig: BulletConfig,
        existingGroup?: Phaser.Physics.Arcade.Group,
    ) {
        this.gameObject = gameObject;
        this.inputComponent = inputComponent;
        this.bulletConfig = bulletConfig;

        this.enableShootTimer = 0;

        // If an existing group is passed (Shared Pool), use it.
        // Otherwise, create a new one (Fallback).
        if (existingGroup) {
            this.#bulletGroup = existingGroup;
        } else {
            this.#bulletGroup = this.gameObject.scene.physics.add.group({
                name: `bullets_${Phaser.Math.RND.uuid()}`,
                enable: false,
            });

            this.gameObject.scene.physics.world.on(
                Phaser.Physics.Arcade.Events.WORLD_STEP,
                this.worldStep,
                this,
            );
            
            this.gameObject.once(
                Phaser.GameObjects.Events.DESTROY,
                () => {
                    this.gameObject.scene.physics.world.off(
                        Phaser.Physics.Arcade.Events.WORLD_STEP,
                        this.worldStep,
                        this,
                    );
                },
                this,
            );
        }

        this.#bulletGroup.createMultiple({
            key: 'bullet',
            frameQuantity: this.bulletConfig.maxBulletCount,
            active: false,
            visible: false,
        });
    }

    get bulletGroup() {
        return this.#bulletGroup;
    }

    public update(deltaTime: number) {
        this.enableShootTimer -= deltaTime;

        if (this.enableShootTimer > 0) {
            return;
        }

        if (this.inputComponent.isShoot) {
            const bullet =
                this.#bulletGroup.getFirstDead() as Phaser.Physics.Arcade.Sprite;

            if (bullet == undefined || bullet == null) {
                return;
            }

            const x = this.gameObject.x;
            const y = this.gameObject.y + this.bulletConfig.yOffset;

            bullet.enableBody(true, x, y, true, true);
            if (bullet.body != null) {
                bullet.body.velocity.y = this.bulletConfig.bulletSpeed;
            }
            bullet.setState(this.bulletConfig.lifespan);
            bullet.play('bullet');
            bullet.setScale(0.8);
            bullet.setSize(14, 18);
            bullet.setFlipY(this.bulletConfig.isFlipY);

            this.enableShootTimer = this.bulletConfig.shootInterval;
        }
    }

    private worldStep(delta: number) {
        this.#bulletGroup.getChildren().forEach((bullet: any) => {
            if (!bullet.active) {
                return;
            }

            bullet.state -= delta;
            if (bullet.state <= 0) {
                bullet.disableBody(true, true);
            }
        });
    }

    // public destroyBullet(bullet: any) {
    //     bullet.setState(0);
    // }
}
