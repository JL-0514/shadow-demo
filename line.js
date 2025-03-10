class Line {
    // points = [ {x: x1, y: y1}, {x: x2, y: y2} ]
    constructor(points) {
        this.points = points;
    };

    // If collide with another line, raturn intersect point
    // Algorithm by Paul Bourke: https://paulbourke.net/geometry/pointlineplane/
    collide(other) {
        let denom = ((other.points[1].y - other.points[0].y) * (this.points[1].x - this.points[0].x)
                    - (other.points[1].x - other.points[0].x) * (this.points[1].y - this.points[0].y));
        if (denom == 0) return false;

        let ua = ((other.points[1].x - other.points[0].x) * (this.points[0].y - other.points[0].y)
                - (other.points[1].y - other.points[0].y) * (this.points[0].x - other.points[0].x)) / denom;
        let ub = ((this.points[1].x - this.points[0].x) * (this.points[0].y - other.points[0].y)
                - (this.points[1].y - this.points[0].y) * (this.points[0].x - other.points[0].x)) / denom;
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return false;

        let x = this.points[0].x + ua * (this.points[1].x - this.points[0].x);
        let y = this.points[0].y + ua * (this.points[1].y - this.points[0].y);
        return {x: x, y: y};
    };

    /**
     * @returns Lenght of the line of point 0 to point 1.
     */
    length() {
        return getDistance({x: this.points[0].x, y: this.points[0].y}, {x: this.points[1].x, y: this.points[1].y});
    }

    /**
     * @returns Slope of this line. Return false if this is a vertical line.
     */
    slope() {
        if (this.points[1].x !== this.points[0].x)
           return (this.points[1].y - this.points[0].y) / (this.points[1].x - this.points[0].x);
        else return false;
    };

    /**
        * @returns The y-intercept of this line.
        */
    yInt() {
        if (this.points[0].x === this.points[1].x) return this.points[0].x === 0 ? 0 : false;
        if (this.points[0].y === this.points[1].y) return this.points[0].y;
        return this.points[0].y - this.slope() * this.points[0].x;
    };

    /**
     * Get the points of intersection between a line and a rotated ellipse.
     * Equation of ellipse: ((x-h)cos(angle)+(y-k)sin(angle))^2 / xr^2 + ((x-h)sin(angle)-(y-k)cos(angle))^2 / yr^2 = 1
     * Equation of line: y = mx+c
     * where m is slope and c is y-intercept
     * 
     * @param {number} xr The radius of ellipse along x-axis.
     * @param {number} yr The radius of ellipse along y-axis.
     * @param {number} h The x-coordinate of tehe center point of the ellipse.
     * @param {number} k The y-coordinate of tehe center point of the ellipse.
     * @param {number} angle The angle of rotation. Positive angle means rotating counter-clockwise.
     */
    collideRotatedEllipse(xr, yr, h, k, angle) {
        let m = this.slope();
        let c = this.yInt();

        let cosa = Math.cos(angle) * Math.cos(angle) / (xr * xr);
        let cosb = Math.cos(angle) * Math.cos(angle) / (yr * yr);
        let sina = Math.sin(angle) * Math.sin(angle) / (xr * xr);
        let sinb = Math.sin(angle) * Math.sin(angle) / (yr * yr);
        let sincosab = (Math.sin(angle) * Math.cos(angle) / (xr * xr)) - (Math.sin(angle) * Math.cos(angle) / (yr * yr));

        let A = cosa + sinb + m * m * (sina + cosb) + 2 * m * sincosab;

        let B = 0;
        if (m == 0) B = 2 * (c - k) * sincosab;     // Handle horizontal line
        else B = 2 * (-h * (cosa + sinb) + m * (c - k) * (sina + cosb) + (c - k) * sincosab);

        let C = 0;
        if (m == 0) C = (c - k) * (c - k) * (sina + cosb) - 1;      // Handle horizontal line
        else C = h * h * (cosa + sinb) + (c - k) * (c - k) * (sina + cosb) + 2 * h * (c - k) * sincosab - 1;

        let denom = B * B - 4 * A * C;
        if (denom < 0) return [];   // No intersection

        let result = [];
        let x = (-B + Math.sqrt(denom)) / (2 * A);
        let y = m * x + c;
        result.push({x: x, y: y});      // Intersection 1
        x = (-B - Math.sqrt(denom)) / (2 * A);
        y = m * x + c;
        result.push({x: x, y: y});      // Intersection 2

        return result;
    }

    /**
     * Create a line that start at the start point, move toward the given angle, and has the given length.
     * 
     * @param {*} start A start point with x and y coordinates.
     * @param {number} angle The angle of the line.
     * @param {number} length The length of the line.
     * @returns 
     */
    static createLineByAngle(start, angle, length) {
        let endX = start.x + Math.sin(angle) * length;
        let endY = start.y - Math.cos(angle) * length;
        return new Line([start, {x: endX, y: endY}]);
    }
}