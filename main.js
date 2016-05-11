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
    ["output"],
    ["copyfrom", 0, false],
    ["output"],
    ["jump", 0]
];

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
    } else if (program[step][0] == "jump") {
        step = program[step][1] - 1;
    }
    step++;
    update();
}

function update() {
    document.getElementById("programlist").innerHTML = "";
    for (i=0; i<program.length; i++) {
        document.getElementById("programlist").innerHTML += "<li><span class=\"command\">" + program[i][0] + "</span></li>";
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