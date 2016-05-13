var commands = {
    input: "green",
    output: "green",
    copyto: "red",
    copyfrom: "red",
    add: "orange",
    sub: "orange",
    jump: "blue"
};

var running = false;

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
    ["add", 0, false],
    ["output"],
    ["copyfrom", 0, false],
    ["output"],
    ["jump", 0]
];


var command = {};

command.holding = null;

command.isNew = false;

command.placehloder = null;

command.dragStart = function(event) {
    /*if (running) {
        event.preventDefault();
    } else {*/
        command.placeholder = document.createElement("li");
        var placeholder = document.createElement("span");
        placeholder.className = "command commandplaceholder";
        command.placeholder.appendChild(placeholder);
        
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/html", event.target.innerHTML);
        command.holding = event.target;
        command.isNew = event.target.parentNode.id == "commands";
        //event.target.style.display = "none";
    //}
};

command.canDrop = function(event) {
    event.preventDefault();
};

command.dragEnter = function(event, element) {
    if (!command.isNew) {
        command.holding.style.display = "none";
    }
    
    var isAfter = false;
    for (i=command.placeholder; i; i=i.previousSibling) {
        if (i === event.target) {
            isAfter = true;
        }
    }
    
    if (!isAfter) {
        document.getElementById("programlist").insertBefore(command.placeholder, element.nextSibling);
    } else {
        document.getElementById("programlist").insertBefore(command.placeholder, element);
    }
};

command.drop = function(event) {
    event.preventDefault();
    i=0;
    child = command.placeholder;
    while ((child=child.previousSibling) !== null) {
        i++;
    }
    console.log(i);
    commandType = command.holding.firstChild.innerHTML;
    if (command.isNew) {
        if (commandType == "copyto" || commandType == "copyfrom" || commandType == "add" || commandType == "sub") {
            program[i][1] = 0;
            program[i][2] = false;
        } else if (commandType == "jump") {
            program[i][1] = 0;
        }
        program.splice(i, 0, [commandType]);
        holdingClone = command.holding.cloneNode(true);
        holdingClone.ondragstart = command.dragStart;
        holdingClone.ondragenter = function(event) {command.dragEnter(event, this);};
        document.getElementById("programlist").replaceChild(holdingClone, command.placeholder);
        holdingClone.style.display = "";
    } else {
        j=0;
        child = command.holding;
        while ((child=child.previousSibling) !== null) {
            j++;
        }
        console.log(j);
        oldCommand = program[j-1];
        program.splice(j-1, 1);
        if (i > j) {
            program.splice(i-1, 0, oldCommand);
        } else {
            program.splice(i, 0, oldCommand);
        }
        document.getElementById("programlist").replaceChild(command.holding, command.placeholder);
        command.holding.style.display = "";
    }
    command.placeholder = null;
    command.holding = null;
    update();
};

command.dragEnd = function(event) {
    if (command.placeholder && command.placeholder.parentNode && command.holding) {
        command.placeholder.parentNode.removeChild(command.placeholder);
        if (!command.isNew) {
            command.holding.parentNode.removeChild(command.holding);
        }
    }
};

window.ondragend = command.dragEnd;


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
        holding -= memory[program[step][1]];
    } else if (program[step][0] == "jump") {
        step = program[step][1] - 1;
    }
    step++;
    update();
}

function setProgramStepPos() {
    document.getElementById("programstep").style["margin-top"] = ((4 * step - 1) / 100 * window.innerWidth - document.getElementById("program").scrollTop) + "px";
}

function update() {
    if (running) {
        document.getElementById("programstep").style.display = "";
        setProgramStepPos();
        document.getElementById("commands").style.display = "none";
    } else {
        document.getElementById("programstep").style.display = "none";
        document.getElementById("commands").style.display = "";
    }
    
    document.getElementById("commands").innerHTML = "";
    for (var i in commands) {
        element = document.createElement("li");
        element.draggable = true;
        element.ondragstart = command.dragStart;
        
        element2 = document.createElement("span");
        element2.className = "command " + commands[i];
        element2.innerHTML = i;
        
        element.appendChild(element2);
        
        document.getElementById("commands").appendChild(element);
    }
    
    document.getElementById("programlist").innerHTML = "";
    for (i=0; i<program.length; i++) {
        element = document.createElement("li");
        element.draggable = true;
        element.ondragstart = command.dragStart;
        element.ondragenter = function(event) {command.dragEnter(event, this);};
        
        element2 = document.createElement("span");
        element2.className = "command " + commands[program[i][0]];
        element2.innerHTML = program[i][0];
        
        element.appendChild(element2);
        
        if (program[i][0] == "copyto" || program[i][0] == "copyfrom" || program[i][0] == "jump" || program[i][0] == "add" || program[i][0] == "sub") {
            var element3 = document.createElement("span");
            element3.className = "command " + commands[program[i][0]];
            element3.innerHTML = program[i][1];
            element.appendChild(element3);
        }
        
        document.getElementById("programlist").appendChild(element);
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