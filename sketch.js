let startButton, stopButton, loadButton;
let pressureSlider, pressureValue;
let errorMessage = "";

let magazine, rail, outputMagazine, pressHead;
let autoMode = false;
let isLoaded = false;
let hasError = false;
let errorFrame = null; // Store the defective lead frame
let errorMessageElement;
let psElement;
let chassis;

function setup() {
    createCanvas(650, 400);
    
    // Buttons
    loadButton = createButton('Load Frames');
    loadButton.position(20, 420);
    loadButton.mousePressed(loadFrames);
  
    repairButton = createButton('Repair Frame');
    repairButton.position(20, 450);
    repairButton.mousePressed(repairFrame);
    
    startButton = createButton('Auto Start');
    startButton.position(120, 420);
    startButton.mousePressed(startProcess);
    
    stopButton = createButton('Auto Stop');
    stopButton.position(120, 450);
    stopButton.mousePressed(stopProcess);
  
    clrAlrmButton = createButton('Clear Alarm');
    clrAlrmButton.position(220, 450);
    clrAlrmButton.mousePressed(clearAlarm);
  
    unloadMagButton = createButton('Unload Magazine');
    unloadMagButton.position(220, 420);
    unloadMagButton.mousePressed(unloadMag);

    // Pressure Slider
    pressureSlider = createSlider(20, 120, 80); // Min: 20, Max: 120, Default: 80
    pressureSlider.position(350, 420);
    
    // Label for Pressure
    createP("Adjust Pressure").position(350, 390);
    createP("Alarm Text:").position(20, 470);
    errorMessageElement = createP("").position(100, 470); 
    errorMessageElement.style("color", "red"); // Style the text red
    createP("Process State:").position(20, 500);
  
    magazine = new Magazine(50, 65);
    rail = new Rail(105, 75, 500, 60);
    outputMagazine = new Magazine(505, 65, true);
    pressHead = new PressHead(260, 0);
    console.log("System initialized.");
    
    ps = createP("IDLE").position(115, 500);
    ps.style("color", "orange");
  
  // Define 8 manually-set points (adjust as needed)
    let y1 = 195;
    let y2 = 350;
    let y3 = 80;
    
    let chassisPoints = [
        { x: 45, y: y1 }, // Top-left
        { x: 110, y: y1 }, // Top-right
        { x: 110, y: y3 }, // Right-top
        { x: 495, y: y3 }, // Right-bottom
        { x: 495, y: y1 }, // Bottom-right
        { x: 560, y: y1 }, // Bottom-left
        { x: 560, y: y2 }, // Left-bottom
        { x: 45, y: y2 }  // Left-top
    ];

    chassis = new Chassis(chassisPoints);
}

function draw() {
    background(220);
    chassis.display();
    magazine.display();
    rail.display();
    outputMagazine.display();
    pressHead.display();

    if (autoMode && !hasError && rail.activeFrame === null) {
        processNextFrame();
    }

    if (rail.activeFrame && pressHead.isFrameUnderPress(rail.activeFrame)) {
        if (rail.activeFrame.isDefective) {
            hasError = true;
            errorFrame = rail.activeFrame;
            autoMode = false;
            console.log("Aaaaaaa");
            
        } 
        
      else 
        {
            pressHead.activatePress(() => {
                rail.activeFrame.markProcessed();
            });
        }
    }

    pressHead.update();
}

function keyPressed() {
    if (key === 'L') {
        magazine.loadFrames();
        isLoaded = true;
        console.log("Magazine loaded.");
    } else if (key === 'S' && !hasError) {
        autoMode = true;
        console.log("Processing started.");
    } else if (key === 'D') {
        autoMode = false;
        console.log("Process halted.");
    } else if (key === 'U') {
        magazine.clearFrames();
        outputMagazine.clearFrames();
        console.log("Magazine manually unloaded.");
    } else if (key === 'C') {
        hasError = false;
        console.log("Alarm cleared. Press 'R' to repair lead frame.");
    } else if (key === 'R' && errorFrame) {
        errorFrame.isDefective = false;
        console.log("Lead frame repaired. Press 'S' to resume.");
    }
}

//
// Button Functions
//

function unloadMag() 
{
    magazine.clearFrames();
    outputMagazine.clearFrames();
    console.log("Magzines UnLoaded.");

}

function loadFrames() 
{
    magazine.loadFrames();
    isLoaded = true;
    console.log("Frames Loaded.");
    ps.style("color", "darkblue");
    ps.html("READY")
}

function repairFrame() 
{
    errorFrame.isDefective = false;
    ps.style("color", "darkblue");
    ps.html("READY")
}

function startProcess() {
    autoMode = true;
    console.log("Press Started.");
    ps.style("color", "darkgreen");
    ps.html("RUN")
}

function stopProcess() {
    autoMode = false;
    console.log("Process Stopped.");
    ps.style("color", "maroon");
    ps.html("PAUSE")
}

function clearAlarm() {
    hasError = false;
    errorMessageElement.html("")
    console.log("Clear Alarm");
    ps.style("color", "orange");
    ps.html("IDLE")
    errorMessageElement.html("")
}

//
//
//
function processNextFrame() {
    if (hasError || !magazine.frames.length) {
        autoMode = false;
        console.log("Process stopped due to error or empty magazine.");
        ps.style("color", "orange");
        ps.html("IDLE")
        return;
    }

    let leadFrame = magazine.frames[0]; // Peek at the first frame

    if (leadFrame.isDefective) {
        hasError = true;
        errorFrame = leadFrame;
        autoMode = false;
        ps.style("color", "maroon");
        ps.html("STOP")
        error = leadFrame.alarm.altx;
        errorMessageElement.html("Defective lead frame detected! "+error);
        return; // Stop processing before dispensing
    }

    // Safe to dispense and process
    leadFrame = magazine.dispense();
    rail.transport(leadFrame, () => {
        outputMagazine.receive(leadFrame);
    });
}

