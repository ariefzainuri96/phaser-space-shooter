import { ScoutEnemy } from '../objects/scout_enemy';

type SpawnConfig = {
    spawnInterval: number;
    spawnAt: number;
};

export class EnemySpawnerComponent {
    #scene;
    #spawnInterval;
    #spawnAt;
    #group;
    #enemyBulletGroup;

    constructor(
        scene: Phaser.Scene,
        enemyBulletGroup: Phaser.Physics.Arcade.Group,
        enemyClass: any,
        spawnConfig: SpawnConfig,
    ) {
        this.#scene = scene;
        this.#enemyBulletGroup = enemyBulletGroup;

        this.#group = this.#scene.add.group({
            name: `${enemyClass.name}_${Phaser.Math.RND.uuid()}`,
            classType: enemyClass,
            runChildUpdate: true,
            createCallback: (enemy: Phaser.GameObjects.GameObject) => {
                if (enemy instanceof ScoutEnemy) {
                    enemy.setBulletGroup(this.#enemyBulletGroup);
                }
            },
        });

        this.#spawnInterval = spawnConfig.spawnInterval;
        this.#spawnAt = spawnConfig.spawnAt;

        this.#scene.physics.world.on(
            Phaser.Physics.Arcade.Events.WORLD_STEP,
            this.worldStep,
            this,
        );
        this.#scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
        this.#scene.events.once(Phaser.Scenes.Events.DESTROY, () => {
            this.#scene.events.off(
                Phaser.Scenes.Events.UPDATE,
                this.update,
                this,
            );
            this.#scene.physics.world.off(
                Phaser.Physics.Arcade.Events.WORLD_STEP,
                this.worldStep,
                this,
            );
        });
    }

    get phaserGroup() {
        return this.#group;
    }

    private worldStep(delta: number) {}

    private update(ts: number, dt: number) {
        this.#spawnAt -= dt;
        if (this.#spawnAt > 0) {
            return;
        }

        const x = Phaser.Math.RND.between(30, this.#scene.scale.width - 30);
        const enemy = this.#group.get(x, -20);

        // if (enemy) {
        //     // We must manually call a method to reset health, flags, and position
        //     // because the constructor might NOT have run this frame.
        //     enemy.spawn(x, -20);
        // }

        this.#spawnAt = this.#spawnInterval;
    }
}
