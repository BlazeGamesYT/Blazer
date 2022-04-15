class Bullet extends MovingObject {
    constructor(player, mouseX, mouseY) {
        super(
            player.x,
            player.y,
            5,
            'white',
            utils.calculateVelocity(player.x, player.y, mouseX, mouseY)
        );
    }

    update(bulletSpeedUpgrades) {
        this.x += this.velocity.x * (bulletSpeedUpgrades / 1.5 + 5);
        this.y += this.velocity.y * (bulletSpeedUpgrades / 1.5 + 5);
    }
}