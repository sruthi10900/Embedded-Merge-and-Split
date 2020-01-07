function createLineChartMiddle(data, columnToVisualize, dateColumn) {

    var countData = d3.nest()
        .key(d => moment(d[dateColumn], 'YYYY-MM-DD').format('YYYYMM'))
        .rollup(function(v) { return d3.sum(v, function(d) { return d[columnToVisualize]; });  })
        .entries(data)

    countData = countData.filter(function(d) { return d["key"] != "Invalid date" })
        
    countData.sort(function(x,y) {
        return d3.ascending(x["key"], y["key"])
    })

    countData = countData.map(d => {
        return { date : d3.timeParse("%Y%m")(d["key"]), value : d.value }
    })

    createElementsForLineChart()
    showDataInLineChart(countData, columnToVisualize)
}

function getScalesForLineChart(data) {

    let xScale = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.date; }))
        .range([60, 350])

    let yScale = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([140, 10])

    return {xScale, yScale}
}

function createElementsForLineChart() {
    let divContainer = d3.select("#middle_graph_panel_container")

    // Add an svg
    if(d3.select("#middle_graph_panel_container").select("svg").empty()) {
        divContainer.append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .style("position", "absolute")
            .style("top", "20px")
    }
}

function showDataInLineChart(data, columnToVisualize) {

    var parseDate = d3.timeParse("%Y%m"),
        bisectDate = d3.bisector(function(d) { return d.date; }).left,
        dateFormatter = d3.timeFormat("%Y%m");

    let {xScale, yScale} = getScalesForLineChart(data)

    let svgContainer = d3.select("#middle_graph_panel_container").select("svg")

    // Add x axis
    d3.select("#linePlotXAxis").remove()
    d3.select("#linePlotYAxis").remove()
    d3.select("#linePlotXLabel").remove()
    d3.select("#linePlotYLabel").remove()
    d3.select("#mainLinePlot").remove()

    svgContainer.append("g")
        .attr("id", "linePlotXAxis")
        .attr("transform", `translate(0, 140)`)

    // Add y axis
    svgContainer.append("g")
        .attr("id", "linePlotYAxis")
        .attr("transform", `translate(60, 0)`)

    // Add a text tag for xaxis label
    svgContainer.append("text")
        .attr("id", "linePlotXLabel")
        .attr("transform", `translate(${205}, ${170})`)
        .attr("text-anchor", "middle")
        .style("font-family", "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif")
        .style("font-size", 10)
        .text("Time")

    // Add a text tag for yaxis label
    svgContainer.append("text")
        .attr("id", "linePlotYLabel")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${15}, ${70}) rotate(-90)`)
        .style("font-family", "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif")
        .style("font-size", 10)
        .text(columnToVisualize)

    let xAxis = d3.axisBottom(xScale)
    let yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(function(e){
        if(e >= 1000000000){
            return `${e/1000000000}B`
        }
        if(e >= 1000000){
            return `${e/1000000}M`
        }
        if(e >= 1000){
            return `${e/1000}K`
        }
        return e;
    })

    d3.select("#linePlotXAxis").call(xAxis)
    d3.select("#linePlotYAxis").call(yAxis)

    // Add main scatter plot
    svgContainer.append("g").attr("id", "mainLinePlot")

    d3.select("#mainLinePlot").selectAll("path").remove()

    // Add the line
    d3.select("#mainLinePlot").append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return xScale(d.date) })
            .y(function(d) { return yScale(d.value) })
        )

    // Add circles
    let focus = d3.select("#mainLinePlot").append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("circle")
        .attr("r", 5);

    focus.append("rect")
        .attr("class", "tooltip")
        .attr("width", 100)
        .attr("height", 50)
        .attr("x", 10)
        .attr("fill", "white")
        .attr("y", -22)
        .attr("rx", 4)
        .attr("ry", 4);

    focus.append("text")
        .attr("class", "tooltip-date")
        .attr("x", 18)
        .attr("y", -2);

    focus.append("text")
        .attr("x", 18)
        .attr("y", 18)
        .text(`Count:`);

    focus.append("text")
        .attr("class", "tooltip-value")
        .attr("x", 60)
        .attr("y", 18);

    d3.select("#mainLinePlot").append("rect")
        .attr("class", "overlay")
        .attr("width", 350)
        .attr("height", 140)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = xScale.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + xScale(d.date) + "," + yScale(d.value) + ")");
        focus.select(".tooltip-date").text(dateFormatter(d.date));
        focus.select(".tooltip-value").text(function(){
            let e = d.value
            if(e >= 1000000000){
                return `${(e/1000000000).toFixed(2)}B`
            }
            if(e >= 1000000){
                return `${(e/1000000).toFixed(2)}M`
            }
            if(e >= 1000){
                return `${(e/1000).toFixed(2)}K`
            }
            return e;
        });
    }
}