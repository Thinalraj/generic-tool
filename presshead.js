class PressHead {
    constructor(x, y) {
        this.x = x; // Middle of rail
        this.y = y;
        this.originalY = y;
        this.pressY = y;
        this.pressSpeed = 5;
        this.pressing = false;
        this.isPressing = false;
        this.callback = null;
    }

display() {
    fill(100, 100, 100); // Dark Gray (Steel)
    rect(this.x, this.pressY, 100, 40);
}


    isFrameUnderPress(frame) {
        return frame.x >= this.x-50 && frame.x <= this.x + 100; // Center range
    }

    activatePress(callback) {
        if (!this.isPressing) {
            this.isPressing = true;
            this.callback = callback;
        }
    }

    update() {
        if (this.isPressing) {
            if (!this.pressing && this.pressY < this.originalY + 30) {
                this.pressY += this.pressSpeed; // Move down
            } else {
                this.pressing = true;
                if (this.pressY > this.originalY) {
                    this.pressY -= this.pressSpeed; // Move up
                } else {
                    this.pressing = false;
                    this.isPressing = false;
                    if (this.callback) this.callback();
                    this.callback = null;
                }
            }
        }
    }
}
