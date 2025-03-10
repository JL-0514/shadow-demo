class LightSource {
    /**
     * 
     * @param {GameEngine} game The game engine.
     * @param {number} x The x-coordinate of the light source.
     * @param {number} y The y-coordinate of the light source.
     * @param {number} height The distance from the ground.
     */
    constructor(game, x, y, height) {
        Object.assign(this, { game, x, y, height });
        this.blocks = [];
        this.cast = [];
    }

    addBlock(p1, p2) {
        this.blocks.push(new Line([p1, p2]));
    }

    addCast(p1, p2) {
        this.cast.push(new Line([p1, p2]));
    }
}
