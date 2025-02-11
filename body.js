class Chassis {
    constructor(points) {
        this.points = points; // Array of {x, y} objects for each vertex
        this.color = [245, 245, 220]; // Beige color
    }

    display() {
        fill(this.color);
        stroke(0); // Black outline
        strokeWeight(2);
        beginShape();
        
        for (let p of this.points) {
            vertex(p.x, p.y); // Draw each vertex
        }
        
        endShape(CLOSE);
    }
}
