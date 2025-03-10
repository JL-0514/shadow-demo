class Skeleton {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/skeleton.png");

        this.scale = 70 / 24;
        this.width = 24 * this.scale;
        this.height = 32 * this.scale;
        this.updateBB();

        this.speed = 6;

        this.state = 0;         // 0=still, 1=moving
        this.direction = 0;     // 0=left, 1=right, 2=up, 3=down
        this.animation = [];
        this.loadAnimation();

        this.shadow = new Shadow(game, this, 25);
    }

    updateBB() {
        this.BB = new RectangularBB(this.x, this.y, this.width, this.height);
    }

    loadAnimation() {
        this.animation.push(new Animator(this.spritesheet, 0, 32, 24, 32, 3, 0.2, 0, false, true));
        this.animation.push(new Animator(this.spritesheet, 0, 64, 24, 32, 3, 0.2, 0, false, true));
        this.animation.push(new Animator(this.spritesheet, 0, 96, 24, 32, 3, 0.2, 0, false, true));
        this.animation.push(new Animator(this.spritesheet, 0, 0, 24, 32, 3, 0.2, 0, false, true));
    }

    update() {
        if (this.game.keyA || this.game.keyD || this.game.keyS || this.game.keyW) {
            if (this.game.keyA) {
                this.x -= this.speed;
                this.direction = 0;
            }
            if (this.game.keyD) {
                this.x += this.speed;
                this.direction = 1;
            }
            if (this.game.keyS) {
                this.y += this.speed;
                this.direction = 3;
            }
            if (this.game.keyW) {
                this.y -= this.speed;
                this.direction = 2;
            }
            this.state = 1;
        } else {
            this.state = 0;
        }
        this.updateBB();
        this.handleCollision();
        this.shadow.update();
    }

    handleCollision() {
        this.game.entities.forEach(e => {
            if (e instanceof Wall && this.BB.collide(e.BB)) {
                let o = this.BB.overlap(e.BB);
                if (o.x <= o.y) {    // Overlap from left or right
                    if (this.BB.left > e.BB.left && this.BB.left < e.BB.right) this.x += o.x;
                    else if (this.BB.right > e.BB.left && this.BB.right < e.BB.right) this.x -= o.x;
                } else if (o.x >= o.y) {    // Overlap from top or bottom
                    if (this.BB.top > e.BB.top && this.BB.top < e.BB.bottom) this.y += o.y;
                    else this.y -= o.y;
                }
            }
        });
    }

    draw(ctx) {
        if (this.state == 1) 
            this.animation[this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale, this.shadow);
        else 
            this.animation[this.direction].drawFrame(0, ctx, this.x, this.y, this.scale, this.shadow);
    }
}

class Lamp {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/lamp.png");

        this.scale = 2.5;
        this.width = 32 * this.scale;
        this.height = 96 * this.scale;

        this.light = new LightSource(game, x + 16 * this.scale, y + 14 * this.scale, this.height - 24 * this.scale);
    }

    update() {

    }

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.x, this.y, this.width, this.height);
    }
}