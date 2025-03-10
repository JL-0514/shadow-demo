class Shadow {
    constructor(game, owner, width) {
        Object.assign(this, { game, owner, width });
        this.lightSources = [];
        this.ellipse = [];
        this.leftBound = null;
        this.rightBound = null;
        this.lowerBound = null;
    }
    
    update() {
        this.ellipse = [];
        this.leftBound = null;
        this.rightBound = null;
        this.lowerBound = null;

        for (let i = 0; i < this.lightSources.length; i++) {
            let light = this.lightSources[i];
            let e = {};

            // Distance between character and light source
            let d = getDistance({x: light.x, y: light.y + light.height}, 
                {x: this.owner.x + this.owner.width / 2, y: this.owner.y + this.owner.height});
            // Anle between light source and the top of the character
            let a = Math.atan2(d, light.y - this.owner.height);

            // Length of the shadow
            e.length = Math.abs(Math.sin(a) * light.height - d);
            // Angle of the shadow
            e.angle = Math.atan2(light.y + light.height - (this.owner.y + this.owner.height), 
                light.x - (this.owner.x + this.owner.width / 2)) - Math.PI / 2;
            
            // this.ellipse.push(e);
            
            // Determine whether the shadow is cast on the wall
            let s = Line.createLineByAngle({x: this.owner.x + this.owner.width / 2, 
                y: this.owner.y + this.owner.height}, e.angle, e.length + this.owner.width);
            // Wall to block
            light.blocks.forEach(b => {
                let collide = b.collide(s);
                if (collide) {
                    if (b.points[0].x === b.points[1].x && this.owner.x >= b.points[0].x - PARAMS.BLOCK_SIZE) 
                        this.leftBound = b.points[0].x;
                    else if (b.points[0].x === b.points[1].x && this.owner.x <= b.points[0].x)
                        this.rightBound = b.points[0].x;
                    else if (b.points[0].y === b.points[1].y && this.owner.y <= b.points[0].y)
                        this.lowerBound = b.points[0].y;
                }
                let bottom = this.owner.y + this.owner.height;
                if (b.points[0].y === b.points[1].y && bottom >= b.points[0].y 
                    && bottom <= b.points[0].y + 2 * PARAMS.BLOCK_SIZE)
                    this.lowerBound = b.points[0].y;
            });
            // Wall to cast
            light.cast.forEach(c => {
                let collide = c.collide(s);
                if (collide) {
                    // Endpoint of shadow on ground
                    e.castStart = {x: collide.x, y: collide.y};
                    // Endpoint of shadow on wall
                    e.castEnd = {x: collide.x, y: collide.y - light.height + Math.cos(a) * getDistance(collide, 
                        {x: light.x, y: light.y + light.height})};
                    e.castLine = c;
                }
                
            });

            this.ellipse.push(e);
        }
    }
}