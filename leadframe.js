class LeadFrame {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.processed = false;
        this.leavingPress = false;
        
        // Speed control
        this.normalSpeed = 5; // Normal speed
        this.slowSpeed = 2;   // Reduced speed
        this.currentSpeed = this.normalSpeed; // Active speed

        // Define Punch Zone (adjust values based on press head location)
        this.punchZoneXStart = 230;
        this.punchZoneXEnd = 350;
        
        // Assign a random probability score (0 to 1)
        this.probabilityScore = random(0, 1);
        this.alarm = { altx: "", alid: 0 };
        
        // Determine if this lead frame has an error
        this.errorType = this.assignError();

        // Flag to check if the frame is defective
        this.isDefective = this.errorType !== "None";
    }

    assignError() {
        if (this.probabilityScore < 0.1) {
            this.alarm.alid = 9001;
            this.alarm.altx = "Bent Lead";
            return "Bent Lead";   // 10% chance
        } else if (this.probabilityScore < 0.15) {
            this.alarm.alid = 9002;
            this.alarm.altx = "Missing Pad";
            return "Missing Pad"; // 5% chance
        } else if (this.probabilityScore < 0.2) {
            this.alarm.alid = 9003;
            this.alarm.altx = "Contaminated frame";
            return "Contaminated"; // 5% chance
        } else {
            return "None"; // 80% chance - Normal frame
        }
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    move() {
        // Check if the frame is in the punch zone
        if (this.x >= this.punchZoneXStart && this.x <= this.punchZoneXEnd) {
            this.currentSpeed = this.slowSpeed; // Slow down in punch zone
        } else {
            this.currentSpeed = this.normalSpeed; // Restore normal speed outside
        }

        this.x += this.currentSpeed;
    }

    markProcessed() {
        this.processed = true;
    }

    markLeavingPress() {
        this.leavingPress = true; // Change color only when leaving
    }

    repair() {
        this.errorType = "None";  // Fix the lead frame
        this.isDefective = false; // Mark as normal
    }

display() {
    // Change color if there's an error
    if (this.isDefective) {
        fill(color(255, 0, 0)); // Red if error
    } else {
        fill(this.leavingPress ? color(173, 216, 230) : color(0, 0, 255)); // Normal
    }

    stroke(0); // Black outline
    strokeWeight(1.0); // Thinner stroke
    rect(this.x, this.y, 50, 10);
}

}
