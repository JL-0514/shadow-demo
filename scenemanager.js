class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.skeleton = new Skeleton(this.game, 100, 100);
        this.game.lamp = new Lamp(this.game, 200, 300);
        this.game.skeleton.shadow.lightSources.push(this.game.lamp.light);
        this.loadScene();
    }

    loadScene() {
        // Fill ground
        this.game.addEntity(new Floor(this.game, 20 + PARAMS.BLOCK_SIZE, 20 + 2 * PARAMS.BLOCK_SIZE, 14, 9));
        
        let lightSrc = this.game.lamp.light;

        // Vertical walls
        this.game.addEntity(new VerticalWall(this.game, 20, 20, 11));
        lightSrc.addBlock({x: 20 + PARAMS.BLOCK_SIZE, y: 20}, 
                          {x: 20 + PARAMS.BLOCK_SIZE, y: 20 + 11 * PARAMS.BLOCK_SIZE});
        this.game.addEntity(new VerticalWall(this.game, 20 + 15 * PARAMS.BLOCK_SIZE, 20, 11));
        lightSrc.addBlock({x: 20 + 15 * PARAMS.BLOCK_SIZE, y: 20}, 
                          {x: 20 + 15 * PARAMS.BLOCK_SIZE, y: 20 + 11 * PARAMS.BLOCK_SIZE});

        // Horizontal walls
        this.game.addEntity(new HorizontalWall(this.game, 20 + PARAMS.BLOCK_SIZE, 20, 14));
        lightSrc.addBlock({x: 20 + PARAMS.BLOCK_SIZE, y: 20}, 
                          {x: 20 + 15 * PARAMS.BLOCK_SIZE, y: 20});
        lightSrc.addCast({x: 20 + PARAMS.BLOCK_SIZE, y: 20 + 2 * PARAMS.BLOCK_SIZE}, 
                         {x: 20 + 15 * PARAMS.BLOCK_SIZE, y: 20 + 2 * PARAMS.BLOCK_SIZE});
        this.game.addEntity(new HorizontalWall(this.game, 20, 20 + 11 * PARAMS.BLOCK_SIZE, 16));
        lightSrc.addBlock({x: 20, y: 20 + 11 * PARAMS.BLOCK_SIZE}, 
                          {x: 20 + 16 * PARAMS.BLOCK_SIZE, y: 20 + 11 * PARAMS.BLOCK_SIZE});
    }

    update() {

    }

    draw(ctx) {

    }
}