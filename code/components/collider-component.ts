import type { LifeComponent } from "./life_component";

export class ColliderComponent {
    #lifeComponent: LifeComponent;
    
    constructor(lifeComponent: LifeComponent) {
        this.#lifeComponent = lifeComponent;
    }

    collideWithEnemyShip() {
        if (this.#lifeComponent.isDead) {
            return;
        }

        this.#lifeComponent.die();
    }

    collideWithEnemyProjectile() {
        if (this.#lifeComponent.isDead) {
            return;
        }

        this.#lifeComponent.hit();
    }
}