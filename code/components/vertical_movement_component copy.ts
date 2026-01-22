import { DEFAULT_SPEED, MAX_SPEED } from "../constants/number_constant";
import type { InputComponent } from "./input_component";

export class VerticalMovementComponent {
    private gameObject: Phaser.GameObjects.Container;
    private inputComponent: InputComponent;
    private speed: number;
    private body: Phaser.Physics.Arcade.Body;

    constructor(gameObject: Phaser.GameObjects.Container, inputComponent: InputComponent, speed: number = DEFAULT_SPEED,) {
        this.gameObject = gameObject;
        this.inputComponent = inputComponent;
        this.speed = speed;

        this.body = gameObject.body as Phaser.Physics.Arcade.Body;
        this.body.setDamping(true);
        this.body.setDrag(0.01);
        this.body.setMaxVelocityY(MAX_SPEED);
    }

    public update() {
        if (this.body != null) {
            if (this.inputComponent.isUp) {
                this.body.velocity.y -= this.speed;
            } else if (this.inputComponent.isDown) {
                this.body.velocity.y += this.speed;
            } else {
                this.body.setAngularAcceleration(0);
            }
        }
    }
}