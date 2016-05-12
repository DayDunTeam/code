var commands = {
    input: "green",
    output: "green",
    copyto: "red",
    copyfrom: "red",
    add: "orange",
    sub: "orange",
    jump: "blue"
};

var running = true;

var step = 0;

var input = [
    1,
    2,
    3,
    4,
    5,
    6
];

var output = [];

var holding = null;

var memory = [
    null, null, null, null,
    null, null, null, null,
    null, null, null, null,
    null, null, null, null
];

var program = [
    ["input"],
    ["copyto", 0, false],
    ["input"],
    ["add", 0],
    ["output"],
    ["copyfrom", 0, false],
    ["output"],
    ["jump", 0]
];


function commandDragStart(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function canDropCommand(event) {
    event.preventDefault();
}

function commandDrop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    event.target.appendChild(document.getElementById(data));
}


window.onload = function() {
    update();
};

function stepCode() {
    if (program[step][0] == "input") {
        holding = input.shift();
    } else if (program[step][0] == "output") {
        output.push(holding);
        holding = null;
    } else if (program[step][0] == "copyto") {
        memory[program[step][1]] = holding;
    } else if (program[step][0] == "copyfrom") {
        holding = memory[program[step][1]];
    } else if (program[step][0] == "add") {
        holding += memory[program[step][1]];
    } else if (program[step][0] == "sub") {
        holding += memory[program[step][1]];
    } else if (program[step][0] == "jump") {
        step = program[step][1] - 1;
    }
    step++;
    update();
}

function update() {
    if (running) {
        document.getElementById("programstep").style.display = "";
        document.getElementById("programstep").style["margin-top"] = (4 * step) - 1 + "vw";
        document.getElementById("commands").style.display = "none";
    } else {
        document.getElementById("programstep").style.display = "none";
        document.getElementById("commands").style.display = "";
    }
    
    document.getElementById("commands").innerHTML = "";
    for (var i in commands) {
        document.getElementById("commands").innerHTML += "<li><span class=\"command " + commands[i] + "\">" + i + "</span></li>";
    }
    
    document.getElementById("programlist").innerHTML = "";
    for (i=0; i<program.length; i++) {
        if (program[i][0] == "copyto" || program[i][0] == "copyfrom" || program[i][0] == "jump" || program[i][0] == "add" || program[i][0] == "sub") {
            document.getElementById("programlist").innerHTML += "<li draggable=\"true\" ondragstart=\"commandDragStart(event);\"><span class=\"command " + commands[program[i][0]] + "\">" + program[i][0] + "</span><span class=\"command " + commands[program[i][0]] + "\">" + program[i][1] + "</span></li>";
        } else {
            document.getElementById("programlist").innerHTML += "<li draggable=\"true\" ondragstart=\"commandDragStart(event);\"><span class=\"command " + commands[program[i][0]] + "\">" + program[i][0] + "</span></li>";
        }
    }
    
    
    document.getElementById("inputlist").innerHTML = "";
    for (i=0; i<input.length; i++) {
        document.getElementById("inputlist").innerHTML += "<li><span class=\"number\">" + input[i] + "</span></li>";
    }
    if (holding) {
        document.getElementById("holding").innerHTML = "Holding: " + "<span class=\"number\">" + holding + "</span>";
    } else {
        document.getElementById("holding").innerHTML = "Holding: none";
    }
    document.getElementById("step").innerHTML = "Step: " + step;
    document.getElementById("outputlist").innerHTML = "";
    for (i=0; i<output.length; i++) {
        document.getElementById("outputlist").innerHTML += "<li><span class=\"number\">" + output[i] + "</span></li>";
    }
    for (i=0; i<16; i++) {
        if (memory[i]) {
            document.getElementById("memory" + i).innerHTML = "<span class=\"number\">" + memory[i] + "</span>";
        }
    }
}