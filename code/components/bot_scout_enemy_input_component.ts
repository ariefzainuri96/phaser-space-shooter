import { InputComponent } from "./input_component";

export class BotScoutEnemyInputComponent extends InputComponent {
    private gameObject: Phaser.GameObjects.Container;
    private startX: number;
    private maxXMovement: number;

    constructor(gameObject: Phaser.GameObjects.Container, maxXMovement: number) {
        super();

        this.gameObject = gameObject;
        this.startX = gameObject.x;
        this.maxXMovement = maxXMovement;        

        this._shoot = true;
        this._left = true;
        this._down = true;
        this._right = false;
    }

    public update() {
        if (this.gameObject.x < this.startX - this.maxXMovement) {
            this._right = true;
            this._left = false;
        } else if (this.gameObject.x > this.startX + this.maxXMovement) {
            this._right = false;
            this._left = true;
        }
    }
}