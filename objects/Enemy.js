class Enemy extends Object{
    constructor(speedFactor, player) {
        super(null, null, null, null);
        const enemyData = this.generateEnemy(player);
        this.x = enemyData.x;
        this.y = enemyData.y;
        this.radius = enemyData.radius;
        this.color = enemyData.color;
        this.velocity = enemyData.velocity;
        this.speedFactor = speedFactor;
    }

    generateEnemy(player) {

        let x;
        let y;
        const radius = Math.random() * (30 - 4) + 4;

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

        return {
            x: x,
            y: y,
            radius: radius,
            color: utils.randomColor(),
            velocity: utils.calculateVelocity(x, y, player.x, player.y)
        };
    }

    update() {
        this.x += this.velocity.x * this.speedFactor;
        this.y += this.velocity.y * this.speedFactor;
    }
}