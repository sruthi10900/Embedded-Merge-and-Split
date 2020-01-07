/**
 * Bugs:
 * 1. The pie charts are not in the middle after merge
 * 
 * LEFT:
 * 1. Merge along vertical axis
 */

let scaleType = {
    LINEAR: "LINEAR",
    POWER: "POWER",
    LOG: "LOG",
    ORDINAL: "ORDINAL"    
};

let tip = null
let domainX = null

let globalsForMatrix = {
    marginsForMatrixCharts: {
        top: 80,
        bottom: 15,
        left: 60,
        right: 20
    },

    paddingForMatrixCharts: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    },
    boundingPanel: "top_cluster_panel_matrix_svg",
    boundingRect: null,
    firstCategory: "Measure",
    secondCategory: "State"
}

let boundingMatrix = {
    MATRIX_CHART_WIDTH: null,
    MATRIX_CHART_HEIGHT: null
}

function createMatrixChart(data, firstCat, secondCat) {

    if(d3.select("#top_cluster_panel_matrix_svg").empty()) {
        d3.select("#top_cluster_panel_container").append("svg")
            .attr("width", "100%")
            .attr("height", "120%")
            .attr("id", "top_cluster_panel_matrix_svg")
    }

    globalsForMatrix.firstCategory = firstCat
    globalsForMatrix.secondCategory = secondCat

    globalsForMatrix.boundingRect = document.getElementById("top_cluster_panel_matrix_svg").getBoundingClientRect()
    boundingMatrix.MATRIX_CHART_WIDTH = globalsForMatrix.boundingRect.width - globalsForMatrix.marginsForMatrixCharts.left - globalsForMatrix.marginsForMatrixCharts.right - globalsForMatrix.paddingForMatrixCharts.left - globalsForMatrix.paddingForMatrixCharts.right
    boundingMatrix.MATRIX_CHART_HEIGHT = globalsForMatrix.boundingRect.height - globalsForMatrix.marginsForMatrixCharts.top - globalsForMatrix.marginsForMatrixCharts.bottom - globalsForMatrix.paddingForMatrixCharts.top - globalsForMatrix.paddingForMatrixCharts.bottom

    var countData = d3.nest()
        .key(d => convertToID(d[globalsForMatrix.firstCategory]))
        .key(d => convertToID(d[globalsForMatrix.secondCategory]))
        .rollup(function(v) { return v.length.toString() })
        .entries(data)
    
    let lengthOfFirstLevel = countData.length
    let lengthOfSecondLevel = countData[0].values.length
    let modifiedCountData = []
    for(let i = 0; i < lengthOfFirstLevel; i++) {
        for(let j = 0; j < lengthOfSecondLevel; j++) {
            key1 = `${countData[i].key}`
            key2 = `${countData[i].values[j].key}`
            count = countData[i].values[j].value
            modifiedCountData.push({"Category1": key1, "Category2": key2, "count": count})
        }
    }
    domainX = [...new Set(modifiedCountData.map(d => d["Category1"]))]

    // Get unique
    initializeMatrixChart(data, modifiedCountData)
    showMatrixData(modifiedCountData)
}

function invertScale(scale){
    var domain = scale.domain()
    var range = scale.range()

    if(scale.type == scaleType.LINEAR)
        scale = d3.scaleQuantize().domain(range).range(domain)
    else
        scale = d3.scaleOrdinal().domain(range).range(domain)

    return function(x){
        return scale(x)
    }
}

function getMatrixDragObject(modifiedCountData) {

    let {xScale, yScale, sizeScale, colorScale} = getMatrixScales(modifiedCountData)

    // custom invert function
    let xScaleInvert = invertScale(xScale)
    let yScaleInvert = invertScale(yScale)

    let dragObject = d3.drag()
        .on("start", d => {
            let circlesInTheCategory = d3.selectAll(`.${d}`)

            // Actually create the temp group
            let tempG = d3.select(`#${globalsForMatrix.boundingPanel}MatrixChart`).append("g").attr("id", "matrixTemp")
            circlesInTheCategory.each(d => {
                tempG.append("circle")
                    .attr("cx", xScale(d["Category1"]) + xScale.bandwidth()/2)
                    .attr("cy", yScale(d["Category2"]))
                    .attr("id", `${d["Category2"]}_matrixTemp`)
                    .attr("r", function(){
                        let sumOfAllEntries = d3.sum(d["count"].split("-").map(k => +k))
                        return sizeScale(sumOfAllEntries)
                    })
                    .attr("stroke", "black")
                    .attr("fill", "none")
                    .style("stroke-dasharray", ("5, 2"))
                    .style("stroke-width", "2")
            })
            
        })
        .on("drag", d => {

            let mouseX = d3.event.x
            let nearestCategory = xScaleInvert(mouseX)
            let nearestData = []
            d3.selectAll(`.${nearestCategory}`).each(function(row) {
                nearestData.push(row)
            })

            d3.select("#matrixTemp").selectAll("circle").each(function(d, i){

                let indexToConsider = -1
                let category2 = d3.select(this).attr("id").replace("_matrixTemp", "")
                nearestData.forEach((ele, index) => {
                    if(nearestData[index]["Category2"] == category2) {
                        indexToConsider = index
                    }
                })

                d3.select(this).transition()
                    .duration(100)
                    .ease(d3.easeLinear)
                    .attr("cx", xScale(nearestData[indexToConsider]["Category1"]) + xScale.bandwidth()/2)
                    .attr("r", function(){
                        let sumOfAllEntries = d3.sum(nearestData[indexToConsider]["count"].split("-").map(k => +k))
                        return sizeScale(sumOfAllEntries)
                    })
            })
        })
        .on("end", d => {

            d3.select("#matrixTemp").remove()

            // Get target data
            let circleData = []
            d3.selectAll(`.${d}`).each(function(row) {
                circleData.push(row)
            })

            // Get nearest data
            // Get nearest category
            let mouseX = d3.event.x
            let nearestCategory = xScaleInvert(mouseX)
            let nearestData = []
            d3.selectAll(`.${nearestCategory}`).each(function(row) {
                nearestData.push(row)
            })
            
            // If the targetCategory is same as nearest category then it meens we need to split
            if(d == nearestCategory) {
                
                modifiedCountData.forEach((element, index) => {
                    if(element["Category1"] == d) {
                        listOfCategory1 = element["Category1"].split("-")
                        listOfCounts = element["count"].split("-")
                        num = listOfCounts.length
                        modifiedCountData[index] = {"Category1":listOfCategory1[0], "Category2": element["Category2"], "count":listOfCounts[0]}
                        for(let i = 1; i < num; i++) {
                            modifiedCountData.push({"Category1":listOfCategory1[i], "Category2": element["Category2"], "count":listOfCounts[i]})
                        }
                    }
                })
                //console.log(modifiedCountData)

                showMatrixData(modifiedCountData)
                return
            }

            // Else merge them
            let indexesToDelete = []
            let indexToAdd = -1
            modifiedCountData.forEach((element, index) => {
                if(element["Category1"] == d) {
                    element["Category1"] += "-" + nearestCategory

                    // Get the element with category1 = nearestCategory and category2 = category2 of element
                    let matchedCellIndex = -1
                    modifiedCountData.forEach((element2, index2) => {
                        if(element2["Category1"] == nearestCategory && element2["Category2"] == element["Category2"])
                            matchedCellIndex = index2
                    })
                    element["count"] += "-" + modifiedCountData[matchedCellIndex]["count"]
                }
                else if(element["Category1"] == nearestCategory) {
                    indexesToDelete.push(index)
                }
            })
            indexesToDelete.sort(function(a, b) { return b-a })
            indexesToDelete.forEach(index => {
                modifiedCountData.splice(index, 1)
            });
            //console.log(modifiedCountData)

            showMatrixData(modifiedCountData)
        })
    return dragObject
}

function initializeMatrixChart(data, modifiedCountData) {

    let {xScale, yScale, sizeScale, colorScale} = getMatrixScales(modifiedCountData)
    
    // Initialize some variables
    let container = d3.select(`#${globalsForMatrix.boundingPanel}`)

    if(d3.select(`#${globalsForMatrix.boundingPanel}MatrixChart`).empty()) {
        
        // Add a group tag for xaxis
        container.append("g")
            .attr("id", `${globalsForMatrix.boundingPanel}xAxis`)
            .style("font-size", 8)
            .attr("transform", `translate(${globalsForMatrix.marginsForMatrixCharts.left + globalsForMatrix.paddingForMatrixCharts.left}, ${globalsForMatrix.marginsForMatrixCharts.top})`)
            .style("cursor", "pointer")
        
        // Add a text tag for xaxis label
        let textLabel = container.append("text")
            .attr("id", `${globalsForMatrix.boundingPanel}xAxisLabel`)
            .attr("transform", `translate(${globalsForMatrix.marginsForMatrixCharts.left + boundingMatrix.MATRIX_CHART_WIDTH/2}, ${boundingMatrix.MATRIX_CHART_HEIGHT + globalsForMatrix.paddingForMatrixCharts.top + globalsForMatrix.marginsForMatrixCharts.top})`)
            .attr("text-anchor", "middle")
            .attr("font-weight", "700")
            .style("font-family", "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif")
            .style("font-size", 10)
            .text(globalsForMatrix.firstCategory)

        // Add a group tag for yaxis
        container.append("g")
            .attr("id", `${globalsForMatrix.boundingPanel}yAxis`)
            .style("font-size", 8)
            .attr("transform", `translate(${globalsForMatrix.marginsForMatrixCharts.left + boundingMatrix.MATRIX_CHART_WIDTH}, ${globalsForMatrix.marginsForMatrixCharts.top + globalsForMatrix.paddingForMatrixCharts.top - yScale.bandwidth()/2})`)
            .style("cursor", "pointer")
        
        // Add a text tag for yaxis label
        container.append("text")
            .attr("id", `${globalsForMatrix.boundingPanel}yAxisLabel`)
            .attr("text-anchor", "middle")
            .attr("font-weight", "700")
            .attr("transform", `translate(${globalsForMatrix.marginsForMatrixCharts.left - 20}, ${globalsForMatrix.marginsForMatrixCharts.top + boundingMatrix.MATRIX_CHART_HEIGHT/2}) rotate(-90)`)
            .style("font-family", "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif")
            .style("font-size", 10)
            .text(globalsForMatrix.secondCategory)

        // Add a Matrix Chart group tag        
        container.append("g")
            .attr("id", `${globalsForMatrix.boundingPanel}MatrixChart`)
            .attr("width", boundingMatrix.MATRIX_CHART_WIDTH)
            .attr("height", boundingMatrix.MATRIX_CHART_HEIGHT)
            .attr("transform", `translate(${globalsForMatrix.paddingForMatrixCharts.left + globalsForMatrix.marginsForMatrixCharts.left}, ${globalsForMatrix.paddingForMatrixCharts.top + globalsForMatrix.marginsForMatrixCharts.top})`)

        tip = d3.tip()
            .attr('id', `${globalsForMatrix.boundingPanel}_d3-tip`)
            .style("font-size", "4")
            .html(function(d) {
                return d;
            });
        
        // Invoke the tip in the context of your visualization
        d3.select(`#${globalsForMatrix.boundingPanel}MatrixChart`).call(tip)
    }
}

function getMatrixScales(modifiedCountData) {

    let xScale = d3.scaleBand()
        .domain(modifiedCountData.map(d => d["Category1"]))
        .range([0, boundingMatrix.MATRIX_CHART_WIDTH])
    xScale.type = scaleType.LINEAR

    let yScale = d3.scaleBand()
        .domain(modifiedCountData.map(d => d["Category2"]))
        .range([boundingMatrix.MATRIX_CHART_HEIGHT, 0])
    yScale.type = scaleType.LINEAR

    let sizeScale = d3.scaleLinear()
        .domain([0, d3.max(modifiedCountData.map(d => d3.sum(d["count"].split("-").map(k => +k))))])
        .range([2.5, d3.min([xScale.bandwidth(), yScale.bandwidth()])/2])
    sizeScale.type = scaleType.LINEAR

    let colorScale = d3.scaleOrdinal()
        .domain(domainX)
        .range(d3.schemeCategory10)
    colorScale.type = scaleType.ORDINAL
    
    return {xScale, yScale, sizeScale, colorScale}
}

function showMatrixData(modifiedCountData) {
    let {xScale, yScale, sizeScale, colorScale} = getMatrixScales(modifiedCountData)
    let inverseColor = invertScale(colorScale)

    // Update positions based on new scales

    // Update group tag for yaxis
    d3.select(`#${globalsForMatrix.boundingPanel}yAxis`).transition().attr("transform", `translate(${globalsForMatrix.marginsForMatrixCharts.left + boundingMatrix.MATRIX_CHART_WIDTH}, ${globalsForMatrix.marginsForMatrixCharts.top + globalsForMatrix.paddingForMatrixCharts.top - yScale.bandwidth()/2})`)

    ///////////////////////////////////////


    // Get drag object
    let matrixDragObject = getMatrixDragObject(modifiedCountData)

    // Create data binding
    let dataBinding = d3.select(`#${globalsForMatrix.boundingPanel}MatrixChart`).selectAll("g").data(modifiedCountData)

    // Create a group element for each combination of category1 and category2 in the dataset: each will contain a pie chart
    let groupForPie = dataBinding.enter()
        .append("g")
        .attr("transform", d => {
            return `translate(${xScale.bandwidth()/2 + xScale(d["Category1"])}, ${yScale(d["Category2"])})`
        })
        .attr("class", d => {
            return d["Category1"] + " " + d["Category2"] + " " + d["Category1"] + ":" + d["Category2"]
        })
        .attr("opacity", "1")
        
    // For each individual category in the datapoint create a piece of a pie
    groupForPie.each(function(r) {
        let pieChartBinding = d3.select(this).selectAll("path").data(d => {
            newData = []
            categoryData = []
            let categorySplit = d["Category1"].split("-")
            let countSplit = d["count"].split("-")
            let num = countSplit.length
            for(let i = 0; i < num; i++) {
                newData.push(+countSplit[i])
                categoryData.push(categorySplit[i])
            }
            let pie = d3.pie()(newData)
            return pie
        })

        pieChartBinding.enter().append("path")
            .attr("fill", (d,i) => {
                return colorScale(categoryData[i])
            })
            .attr("stroke", "black")
            .attr("d", d3.arc().innerRadius(0).outerRadius(sizeScale(d3.sum(r["count"].split("-").map(k => +k)))))
            .attr("opacity", "1")

        pieChartBinding.attr("fill", (d,i) => {
                return colorScale(categoryData[i])
            })
            .attr("d", d3.arc().innerRadius(0).outerRadius(sizeScale(d3.sum(r["count"].split("-").map(k => +k)))))

        d3.select(this).selectAll("path").on("mouseover", function(d, i) {
                        
            d3.select(this.parentNode).selectAll("path").transition().ease(d3.easeElastic).duration(700).attr("d", d3.arc().innerRadius(0).outerRadius(3*sizeScale(d3.sum(r["count"].split("-").map(k => +k)))))

            d3.select(`#${globalsForMatrix.boundingPanel}MatrixChart`).selectAll("path").attr("opacity", "0.3")
            d3.select(this).attr("opacity", "1")

            let fillColor = d3.select(this).attr("fill")
            let category1Derived = inverseColor(fillColor)
            let category2Derived = d3.select(this.parentNode).attr("class").split(":")[1].trim().replace(/_/g, " ")
            tip.attr('class', 'd3-tip animate').show(`
                <center>
                    ${category1Derived} <br>
                    <span style = "font-size: 7px">${category2Derived}</span> <br>
                    <span style = "font-size: 7px">Count: ${d.value}</span> <br>
                    <span style = "font-size: 7px">Percent: ${Math.round((d.endAngle - d.startAngle)*180*100/360/Math.PI)}%</span>
                </center>
            `)

        })
        .on("mouseleave", function(d) {
            d3.select(this.parentNode).selectAll("path").transition().attr("d", d3.arc().innerRadius(0).outerRadius(sizeScale(d3.sum(r["count"].split("-").map(k => +k)))))
            
            d3.select(`#${globalsForMatrix.boundingPanel}MatrixChart`).selectAll("path").attr("opacity", "1")

            tip.attr('class', 'd3-tip').show(d)
            tip.hide()

        })

        pieChartBinding.exit().remove()
    })

    let updatedGroupForPie = dataBinding
        .attr("transform", d => `translate(${xScale.bandwidth()/2 + xScale(d["Category1"])}, ${yScale(d["Category2"])})`)
        .transition()
        .attr("class", d => {
            return d["Category1"] + " " + d["Category2"] + " " + d["Category1"] + ":" + d["Category2"]
        })

    updatedGroupForPie.each(function(r) {
        let pieChartBinding = d3.select(this).selectAll("path").data(d => {
            newData = []
            categoryData = []
            let categorySplit = d["Category1"].split("-")
            let countSplit = d["count"].split("-")
            let num = countSplit.length
            for(let i = 0; i < num; i++) {
                newData.push(+countSplit[i])
                categoryData.push(categorySplit[i])
            }
            let pie = d3.pie()(newData)
            return pie
        })

        pieChartBinding.enter().append("path")
            .attr("fill", (d,i) => {
                return colorScale(categoryData[i])
            })
            .attr("stroke", "black")
            .attr("d", d3.arc().innerRadius(0).outerRadius(sizeScale(d3.sum(r["count"].split("-").map(k => +k)))))

        pieChartBinding.attr("fill", (d,i) => {
                return colorScale(categoryData[i])
            })
            .attr("d", d3.arc().innerRadius(0).outerRadius(sizeScale(d3.sum(r["count"].split("-").map(k => +k)))))
        
        d3.select(this).selectAll("path").on("mouseover", function(d, i) {
            d3.select(this.parentNode).selectAll("path").transition().ease(d3.easeElastic).duration(700).attr("d", d3.arc().innerRadius(0).outerRadius(3*sizeScale(d3.sum(r["count"].split("-").map(k => +k)))))
           
        d3.select(`#${globalsForMatrix.boundingPanel}MatrixChart`).selectAll("path").attr("opacity", "0.3")
            d3.select(this).attr("opacity", "1")

            let fillColor = d3.select(this).attr("fill")
            let category1Derived = inverseColor(fillColor)
            let category2Derived = d3.select(this.parentNode).attr("class").split(":")[1].trim().replace(/_/g, " ")
            tip.attr('class', 'd3-tip animate').show(`
                <center>
                    ${category1Derived} <br>
                    <span style = "font-size: 7px">${category2Derived}</span> <br>
                    <span style = "font-size: 7px">Count: ${d.value}</span> <br>
                    <span style = "font-size: 7px">Percent: ${Math.round((d.endAngle - d.startAngle)*180*100/360/Math.PI)}%</span>
                </center>
            `)

        }).on("mouseleave", function(d) {
            d3.select(this.parentNode).selectAll("path").transition().attr("d", d3.arc().innerRadius(0).outerRadius(sizeScale(d3.sum(r["count"].split("-").map(k => +k)))))

            d3.select(`#${globalsForMatrix.boundingPanel}MatrixChart`).selectAll("path").attr("opacity", "1")

            tip.attr('class', 'd3-tip').show(d)
            tip.hide()

        })

        pieChartBinding.exit().remove()
    })

    d3.select(`#${globalsForMatrix.boundingPanel}MatrixChart`).selectAll("g")
        .on("mouseover", function() {
            this.parentNode.appendChild(this)
        })
        
    
    dataBinding.exit().remove()

    let xAxis = d3.axisTop(xScale).tickSize(0)
        .tickFormat(function(e) {  
            let maxLength = 15
            e = e.replace("_or_", "\/").replace("_", " ")
            if(e.length > maxLength){
                return e.substring(0, maxLength) + "..."
            }
            return e
        })
    d3.select(`#${globalsForMatrix.boundingPanel}xAxis`).transition().call(xAxis)
        .call(
            g => {
                g.select(".domain").remove()
                g.selectAll("g").selectAll("text").attr("transform", "rotate(-90)")
                    .style("text-anchor", "start")
                    .style("alignment-baseline", "hanging")
            }
        )

    let yAxis = d3.axisRight(yScale).tickSize(0)
    d3.select(`#${globalsForMatrix.boundingPanel}yAxis`).transition().call(yAxis)
        .call(
            g => g.select(".domain").remove()
        )

    /*d3.select(`#${globalsForMatrix.boundingPanel}yAxis`).selectAll(".tick")
        .on("mouseover", function() {
            let textValue = d3.select(this).select("text").text()
            if(!d3.select(this).selectAll("rect").empty())
                d3.select(this).selectAll("rect").remove()
            let hoverRect = d3.select(this).append("rect")
                .attr("fill", "rgb(32,142,183)")
                .style("opacity", 0.3)
                .attr("height", yScale.bandwidth())
                .attr("transform", `translate(${-boundingMatrix.MATRIX_CHART_WIDTH + globalsForMatrix.paddingForMatrixCharts.left}, ${-yScale.bandwidth()/2})`)
                .attr("width", boundingMatrix.MATRIX_CHART_WIDTH - globalsForMatrix.paddingForMatrixCharts.left)
                .attr("rx", 5).attr("ry", 5)
            
            hoverRect.on("mouseleave", function() {
                d3.select(this).remove()
            })
        })
        .on("mouseleave", function() {
            if(!d3.select(this).selectAll("rect").empty()){
                d3.select(this).selectAll("rect").remove()
            }
        })*/

    d3.select(`#${globalsForMatrix.boundingPanel}xAxis`).selectAll(".tick").selectAll("rect").remove()

    d3.select(`#${globalsForMatrix.boundingPanel}xAxis`).selectAll(".tick")
        .append("rect")
        .attr("fill", "rgb(32,142,183)")
        .style("opacity", 0)
        .attr("width", xScale.bandwidth())
        .attr("transform", `translate(${-xScale.bandwidth()/2}, ${0})`)
        .attr("height", boundingMatrix.MATRIX_CHART_HEIGHT)
        .attr("rx", 5).attr("ry", 5)
        .on("mouseover", function() {
            d3.select(this).style("opacity", 0.3)
        })
        .on("mouseleave", function() {
            d3.select(this).style("opacity", 0)
        })
        
/*        .on("mouseover", function() {
            let textValue = d3.select(this).select("text").text()
            if(!d3.select(this).selectAll("rect").empty())
                d3.select(this).selectAll("rect").remove()
            let hoverRect = d3.select(this).append("rect")
                .attr("fill", "rgb(32,142,183)")
                .style("opacity", 0.3)
                .attr("width", xScale.bandwidth())
                .attr("transform", `translate(${-xScale.bandwidth()/2}, ${0})`)
                .attr("height", boundingMatrix.MATRIX_CHART_HEIGHT)
                .attr("rx", 5).attr("ry", 5)
                
            hoverRect.on("mouseleave", function() {
                d3.select(this).remove()
            })
        })
        .on("mouseleave", function() {
            if(!d3.select(this).selectAll("rect").empty()){
                d3.select(this).selectAll("rect").remove()
            }
        })*/

    d3.select(`#${globalsForMatrix.boundingPanel}xAxis`).selectAll(".tick").call(matrixDragObject)
}