class Player extends Object {
    constructor(canvas) {
        super(
            canvas.width / 2,
            canvas.height / 2,
            15,
            'white'
        )
    }

    centerPosition(canvas) {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
    }

}