class Enemy extends MovingObject {
    constructor(speedFactor) {

        this.radius = Math.random() * (30 - 3) + 3;
        this.color = color;
        this.speedFactor = speedFactor;

        if (Math.random() < 0.5) {
            this.x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            this.y = Math.random() * canvas.height;
        } else {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

        this.velocity = this.calculateVelocity 
    }

    update() {
        this.x += this.velocity.x * speedFactor;
        this.y += this.velocity.y * speedFactor;
    }
}