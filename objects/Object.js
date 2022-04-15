class Object {
    constructor(x, y, radius, color) {
        this.x = x || 0;
        this.y = y || 0;
        this.radius = radius || 15;
        this.color = color || 'white';
    }

    draw(c) {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fill();
        c.closePath();
    }
}