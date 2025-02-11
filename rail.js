class Rail {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.activeFrame = null;
    }

    transport(frame, callback) {
        this.activeFrame = frame;
        let interval = setInterval(() => {
            frame.move(5, 0);
            if (frame.x >= this.x2) {
                clearInterval(interval);
                frame.markLeavingPress(); // Change color only at the end
                callback();
                this.activeFrame = null;
            }
        }, 50);
    }

    display() {
        stroke(0);
        fill(100, 50, 100);
        rect(this.x1, this.y1, this.x2 - this.x1, 10);
        if (this.activeFrame) {
            this.activeFrame.display();
        }
    }
}
