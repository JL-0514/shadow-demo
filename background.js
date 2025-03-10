class Wall {
    constructor(game, x, y, count) {
        if (this.constructor == Wall) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        Object.assign(this, { game, x, y, count });
    }
}

class VerticalWall extends Wall {
    constructor(game, x, y, count) {
        super(game, x, y, count);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/short-bricks.png");
        this.BB = new RectangularBB(this.x, this.y, PARAMS.BLOCK_SIZE, PARAMS.BLOCK_SIZE * count);
    }

    update() {}

    draw(ctx) {
        for (let i = 0; i < this.count; i++) {
            ctx.drawImage(this.spritesheet, 
                80, 128, 16, 16, 
                this.x, this.y + PARAMS.BLOCK_SIZE * i,
                PARAMS.BLOCK_SIZE, PARAMS.BLOCK_SIZE);
        }
    }
}

class HorizontalWall extends Wall {
    constructor(game, x, y, count) {
        super(game, x, y, count);
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/long-bricks.png");
        this.BB = new RectangularBB(this.x, this.y, PARAMS.BLOCK_SIZE * count, PARAMS.BLOCK_SIZE);
    }

    update() {}

    draw(ctx) {
        for (let i = 0; i < this.count; i++) {
            ctx.drawImage(this.spritesheet, 
                144, 32, 16, 32, 
                this.x + PARAMS.BLOCK_SIZE * i, this.y,
                PARAMS.BLOCK_SIZE, PARAMS.BLOCK_SIZE * 2);
        }
    }
}

class Floor {
    constructor(game, x, y, xCount, yCount) {
        Object.assign(this, { game, x, y, xCount, yCount });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/floors.png");
    }

    update() {}

    draw(ctx) {
        for (let i = 0; i < this.xCount; i++) {
            for (let j = 0; j < this.yCount; j++) {
                ctx.drawImage(this.spritesheet, 
                    800, 1888, 32, 32,
                    this.x + PARAMS.BLOCK_SIZE * i, this.y + PARAMS.BLOCK_SIZE * j,
                    PARAMS.BLOCK_SIZE, PARAMS.BLOCK_SIZE);
            }
        }
    }
}