class Animator {
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop) {
        Object.assign(this, { spritesheet, xStart, yStart, height, width, frameCount, frameDuration, framePadding, reverse, loop });

        this.elapsedTime = 0;
        this.totalTime = this.frameCount * this.frameDuration;

    };

    drawFrame(tick, ctx, x, y, scale, shadow=null) {
        this.elapsedTime += tick;

        if (this.isDone()) {
            if (this.loop) {
                this.elapsedTime -= this.totalTime;
            } else {
                return;
            }
        }

        let frame = this.currentFrame();
        if (this.reverse) frame = this.frameCount - frame - 1;

        // if (shadow) this.drawEllipseShadow(ctx, shadow);
        if (shadow) this.drawImageShadow(frame, ctx, scale, shadow);
       
        ctx.drawImage(this.spritesheet,
            this.xStart + frame * (this.width + this.framePadding), this.yStart, //source from sheet
            this.width, this.height,
            x, y,
            this.width * scale,
            this.height * scale);
    };

    drawEllipseShadow(ctx, shadow) {
        let wx = shadow.owner.x;
        let wy = shadow.owner.y;
        let ww = shadow.owner.width;
        let wh = shadow.owner.height;

        for (let i = 0; i < shadow.ellipse.length; i++) {
            let e = shadow.ellipse[i];

            ctx.save();
            ctx.filter = "blur(5px)";
            ctx.fillStyle = `rgba(0, 0, 0, 0.6)`;
            // Bound for shadow that cast on the wall
            let upperBound = 0;
            let lowerBound = shadow.lowerBound ? shadow.lowerBound : PARAMS.CANVAS_HEIGHT;
            let leftBound = shadow.leftBound ? shadow.leftBound : 0;
            let rightBound = shadow.rightBound ? shadow.rightBound : PARAMS.CANVAS_WIDTH;
            // Ellipse attributes
            let ex = wx + ww / 2 + Math.sin(e.angle) * (e.length / 2 + ww / 2);
            let ey = wy + wh - Math.cos(e.angle) * (e.length / 2 + ww / 2);
            let xr = shadow.width;
            let yr = e.length / 2 + ww;
            // Shadow on wall
            if (e.castStart) {
                ctx.save();
                ctx.beginPath();
                let l = e.castLine;
                ctx.rect(l.points[0].x, l.points[0].y - PARAMS.BLOCK_SIZE * 2, l.length(), PARAMS.BLOCK_SIZE * 2);
                ctx.clip();
                ctx.beginPath();
                let intersect = l.collideRotatedEllipse(xr, yr, ex, ey, -e.angle);
                let r = getDistance(intersect[0], intersect[1]) / 2;
                ctx.ellipse(e.castEnd.x, e.castEnd.y, r, yr, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                upperBound = e.castStart.y;
            }
            // Shadow on ground
            ctx.beginPath();
            ctx.rect(leftBound, upperBound, rightBound - leftBound, lowerBound - upperBound);
            ctx.clip();
            ctx.beginPath();
            ctx.ellipse(ex, ey, xr, yr, e.angle, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    drawImageShadow(frame, ctx, scale, shadow) {
        let wx = shadow.owner.x;
        let wy = shadow.owner.y;
        let ww = shadow.owner.width;
        let wh = shadow.owner.height;
        for (let i = 0; i < shadow.ellipse.length; i++) {
            let e = shadow.ellipse[i];

            // Create canvas
            let shadowCanvas = document.createElement("canvas");
            let shadowCtx = shadowCanvas.getContext("2d");
            shadowCanvas.width = e.length * 2 + ww * 4;
            shadowCanvas.height = shadowCanvas.width;

            // Rotate canvas
            shadowCtx.save();
            shadowCtx.globalAlpha = 0.7;
            shadowCtx.filter = "blur(5px)";
            shadowCtx.translate(shadowCanvas.width / 2, shadowCanvas.height / 2);
            shadowCtx.rotate(e.angle);
            shadowCtx.translate(-shadowCanvas.width / 2, -shadowCanvas.height / 2);

            // Draw image
            shadowCtx.drawImage(this.spritesheet,
                this.xStart + frame * (this.width + this.framePadding), this.yStart,
                this.width, this.height,
                shadowCanvas.width / 2 - ww / 2, 
                shadowCanvas.height / 2 - e.length - ww * 2,
                this.width * scale, e.length + ww * 2);
            shadowCtx.restore();

            // Fill shadow
            shadowCtx.globalCompositeOperation='source-atop';
            shadowCtx.fillStyle="rgb(20, 20, 20)";
            shadowCtx.fillRect(0, 0, shadowCanvas.width, shadowCanvas.height);

            // Bound for shadow that cast on the wall
            let upperBound = 0;
            let lowerBound = shadow.lowerBound ? shadow.lowerBound : PARAMS.CANVAS_HEIGHT;
            let leftBound = shadow.leftBound ? shadow.leftBound : 0;
            let rightBound = shadow.rightBound ? shadow.rightBound : PARAMS.CANVAS_WIDTH;

            // Shadow on wall
            if (e.castStart) {
                // Create canvas
                let wallCanvas = document.createElement("canvas");
                let wallCtx = wallCanvas.getContext("2d");
                wallCanvas.width = PARAMS.CANVAS_WIDTH;
                wallCanvas.height = PARAMS.CANVAS_HEIGHT;
                // Draw image
                wallCtx.save();
                wallCtx.globalAlpha = 0.7;
                wallCtx.filter = "blur(5px)";
                let dh = Math.sin(e.angle) * this.width * scale;
                let r = Math.sqrt(this.width * scale * this.width * scale + dh * dh);
                wallCtx.drawImage(this.spritesheet,
                    this.xStart + frame * (this.width + this.framePadding), this.yStart, //source from sheet
                    this.width, this.height,
                    e.castEnd.x - r / 2, e.castEnd.y - e.length,
                    r, e.length + ww);
                wallCtx.restore();
                // Fill the shadow
                wallCtx.globalCompositeOperation='source-atop';
                wallCtx.fillStyle="rgb(20, 20, 20)";
                wallCtx.fillRect(0, 0, wallCanvas.width, wallCanvas.height);
                // Clip
                ctx.save();
                ctx.beginPath();
                let l = e.castLine;
                ctx.rect(l.points[0].x, l.points[0].y - PARAMS.BLOCK_SIZE * 2, l.length(), PARAMS.BLOCK_SIZE * 2);
                ctx.clip();
                // Draw on game canvas
                ctx.drawImage(wallCanvas, 0, 0, wallCanvas.width, wallCanvas.height);
                ctx.restore();
                upperBound = e.castStart.y;
            }

            // Shadow on ground
            ctx.save();
            ctx.beginPath();
            ctx.rect(leftBound, upperBound, rightBound - leftBound, lowerBound - upperBound);
            ctx.clip();

            ctx.drawImage(shadowCanvas, wx + ww / 2 - shadowCanvas.width / 2, 
                wy + wh - shadowCanvas.height / 2, 
                shadowCanvas.width, shadowCanvas.height);
            ctx.restore();
        }
    }

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
};