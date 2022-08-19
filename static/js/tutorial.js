var prev_stage = {};
var curr_stage = {};
var metadata = {};
var stages = [];
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// This function will be called repeatly while dragging.
// The mission of this function is to update `series.data` based on
// the new points updated by dragging, and to re-render the line
// series based on the new data, by which the graphic elements of the
// line series can be synchronized with dragging.
function onPointDragging(dataIndex) {
    // Here the `data` is declared in the code block in the beginning
    // of this article. The `this` refers to the dragged circle.
    // `this.position` is the current position of the circle.
    data[dataIndex] = myChart.convertFromPixel('grid', this.position);
    // Re-render the chart based on the updated `data`.
    myChart.setOption({
      series: [
        {
          id: 'a',
          data: data
        }
      ]
    });
  }

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

function onPointDragging(dataIndex, myChart, pos) {
    console.log("IN DRAG FUNC")
    // Here the `data` is declared in the code block in the beginning
    // of this article. The `this` refers to the dragged circle.
    // `this.position` is the current position of the circle.
    data[dataIndex] = myChart.convertFromPixel('grid', pos);
    // Re-render the chart based on the updated `data`.
    myChart.setOption({
      series: [
        {
          id: 'a',
          data: data
        }
      ]
    });
}

function showTooltip(dataIndex) {
    console.log("OVER")
    myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: dataIndex
    });
}
function hideTooltip(dataIndex) {
    myChart.dispatchAction({ type: 'hideTip' });
}

function renderPlot(div, prev, curr) {
    // if previous was not a plot, we need to zero out the innerHTML
    div.innerHTML = '<div id="plt_div"></div>';
    let plt_div = document.getElementById('plt_div');
    var option = curr['option'];
    let myChart = echarts.init(plt_div);
    
    // check if we are doing interactions
    var drag = curr['format']['drag'] || false;
    
    //console.log(JSON.stringify(curr['option']));
    console.log("OPTION");
    console.log(typeof(option));
    console.log(option);
    if (drag) {
        var data = curr['option']['series'][0]['data'];
        var symbolSize = curr['option']['series'][0]['symbolSize'];

        setTimeout(function() {
            myChart.setOption(echarts.util.map(data, function(item, dataIndex) {
                console.log("DATA");
                console.log(item)
                console.log("DATA INDEX")
                console.log(dataIndex)
                return {
                  type: 'circle',
                  position: myChart.convertToPixel('grid', item),
                  shape: { cx: 0,
                    cy: 0, r: symbolSize / 2 },
                  invisible: true,
                  draggable: true,
                  ondrag: function (dx, dy) {
                      console.log(dx, dy);
                      onPointDragging(dataIndex, [dx, dy]);
                  },
                  onmousemove: echarts.util.curry(showTooltip, dataIndex),
                  onmouseout: echarts.util.curry(hideTooltip, dataIndex),
                  z: 100
                };
              }));
        }, 0);

        //console.log("Setting option");

        //myChart.setOption(option);
        
            
        
        window.addEventListener('resize', function() {
            myChart.setOption({
                graphic: echarts.util.map(data, function(item, dataIndex) {
                    return { position: myChart.convertToPixel('grid', item) };
                })
            });
        });
    }
    console.log("option");
    
    
    console.log(option);
    window.onresize = function() {
        myChart.resize();
      };
}

function fillContentDiv(div, prev, curr) {
    var type = curr['type'];
    switch(type) {
        case 'text':
            console.log('in text')
            div.innerHTML = curr.content.join('<br><br>');
            break;
        case 'plot':
            console.log('in plot');
            renderPlot(div, prev, curr);
            break;
        case 'image':
            console.log('in image');
            div.innerHTML = "<img src=" + curr['path'] + " />"
    }
}

function fillContentAll() {
    // fill each of the three divs
    for (const x of Array(3).keys()) {
        // TODO add transitions
        
        // into to string to join with div
        var s = "d".concat((x + 1).toString());
        var div = document.getElementById(s);

        var prev = prev_stage[x] || {};
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

    // Handle edge cases
    var stage_idx = document.getElementById('stage').innerHTML;
    if ((stage_idx == 0 && status == "prev") ||
        (stage_idx == (stages.length - 1) && status == "next")) {
            console.log("cannot do")
            return
        }

    
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

    var stage_idx = urlParams.get('stage') || 0;
    document.getElementById('stage').innerHTML = stage_idx;

    curr_stage = stages[stage_idx];
    console.log(curr_stage);
    // update content
    fillContentAll();

    // fade in content
    transitionStage("in");
}

setTimeout(() => {
    main();
}, 500);