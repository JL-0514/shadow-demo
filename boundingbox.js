class BoundingBox {

    constructor(x, y) {
        if (this.constructor == BoundingBox) {
            throw new Error("BoundindBox is an abstract class can can't be initialized.");
        }
        Object.assign(this, { x, y });
      }

    /**
     * Determine whether this entity collide with another entity based on their bounding box.
     * 
     * @param {BoundingBox} oth The other entity.
     * @returns Whether two entities collide.
     */
    collide(oth) {
        if (this instanceof RectangularBB && oth instanceof RectangularBB) {    // Both are rectangular box
            return this.right > oth.left && this.left < oth.right && this.top < oth.bottom && this.bottom > oth.top;
        } else if (this instanceof CircularBB && oth instanceof CircularBB) {       // Both are circular box
            let dx = this.x - oth.x;
            let dy = this.y - oth.y;
            return Math.sqrt(dx * dx + dy * dy) < this.radius + oth.radius;
        } else {    // One rectangular and one circular
            let rect = this instanceof RectangularBB ? this : oth;
            let cir = this instanceof CircularBB ? this : oth;
            return cir.x > rect.left - cir.radius && cir.x < rect.right + cir.radius 
                && cir.y > rect.top - cir.radius && cir.y < rect.bottom + cir.radius;
        }
    }

    overlap(oth) {
        let a_half = {x: this.width / 2, y: this.height / 2};
        let b_half = {x: oth.width / 2, y: oth.height / 2};

        let a_center = {x: this.right - a_half.x, y: this.bottom - a_half.y};
        let b_center = {x: oth.right - b_half.x, y: oth.bottom - b_half.y};

        let ox = a_half.x + b_half.x - Math.abs(a_center.x - b_center.x);
        let oy = a_half.y + b_half.y - Math.abs(a_center.y - b_center.y);

        return {x: ox, y: oy};
    }
}

class RectangularBB extends BoundingBox {
    /**
     * Create a rectangular bounding box for the entity.
     * 
     * @param {number} x The x-coordinate of the upper left corner of the bounding box.
     * @param {number} y The y-coordinate of the upper left corner of the bounding box.
     * @param {number} width The width of the bounding box.
     * @param {number} height The height of the boundng box.
     */
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width;
        this.height = height;

        this.left = x;
        this.top = y;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    };
}

class CircularBB extends BoundingBox {
    /**
     * Create a circular bounding box.
     * 
     * @param {number} x The x-coordinate of the center point of the bounding box.
     * @param {number} y The y-coordinate of the center point of the bounding box.
     * @param {number} radius The radius of the circle.
     */
    constructor(x, y, radius) {
        super(x, y);
        this.radius = radius;
    };
}