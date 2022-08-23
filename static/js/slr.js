
function replotLine(plotID, lineDataIndex, sampleDataIndex) {
    /*
    Replots linear line in div <plotID> with data in <dataIndex>.
    Currently only works to update a line constructed by two points.
    */
    const myChart = echarts.getInstanceByDom(document.getElementById('plt_div'));
    var chartSeries = myChart.getOption('series')['series'];
    const oldData = chartSeries[lineDataIndex]['data'];
    const newSlope = document.getElementById('input_slope').value;
    const newIntercept = document.getElementById('input_intercept').value;
    var newData = $.extend( {}, oldData );
    
    
    newData[0][1] = parseFloat(newIntercept);
    newData[1][1] = parseFloat(newSlope * oldData[1][0]) + parseFloat(newIntercept);
    // chartSeries[dataIndex]['data'] = newData;
    console.log("old data");
    console.log(oldData);
    console.log("new data");
    console.log(newData);

    echarts.getInstanceByDom(document.getElementById('plt_div')).setOption(
        {
            series: chartSeries
        }
    );
    echarts.getInstanceByDom(document.getElementById('plt_div')).resize();
    computeRSS(sampleDataIndex);
}

function computeRSS(sampleDataIndex) {
    /*
    Re-computes the residual sum of squared errors and updates the div
    */
    const myChart = echarts.getInstanceByDom(document.getElementById('plt_div'));
    const sampleData = myChart.getOption('series')['series'][sampleDataIndex]['data'];
    const intercept = document.getElementById('input_intercept').value;
    const slope = document.getElementById('input_slope').value;

    var rss = 0;
    for (let i = 0; i < sampleData.length; i++) {
        let d = sampleData[i];
        let fit = parseFloat(slope * d[0]) + parseFloat(intercept);
        rss += Math.pow((fit - d[1]), 2);
    }
    document.getElementById("rss").innerHTML = `<b>Sum of squared residuals: </b> ${Math.round(rss * 1000) / 1000}`;
}