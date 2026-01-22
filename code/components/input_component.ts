export class InputComponent {
    _up: boolean = false;
    _down: boolean = false;
    _left: boolean = false;
    _right: boolean = false;
    _shoot: boolean = false;

    constructor() {
        this.reset()
    }

    public reset() {
        this._up = false;
        this._down = false;
        this._left = false;
        this._right = false;
        this._shoot = false;
    }

    public get isUp() {
        return this._up;
    }

    public get isDown() {
        return this._down;
    }

    public get isLeft() {
        return this._left;
    }

    public get isRight() {
        return this._right;
    }

    public get isShoot() {
        return this._shoot;
    }
}