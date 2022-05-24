var prev_stage = {};
var curr_stage = {};
var metadata = {};
var stages = [];

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

readTextFile("/json/template.json", function (text) {
    metadata = JSON.parse(text);
    stages = metadata['stages'];
});

function fadeDiv(id, in_or_out="in") {
    /*
    Call at the beginning of the transition.
    Fades out all content divs so they can later be
    populated with new content and then faded back in.
    */
    if (in_or_out == "in") {
        $(id).animate({"opacity": "1"}, 500);
    } else {
        $(id).animate({"opacity": "0"}, 500);
    }
    
}

function fillContentDiv(div, prev, curr) {
    var type = curr['type'];
    console.log(div);
    switch(type) {
        case 'text':
            div.innerHTML = curr.content.join('<br><br>');
            break;
        case 'plot':
        case 'image':
            div.innerHTML = "<img src=" + curr['path'] + " />"
    }
}

function fillContentAll() {
    // fill each of the three divs
    for (const x of Array(3).keys()) {
        // TODO add transitions
        
        // into to string to join with div
        var s = "d".concat((x + 1).toString());
        console.log(s);
        var div = document.getElementById(s);

        var prev = prev_stage[x];
        var curr = curr_stage[x];

        setTimeout(fillContentDiv, 500, div, prev, curr);
    }
}

function transitionStage(in_or_out) {
    /*
    Takes in stage and an enum saying whether content
    is faded in or out.
    Specific divs can have a "fade" property (default to true)
    which can be set if the div should remain static.
    */
    for (const x of Array(3).keys()) {
        d = curr_stage[x];
        if (d['format'] !== undefined && 
            d['format']['fade'] !== undefined && 
            d['format']['fade'] == false) {
            continue;
        }
        var id = "#d".concat((x + 1).toString());
        fadeDiv(id, in_or_out);
    }
}

function updateStages(status) {
    /*
    Args: 
        status:      enum, [next / prev]

    Returns:
        nil, updates globals
    */

    var prev_stage_idx = parseInt(document.getElementById('stage').innerHTML);
    switch(status) {
        case 'next':
            var curr_stage_idx = prev_stage_idx + 1
            break;
        case 'prev':
            if (prev_stage_idx == 0) {
                break;
            }
            var curr_stage_idx = prev_stage_idx - 1;
            break;
    }
    document.getElementById('stage').innerHTML = curr_stage_idx;
    curr_stage = stages[curr_stage_idx];
    prev_stage = stages[prev_stage_idx];   
}

function onUpdate(status) {
    /*
    Called on next or prev press. Updates the stage value, then calls cascading
    functions to update the page content.
    */

    
    console.log(curr_stage)
    updateStages(status);
    
    // fade out content
    transitionStage("out");

    // update content
    fillContentAll();

    // fade in content
    transitionStage("in");
}

function onNext() {
    console.log("next");
    onUpdate("next");
}

function onPrev() {
    console.log("prev");
    onUpdate("prev");
}




function main() {
    document.getElementById('nextbtn').addEventListener("click", onNext);

    document.getElementById('backbtn').addEventListener("click", onPrev);
    fadeDiv("#stage-buttons-div");
    fadeDiv("#content");

    curr_stage = stages[0];
    console.log(curr_stage);
    // update content
    fillContentAll();

    // fade in content
    transitionStage("in");
}

setTimeout(() => {
    main();
}, 500);