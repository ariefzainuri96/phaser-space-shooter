import { InputComponent } from "./input_component";
import Phaser from "phaser";

export class KeyboardInputComponent extends InputComponent {
    private cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;
    private inputLocked: boolean = false;

    constructor(scene: Phaser.Scene) {
        super();
        this.cursorKeys = scene.input.keyboard?.createCursorKeys();
    }

    public set setInputLocked(v: boolean) {
        this.inputLocked = v;
    }

    public update() {
        if (this.inputLocked) {
            this.reset()
            return
        }

        this._left = this.cursorKeys?.left.isDown ?? false;
        this._right = this.cursorKeys?.right.isDown ?? false;
        this._up = this.cursorKeys?.up.isDown ?? false;
        this._down = this.cursorKeys?.down.isDown ?? false;
        this._shoot = this.cursorKeys?.space.isDown ?? false;
    }
}