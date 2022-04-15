class Player extends Object {
    constructor(canvas) {
        
        this.radius = 15;
        this.color = 'white';
    }

    centerPosition(canvas) {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
    }

    update() {
        super.update();
    }

    draw() {

    }
}