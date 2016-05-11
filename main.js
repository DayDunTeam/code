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

var code = [
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
    if (code[step][0] == "input") {
        holding = input.shift();
    } else if (code[step][0] == "output") {
        output.push(holding);
        holding = null;
    } else if (code[step][0] == "copyto") {
        memory[code[step][1]] = holding;
    } else if (code[step][0] == "copyfrom") {
        holding = memory[code[step][1]];
    } else if (code[step][0] == "jump") {
        step = code[step][1] - 1;
    }
    step++;
    update();
}

function update() {
    document.getElementById("inputlist").innerHTML = "";
    for (i=0; i<input.length; i++) {
        document.getElementById("inputlist").innerHTML =+ "<li>" + input[i] + "</li>";
    }
    document.getElementById("holding").innerHTML = "Holding: " + holding;
    document.getElementById("step").innerHTML = "Step: " + step;
    document.getElementById("outputlist").innerHTML = "";
    for (i=0; i<output.length; i++) {
        document.getElementById("outputlist").innerHTML =+ "<li>" + output[i] + "</li>";
    }
    for (i=0; i<16; i++) {
        document.getElementById("memory" + i).innerHTML = memory[i];
    }
}