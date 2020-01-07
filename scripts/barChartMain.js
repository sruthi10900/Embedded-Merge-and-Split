// The categories should contain only A-Z, a-z, -, _, :, .
let boundingDivName = "bottom_graph_panel_barChart_container"
let boundingDiv = d3.select(`#${boundingDivName}`).style("background-color", "white")

let innerSVGName = "_innerSVG_"

let widthOfOneBarChartSVG = "300px"
let heightOfOneBarChartSVG = "205px"

let counter = 1
let finalCount = 1

let barChart = "barChart"

function convertToID(value) {
    return value.replace(/ /g, '_')
        .replace(/\//g, '_or_')
        .replace(/\'/g, '')
        .replace(/\./g,"_")
        .replace(/,/g,"_")
        .replace(/&/g,"-")
        .replace(/'/g,"")
        .replace(/\(/g,"")
        .replace(/\)/g,"")
        .replace(/\]/g,"")
        .replace(/\[/g,"")
        .replace(/\{/g,"")
        .replace(/\}/g,"")
        .replace(/%/g,"")
        .replace(/\$/g,"")
}

function myLoop(data, allColumns) {
    //console.log(allColumns)
    let idOfSVG = boundingDivName + innerSVGName + convertToID(allColumns[counter-1])
    
    try {

        // Create a bar chart of not already present
        if(d3.select(`#${idOfSVG}`).empty()) {
            boundingDiv.append("svg")
                .attr("id", idOfSVG)
                .attr("width", widthOfOneBarChartSVG)
                .attr("height", heightOfOneBarChartSVG)
                .style("position", "absolute")
                .style("left", (counter-1)*parseInt(widthOfOneBarChartSVG) + "px")
        }
                
        setTimeout(function() {
            let categoryName = allColumns[counter-1]

            var countData = d3.nest()
                .key(d => convertToID(d[categoryName]))
                .rollup(function(v) { return v.length.toString() })
                .entries(data)
                .map(function(group) {
                    let returnValue = {}
                    returnValue[categoryName] = group.key
                    returnValue["count"] = group.value
                    return returnValue
                })
            
            try {
                this[barChart+counter] = new BarChart(idOfSVG, countData, categoryName, "count")
                this[barChart+counter].mergeBarChart()
            }
            catch (err) {
                console.error(err)
            }
            
            counter += 1
            if (counter <= finalCount) {
                myLoop(data, allColumns)
            }

        }, 300);
    }
    catch (error) {
        console.log(error)
    }
}

function createAllBarChartsMain(data, allColumns) {

    // Remove old SVGs
    let allSVGS = boundingDiv.selectAll("svg")
    let removed = 0
    allSVGS.each(function(d) {
        let idOfSVG = d3.select(this).attr("id")
        let columnNameFromID = idOfSVG.replace(boundingDivName, "").replace(innerSVGName, "")

        if(!allColumns.map(d => convertToID(d)).includes(columnNameFromID)){
            d3.select(`#${idOfSVG}`).transition().remove()
            removed = 1
        }

        //And move all SVG after that to the right
        else if(removed == 1) {
            let currentPos = parseInt(d3.select(`#${idOfSVG}`).style("left"), 10)
            d3.select(`#${idOfSVG}`).transition().style("left", currentPos - parseInt(widthOfOneBarChartSVG) + "px")
        }
    });

    //console.log(allColumns)
    finalCount = allColumns.length
    counter = 1
    boundingDiv.style("width", `${finalCount*parseInt(widthOfOneBarChartSVG) + 50}px`)

    myLoop(data, allColumns)
}