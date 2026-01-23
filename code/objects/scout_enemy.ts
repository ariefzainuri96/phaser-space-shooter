import { BotScoutEnemyInputComponent } from "../components/bot_scout_enemy_input_component";
import { HorizontalMovementComponent } from "../components/horizontal_movement_component";
import { VerticalMovementComponent } from "../components/vertical_movement_component copy";
import { DEFAULT_ENEMY_SPEED, ENEMY_MAX_X_MOVEMENT } from "../constants/number_constant";

export class ScoutEnemy extends Phaser.GameObjects.Container {
    private enemySprite: Phaser.GameObjects.Sprite;
    private engineSprite: Phaser.GameObjects.Sprite;
    private inputComponent: BotScoutEnemyInputComponent;
    private verticalMovementComponent: VerticalMovementComponent;
    private horizontalMovementComponent: HorizontalMovementComponent;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, [])

        scene.add.existing(this)
        scene.physics.add.existing(this)

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setSize(24, 24)
        body.setOffset(-12, -12)

        this.enemySprite = scene.add.sprite(0, 0, 'scout', 0)
        this.engineSprite = scene.add.sprite(0, 0, 'scout_engine').setFlipY(true)
        this.engineSprite.play('scout_engine')
        this.add([this.engineSprite, this.enemySprite])

        this.inputComponent = new BotScoutEnemyInputComponent(this, ENEMY_MAX_X_MOVEMENT);
        this.verticalMovementComponent = new VerticalMovementComponent(this, this.inputComponent, DEFAULT_ENEMY_SPEED, true);
        this.horizontalMovementComponent = new HorizontalMovementComponent(this, this.inputComponent, DEFAULT_ENEMY_SPEED);

        scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this)
        })
    }

    public override update(ts: number, dt: number) {
        this.inputComponent.update()
        this.verticalMovementComponent.update()
        this.horizontalMovementComponent.update()
    }
}