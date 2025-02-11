class Magazine {
    constructor(x, y, isOutput = false) {
        this.x = x;
        this.y = y;
        this.frames = [];
        this.isOutput = isOutput;
    }

    loadFrames() {
        this.frames = [];
        for (let i = 0; i < 10; i++) {
            this.frames.push(new LeadFrame(this.x, this.y + i * 12));
        }
    }

    dispense() {
        if (this.frames.length > 0) {
            let frame = this.frames.shift(); // Remove the first frame
            this.realignFrames(); // Shift remaining frames up
            return frame;
        }
        return null;
    }

    storeBack(leadFrame) {
        this.frames.unshift(leadFrame); // Puts the defective frame back in the magazine
        this.realignFrames(); // Reorder frames
    }

    receive(leadFrame) {
        // Make sure the lead frame is stacked at the correct position
        let newY = this.y + this.frames.length * 12; 
        leadFrame.setPosition(this.x, newY);
        this.frames.push(leadFrame);
    }

    realignFrames() {
        // Shift all frames up inside the magazine after dispensing
        for (let i = 0; i < this.frames.length; i++) {
            this.frames[i].setPosition(this.x, this.y + i * 12);
        }
    }

    clearFrames() {
        this.frames = [];
    }

    display() {
        // Draw magazine outline
        stroke(0); // Black border
        noFill(); // Transparent fill
        rect(this.x - 5, this.y - 5, 60, 130); // Adjust size as needed

        // Draw lead frames inside the magazine
        for (let frame of this.frames) {
            frame.display();
        }
    }
}
