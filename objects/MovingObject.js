class MovingObject extends Object {
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color);
        this.velocity = velocity || {x: 0, y: 0};
    }

    calculateVelocity(targetX, targetY, originX, originY) {
        const angle = Math.atan2(targetY - originY, targetX - originX);

        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}