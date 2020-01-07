
startTheProject()

function startTheProject() {

    let mainSVG = d3.select("body")
        .append("svg")
        .attr('width', "100%")
        .attr("height", "100%")

    mainSVG.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "white")
    
    let rect = mainSVG.append("rect")
        .attr("fill", "white")
        .attr("id", "boundingRectMain")
        .attr("stroke", "white")
        .attr("width", "100px")
        .attr("height", "40px")
        .attr("transform", `translate(${window.innerWidth/2 - 50}, ${window.innerHeight/2 - 22})`)
        .style("cursor", "pointer")
        .style("opacity", 1)
    
    let boundingRect = document.getElementById("boundingRectMain").getBoundingClientRect()
    let topRect = mainSVG.append("rect")
        .attr("fill", "#232323")
        .attr("width", 0)
        .attr("height", 2)
        .style("opacity", 1)
        .attr("transform", `translate(${boundingRect.x}, ${boundingRect.y})`)

    let rightRect = mainSVG.append("rect")
        .attr("fill", "#232323")
        .attr("width", 2)
        .attr("height", 0)
        .style("opacity", 1)
        .attr("transform", `translate(${boundingRect.x + boundingRect.width}, ${boundingRect.y})`)
    
    let bottomRect = mainSVG.append("rect")
        .attr("fill", "#232323")
        .attr("width", 0)
        .attr("height", 2)
        .style("opacity", 1)
        .attr("transform", `translate(${boundingRect.x + boundingRect.width}, ${boundingRect.y + boundingRect.height})`)

    let leftRect = mainSVG.append("rect")
        .attr("fill", "#232323")
        .attr("width", 2)
        .attr("height", 0)
        .style("opacity", 1)
        .attr("transform", `translate(${boundingRect.x}, ${boundingRect.y + boundingRect.height})`)

    mainSVG.append("text")
        .text("Start")
        .attr("fill", "#232323")
        .attr("transform", `translate(${window.innerWidth/2}, ${window.innerHeight/2})`)
        .style("font-family", "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif")
        .attr("text-anchor", "middle")
        .style("font-size", "20")
        .attr("alignment-baseline", "middle")
        .style("cursor", "pointer")
        .style("opacity", 1)
        .on("mouseover", function() {
            topRect.transition().attr("width", boundingRect.width)
            rightRect.transition().attr("height", boundingRect.height + 2)
            bottomRect.transition().attr("width", boundingRect.width).attr("transform", `translate(${boundingRect.x}, ${boundingRect.y + boundingRect.height})`)
            leftRect.transition().attr("height", boundingRect.height).attr("transform", `translate(${boundingRect.x}, ${boundingRect.y})`)
        })
        .on("mouseleave", function() {
            topRect.transition().attr("width", 0)
            rightRect.transition().attr("height", 0)
            bottomRect.transition().attr("width", 0).attr("transform", `translate(${boundingRect.x + boundingRect.width}, ${boundingRect.y + boundingRect.height})`)
            leftRect.transition().attr("height", 0).attr("transform", `translate(${boundingRect.x}, ${boundingRect.y + boundingRect.height})`)
        })
        .on("click", function() {

            mainSVG.select("text").transition().style("opacity", 0)
            topRect.transition().style("opacity", 0)
            bottomRect.transition().style("opacity", 0)
            leftRect.transition().style("opacity", 0)
            rightRect.transition().style("opacity", 0)

            setTimeout(function() {   
                datasetSelector()
            }, 1000)

            setTimeout(function() {   
                mainSVG.remove()
            }, 2000)         
        })

    rect.on("mouseover", function() {
        topRect.transition().attr("width", boundingRect.width)
        rightRect.transition().attr("height", boundingRect.height + 2)
        bottomRect.transition().attr("width", boundingRect.width).attr("transform", `translate(${boundingRect.x}, ${boundingRect.y + boundingRect.height})`)
        leftRect.transition().attr("height", boundingRect.height).attr("transform", `translate(${boundingRect.x}, ${boundingRect.y})`)
    })
    .on("mouseleave", function() {
        topRect.transition().attr("width", 0)
        rightRect.transition().attr("height", 0)
        bottomRect.transition().attr("width", 0).attr("transform", `translate(${boundingRect.x + boundingRect.width}, ${boundingRect.y + boundingRect.height})`)
        leftRect.transition().attr("height", 0).attr("transform", `translate(${boundingRect.x}, ${boundingRect.y + boundingRect.height})`)
    })
    .on("click", function() {

        mainSVG.select("text").transition().style("opacity", 0)
        topRect.transition().style("opacity", 0)
        bottomRect.transition().style("opacity", 0)
        leftRect.transition().style("opacity", 0)
        rightRect.transition().style("opacity", 0)

        setTimeout(function() {   
            datasetSelector()
        }, 1000)

        setTimeout(function() {   
            mainSVG.remove()
        }, 2000)         
    })
}

// Function: Function that selects a dataset to load (Only created once)
function datasetSelector() {

    let svg = null
    if(d3.select("#loadingBar").empty()) {
        svg = d3.select("body").append("svg")
            .attr("id", "loadingBar")
            .attr("width", window.innerWidth)
            .attr("height", window.innerHeight)
            .attr("opacity", 0)

        svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "#232323")

        let text1 = svg.append("text")
            .text("Please select one of the following datasets:")
            .attr("fill", "white")
            .attr("opacity", 1)
            .attr("transform", `translate(${window.innerWidth/2}, ${window.innerHeight/2 - 40})`)
            .style("font-family", "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif")
            .style("text-anchor", "middle")
            .style("alignment-baseline", "middle")

        svg.append("text")
            .text("AirBNB Dataset")
            .attr("id", "dataset1")
            .attr("fill", "white")
            .attr("opacity", 1)
            .style("font-family", "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif")
            .attr("transform", `translate(${window.innerWidth/2}, ${window.innerHeight/2})`)
            .style("text-anchor", "middle")
            .style("alignment-baseline", "middle")
            .style("cursor", "pointer")

        let text1Bounding = document.getElementById("dataset1").getBoundingClientRect()
        let rect1 = svg.append("rect")
            .attr("class", "underlineRect")
            .attr("fill", "white")
            .attr("transform", `translate(${text1Bounding.x}, ${text1Bounding.y + text1Bounding.height})`)
            .attr("height", 2)
            .attr("width", 0)
            .attr("opacity", 1)

        svg.select("#dataset1")
            .on("mouseover", function() {
                rect1.transition().attr("width", text1Bounding.width)
            })
            .on("mouseleave", function() {
                rect1.transition().attr("width", 0)
            })
    
        svg.append("text")
            .text("US Border Crossing Dataset")
            .attr("id", "dataset2")
            .attr("fill", "white")
            .style("font-family", "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif")
            .attr("transform", `translate(${window.innerWidth/2}, ${window.innerHeight/2 + 40})`)
            .style("text-anchor", "middle")
            .style("alignment-baseline", "middle")
            .style("cursor", "pointer")

        let text2Bounding = document.getElementById("dataset2").getBoundingClientRect()
        let rect2 = svg.append("rect")
            .attr("class", "underlineRect")
            .attr("fill", "white")
            .attr("transform", `translate(${text2Bounding.x}, ${text2Bounding.y + text2Bounding.height})`)
            .attr("height", 2)
            .attr("width", 0)
            .attr("opacity", 1)

        svg.select("#dataset2")
            .on("mouseover", function() {
                rect2.transition().attr("width", text2Bounding.width)
            })
            .on("mouseleave", function() {
                rect2.transition().attr("width", 0)
            })
    }
    else {
        svg = d3.select("#loadingBar")
        svg.selectAll("text").transition().attr("opacity", 1)
        svg.selectAll(".underlineRect").transition().attr("opacity", 1)
    }

    svg.transition().attr("opacity", 1).attr("display", "block")

    svg.select("#dataset1").attr("opacity", 1)
        .on("click", function() {
            svg.selectAll("text").transition().attr("opacity", 0)
            svg.selectAll(".underlineRect").transition().attr("opacity", 0)

            setTimeout(function() {
                screenLoader("AB_NYC_2019.csv")
            }, 1000)
        })

    svg.select("#dataset2").attr("opacity", 1)
        .on("click", function() {
            svg.selectAll("text").transition().attr("opacity", 0)
            svg.selectAll(".underlineRect").transition().attr("opacity", 0)
            
            setTimeout(function() {
                screenLoader("Border_Crossing_Entry_Data.csv")
            }, 1000)
        })

}

// Function: Loading screen before a specific dataset is loaded (Created once when the screen is loading and then deletes it)
function screenLoader(dataset) {
    let progress = 0
    let total = 7077973 // must be hard-coded if server doesn't report Content-Length
    if(dataset == "Border_Crossing_Entry_Data.csv")
        total = 37054236
    else
        total = 7077973

    formatPercent = d3.format(".0%");

    var arc = d3.arc()
        .startAngle(0)
        .innerRadius(235)
        .outerRadius(240);

    let svg = d3.select("#loadingBar")

    let g = svg.append("g")
        .attr("transform", "translate(" + window.innerWidth / 2 + "," + window.innerHeight / 2 + ")");

    var meter = g.append("g")
        .attr("class", "progress-meter");

    meter.append("path")
        .attr("class", "background")
        .attr("d", arc.endAngle(2*Math.PI));

    var foreground = meter.append("path")
        .attr("class", "foreground");

    var text = meter.append("text")
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("dy", ".35em");

    console.time("totalTime:");
    d3.csv(`./data/${dataset}`)
        .on("progress", function(evt) {
            var i = d3.interpolate(progress, evt.loaded / total);
            d3.transition().tween("progress", function() {
                return function(t) {
                progress = i(t);
                foreground.attr("d", arc.endAngle(2*Math.PI * progress));
                text.text(formatPercent(progress));
                };
            });

            console.log("Amount loaded: " + evt.loaded)
        })
        .get(function(data) {
            console.timeEnd("totalTime:");
            mainFunctionToAddColumns(data, dataset)

            setTimeout(function() {
                d3.select("#loadingBar").transition().attr("opacity", 0).attr("display", "none")
                svg.select("g").remove()
            }, 1000)
        })
}

// Function: Adds a dataset toggler on the screen (Only created once)
function addDatasetToggle() {

    let svg = null

    if(d3.select("#dataToggler").empty()) {

        svg = d3.select("body").append("svg")
            .attr("id", "dataToggler")
            .attr("width", "100px")
            .attr("height", "20px")
            .style("position", "absolute")
            .style("top", "0")
            .style("left", "45%")
            .style("opacity", 1)
            .style("cursor", "pointer")
        
        svg.append("rect")
            .attr("width", "100%")
            .attr("height", "calc(100% + 5px)")
            .attr("fill", "#232323")
            .attr("rx", "5px")
            .attr("transform", "translate(0, -5)")

        svg.append("text")
            .text("DATASET")
            .attr("fill", "white")
            .attr("transform", "translate(50, 10)")
            .style("text-anchor", "middle")
            .style("alignment-baseline", "middle")
            .style("font-family", "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif")
            .style("font-size", "12")
            .style("opacity", 0)
    }
    else {
        svg = d3.select("#dataToggler")
    }
    
    let text = svg.select("text")

    setTimeout(function() {
        text.transition().style("opacity", 1)
    }, 3000)

    d3.select("#dataToggler")
        .on("mouseover", function() {
            svg.transition().attr("height", "50px")
            svg.select("text").transition().attr("transform", "translate(50, 25)")

        })
        .on("mouseleave", function() {
            svg.transition().attr("height", "20px")
            svg.select("text").transition().attr("transform", "translate(50, 10)")
        })
        .on("click", function() {
            datasetSelector()
            text.transition().style("opacity", 0)
        })

}

let columnsToConsiderForBarChart = []
let columnsToConsiderForHistogram = []
let categoricalFilteredData = {} // Key will be the column name, value will be the list of values not allowed
let numericalFilteredData = {} // Key will be the column name, value will be the list of min and max values allowed

// Function: Create the small bar chart icon (No need to add functionality for only once creation)
function getBarChartIconPath() {
    let widthOfAxis = 2
    let widthOfTotal = 18
    let heightOfTotal = 13
    let heightOfBar1 = 3
    let heightOfBar2 = 7
    let heightOfBar3 = 5
    let heightOfBar4 = 9
    let barGap = 1
    let widthOfBar = 3

    let icon = `
            M -1 0 
            h ${widthOfAxis+1} 
            v ${heightOfTotal - widthOfAxis} 
            h ${widthOfTotal - widthOfAxis} 
            v ${widthOfAxis}
            h ${-widthOfTotal-1}
            Z
            
            M ${widthOfAxis + barGap + 0*widthOfBar} ${heightOfTotal - widthOfAxis - barGap - heightOfBar1}
            h ${widthOfBar}
            v ${heightOfBar1}
            h ${-widthOfBar}
            Z

            M ${widthOfAxis + 2*barGap + 1*widthOfBar} ${heightOfTotal - widthOfAxis - barGap - heightOfBar2}
            h ${widthOfBar}
            v ${heightOfBar2}
            h ${-widthOfBar}
            Z

            M ${widthOfAxis + 3*barGap + 2*widthOfBar} ${heightOfTotal - widthOfAxis - barGap - heightOfBar3}
            h ${widthOfBar}
            v ${heightOfBar3}
            h ${-widthOfBar}
            Z

            M ${widthOfAxis + 4*barGap + 3*widthOfBar} ${heightOfTotal - widthOfAxis - barGap - heightOfBar4}
            h ${widthOfBar}
            v ${heightOfBar4}
            h ${-widthOfBar}
            Z`

    return icon
}

// Function: Create the small filter icon (No need to add functionality for only once creation)
function getFilterIconPath() {
    let heightOfFunnel = 6
    let heightOfTube1 = 5
    let heightOfTube2 = 7
    let lowerWidthOfFunnel = 3
    let widthOfTotal = 15

    let icon = `
            M 0 0 
            h ${widthOfTotal} 
            L ${widthOfTotal - (widthOfTotal -  lowerWidthOfFunnel)/2} ${heightOfFunnel}
            v ${heightOfTube2}
            L ${widthOfTotal - lowerWidthOfFunnel - (widthOfTotal -  lowerWidthOfFunnel)/2} ${heightOfFunnel + heightOfTube1}
            v ${-heightOfTube1}
            Z
            `

    return icon
}

// Function: Get confidence fill color (No need to add functionality for only once creation)
function getConfidenceColors(data, columnName) {

    // Get the confidence value
    let nullValues = 0
    let allValues = 0
    data.map(col => {
        let columnValue = col[columnName].toString().replace(/ /g,"")
        if(columnValue in ["", null, undefined])
            nullValues += 1
        allValues += 1
    })
    let confidenceLevel = 100*(allValues - nullValues)/allValues

    // Create a fill confidence scale
    let fillConfidenceScale = d3.scaleThreshold()
        .domain([20,40,60,80,100])
        .range(["#fff", "#ccc", "#888", "#555", "#000"])

    // Create a stroke confidence scale
    let strokeConfidenceScale = d3.scaleThreshold()
        .domain([20,40,60,80,100])
        .range(["#ccc", "#888", "#555", "#000", "#000"])
    return [fillConfidenceScale(confidenceLevel), strokeConfidenceScale(confidenceLevel)]
}

// Function: Update filtered data dictionary (No need to add functionality for only once creation)
function updateCategoricalFilteredData(d, value) {
    if(d in categoricalFilteredData) {
        if(categoricalFilteredData[d].includes(value)) {
            let index = categoricalFilteredData[d].indexOf(value)
            categoricalFilteredData[d].splice(index, 1)
        }
        else {
            categoricalFilteredData[d].push(value)
        }
    }
    else {
        categoricalFilteredData[d] = [value]
    }
}

// Function: Update filtered data dictionary (No need to add functionality for only once creation)
function updateNumericalFilteredData(d, minOrMax, value) {
    if(minOrMax == "min")
        numericalFilteredData[d][0] = value
    else
        numericalFilteredData[d][1] = value
}

// Function: Get data after filter
function getDataAfterFilter(data) {

    for(column in categoricalFilteredData) {
        data = data.filter(function(d) { return !categoricalFilteredData[column].includes(d[column]) })
    }

    for(column in numericalFilteredData) {
        data = data.filter(function(d) { return +d[column] >= numericalFilteredData[column][0] && +d[column] <= numericalFilteredData[column][1]})
    }
    console.log(data)
    return data
}

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

// Function: Adds columns and functionalities to the filter panel
function addColumns(data, datasetName, matchString) {
    let getCheckedValue = d3.select("#showAllDataInput").property("checked")
    if(getCheckedValue == true) {
        matchString = ''
    }

    let columns = data.columns
    let categoricalIncre = 1
    let numericIncre = 1
    let gap = 30
    let maxTextLengthBasedOnDrag = 30
    columns.forEach(function(d) {
        console.log(d, matchString)

        if(d.includes(matchString)) {

            let columnType = isNaN(data[0][d]) ? "categorical" : "numeric"
            if(columnType == "categorical") {

                // Element already exists then delete it and recreate it to preserve order
                if(!d3.select(`#${convertToID(d)}_column`).empty()) {
                    d3.select(`#${convertToID(d)}_column`).remove()
                }

                let columnGTag = d3.select("#CategoricalColumnsSVG")
                    .attr("height", gap*(categoricalIncre+1) - gap/2)
                    .append("g")
                    .attr("id", `${convertToID(d)}_column`)
                    .attr("transform", `translate(0,${gap*(categoricalIncre) - gap/2})`)
                
                // Filter Rect
                columnGTag.append("rect")
                    .transition()
                    .attr("fill", "rgba(32,142,183)")
                    .attr("width", "100%")
                    .attr("y", 0)
                    .attr("height", 2*gap)

                // Add menu for the filter
                let dropdown = columnGTag.append("g")
                    .style("cursor", "pointer")
                    .attr("transform", `translate(${0}, ${gap + gap/2})`)

                dropdown.append("rect")
                    .attr("x", `10%`)
                    .attr("width", "80%")
                    .attr("height", gap)
                    .attr("fill", "white")
                
                dropdown.append("text")
                    .text("All values")
                    .style("text-anchor", "middle")
                    .style("alignment-baseline", "middle")
                    .attr("x", `${parseFloat(dropdown.select("rect").attr("x")) + parseFloat(dropdown.select("rect").attr("width"))/2}%`)
                    .attr("y", `${parseFloat(dropdown.select("rect").attr("height"))/2}`)
                    .attr("fill", "black")

                dropdown.on("click", function() {
                    dropdown.select("rect").transition().attr("fill", "#ddd")

                    // Get all unique values of this column
                    let uniqueValues = new Set(data.map(row => row[d]))
                    let dropDownSVG = d3.select("#outer_filter_panel_svg")
                    let dropDownG = dropDownSVG.append("g")
                                                
                    dropDownG.append("rect")
                        .transition()
                        .attr("width", "100%")
                        .attr("height", "100%")
                        .attr("fill", "darkslategray")

                    // Add a close button
                    let closeG = dropDownG.append("g")
                        .attr("cursor", "pointer")
                        .on("click", function() {
                            dropDownSVG.style("left", "-100%")
                            dropDownG.transition().remove()
                        })
                    
                    closeG.append("rect")
                        .attr("x", "calc(100% - 20px)")
                        .attr("y", "10px")
                        .attr("fill", "white")
                        .attr("width", "15px")
                        .attr("height", "15px")

                    dropDownG.select("g")
                        .append("line")
                        .attr("stroke", "black")
                        .attr("x1", "calc(100% - 15px)")
                        .attr("y1", 15)
                        .attr("x2", "calc(100% - 10px)")
                        .attr("y2", 20)

                    dropDownG.select("g")
                        .append("line")
                        .attr("stroke", "black")
                        .attr("x1", "calc(100% - 15px)")
                        .attr("y1", 20)
                        .attr("x2", "calc(100% - 10px)")
                        .attr("y2", 15)

                    let count = 1
                    let heightRect = 25
                    uniqueValues.forEach(value => {

                        // column name is d, column value is value
                        let g = dropDownG.append("g")

                        g.append("rect")
                            .attr("fill", function() {
                                if(d in categoricalFilteredData) {
                                    if(categoricalFilteredData[d].includes(value))
                                        return "darkslategray"
                                }
                                return "white"
                            })
                            .attr("width", "70%")
                            .attr("height", heightRect)
                            .attr("x", "15%")
                            .attr("y", `${heightRect*count + heightRect*(count - 1)}px`)
                            .attr("stroke", "darkslategray")
                            .attr("cursor", "pointer")
                        
                        g.on("click", function() {
                                
                                // update filtered data
                                updateCategoricalFilteredData(d, value)

                                // change the fill color based on new filtered data
                                g.select("rect").attr("fill", function() {
                                    if(d in categoricalFilteredData) {
                                        if(categoricalFilteredData[d].includes(value)) {
                                            return "darkslategray"
                                        }
                                    }
                                    return "white"
                                })

                                g.select("text").attr("fill", function() {
                                    if(d in categoricalFilteredData) {
                                        if(categoricalFilteredData[d].includes(value)) {
                                            return "white"
                                        }
                                    }
                                    return "darkslategray"
                                })

                                // Create a new data based on categoricalFilteredData
                                dataAfterFilter = getDataAfterFilter(data)

                                // Call the show data again to change data in all visualizations
                                createAllVisualizations(dataAfterFilter, datasetName)
                            })

                        g.append("text")
                            .text(value)
                            .attr("fill", function() {
                                if(d in categoricalFilteredData) {
                                    if(categoricalFilteredData[d].includes(value))
                                        return "white"
                                }
                                return "darkslategray"
                            })
                            .style("font-family", "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif")
                            .style("font-size", 10)
                            .attr("x", "50%")
                            .attr("y", `${heightRect*count + heightRect*(count - 1) + heightRect/2}px`)
                            .attr("text-anchor", "middle")
                            .attr("alignment-baseline", "middle")
                            .attr("cursor", "pointer")

                        count += 1
                    });

                    dropDownSVG.style("left", 0).attr("height", d3.max([2*heightRect*count + heightRect, window.innerHeight]))

                    
                    


                }).on("mouseleave", function() {
                    d3.select(this).select("rect").transition().attr("fill", "#fff")
                })
                

                // Background rect
                columnGTag.append("rect")
                    .transition()
                    .attr("fill", "white")
                    .attr("y", 0)
                    .attr("width", "100%")
                    .attr("height", gap)
                    .attr("filter", `url(#${d}_shadow)`)

                // Shadow
                let shadow = columnGTag.append("defs")
                    .append("filter")
                    .attr("id", `${d}_shadow`)
                    .attr("x", "0")
                    .attr("y", "0")
                    .attr("width", "100%")
                    .attr("height", "200%")
                
                shadow.append("feOffset")
                    .attr("result", "offOut")
                    .attr("in", "SourceAlpha")
                    .attr("dx", "0")
                    .attr("dy", "1")
                
                shadow.append("feGaussianBlur")
                    .attr("result", "blurOut")
                    .attr("in", "offOut")
                    .attr("stdDeviation", "5")
                
                shadow.append("feBlend")
                    .attr("in", "SourceGraphic")
                    .attr("in2", "blurOut")
                    .attr("mode", "normal")

                // Add confidence circle
                columnGTag.append("circle")
                        .transition()
                        .attr("fill", getConfidenceColors(data, d)[0])
                        .attr("stroke", getConfidenceColors(data, d)[1])
                        .attr("r", 5)
                        .attr("cx", "10px")
                        .attr("cy", gap/2)

                // Add the actual column name
                columnGTag.append("text")
                    .transition()
                    .text(function() {
                        if(d.length > maxTextLengthBasedOnDrag)
                            return d.substring(0, maxTextLengthBasedOnDrag) + "..."
                        else return d
                    })
                    .attr("fill", "black")
                    .attr("x", "20px")
                    .attr("y", gap/2 + 5)
                
                // Add the boundary between each column
                columnGTag.append("line")
                    .transition()
                    .attr("stroke", "#666")
                    .attr("x1", "0%")
                    .attr("y1", gap)
                    .attr("x2", "100%")
                    .attr("y2", gap)

                // Add enable/disable icon
                columnGTag.append("svg")
                    .attr("x", `88%`)
                    .attr("y", `${gap/3}`)
                    .append("path")
                    .attr("fill", function() {
                        if(columnsToConsiderForBarChart.includes(d))
                            return "black"
                        else return "white"
                    })
                    .attr("stroke", "black")
                    .attr("transform", "translate(3, 1)")
                    .style("cursor", "pointer")
                    .attr("stroke-width", 0.4)
                    .attr("d", getBarChartIconPath)
                    .on("mouseover", function() {
                        if(columnsToConsiderForBarChart.includes(d))
                            d3.select(this).transition().duration(50).attr("fill", "white")
                        else d3.select(this).transition().duration(50).attr("fill", "black")
                    })
                    .on("mouseleave", function() {
                        if(columnsToConsiderForBarChart.includes(d))
                            d3.select(this).transition().duration(50).attr("fill", "black")
                        else d3.select(this).transition().duration(50).attr("fill", "white")
                    })
                    .on("click", function() {
                        if(columnsToConsiderForBarChart.includes(d)) {
                            d3.select(this).transition().duration(50).attr("fill", "white")
                            let index = columnsToConsiderForBarChart.indexOf(d)
                            columnsToConsiderForBarChart.splice(index, 1)
                        }
                        else {
                            d3.select(this).transition().duration(50).attr("fill", "black")
                            columnsToConsiderForBarChart.push(d)
                        }
                        createAllBarChartsMain(data, columnsToConsiderForBarChart)
                    })
                
                // Add a filter icon
                columnGTag.append("svg")
                    .attr("x", `78%`)
                    .attr("y", `${gap/3}`)
                    .append("path")
                    .attr("fill", "white")
                    .attr("stroke", "black")
                    .attr("transform", "translate(3, 1)")
                    .style("cursor", "pointer")
                    .attr("stroke-width", 0.4)
                    .attr("d", getFilterIconPath)
                    .on("mouseover", function() {
                        d3.select(this).transition().duration(50).attr("fill", "black")
                    })
                    .on("mouseleave", function() {
                        d3.select(this).transition().duration(50).attr("fill", "white")
                    })
                    .on("click", function() {
                        let filterRect = columnGTag.select("rect")
                        let bgRect = columnGTag.select(`#${convertToID(d)}_column > rect:nth-child(3)`)
                        let bgRectY = bgRect.attr("y")
                        let filterRectY = filterRect.attr("y")
                        let bgRectHeight = bgRect.attr("height")
                        let filterRectHeight = parseInt(filterRect.attr("height"))
                        
                        
                        if(filterRectY != bgRectY) {
                            filterRect.transition().attr("y", bgRectY)

                            // Move all the g below this up
                            let columnFound = 0
                            d3.select("#CategoricalColumnsSVG").selectAll("#CategoricalColumnsSVG > g").each(function(ele) {
                                let currEle = d3.select(this)
                                let currEleID = currEle.attr("id")
                                let currY = parseInt(currEle.attr("transform").replace("translate(", "").replace(")", "").split(",")[1])
                                if(currEleID.replace("_column", "") == convertToID(d))
                                    columnFound = 1
                                else if(columnFound == 1) {
                                    currEle.transition().attr("transform", `translate(0, ${currY - filterRectHeight})`)
                                }
                            })

                            // Decrease the height of CategoricalColumnsSVG
                            let currHeight = parseInt(d3.select("#CategoricalColumnsSVG").attr("height"))
                            d3.select("#CategoricalColumnsSVG").transition().attr("height", currHeight - filterRectHeight)

                        }
                        
                        else {
                            filterRect.transition().attr("y", bgRectHeight)

                            // Move all the g below this down
                            let columnFound = 0
                            d3.select("#CategoricalColumnsSVG").selectAll("#CategoricalColumnsSVG > g").each(function(ele) {
                                let currEle = d3.select(this)
                                let currEleID = currEle.attr("id")
                                let currY = parseInt(currEle.attr("transform").replace("translate(", "").replace(")", "").split(",")[1])
                                if(currEleID.replace("_column", "") == convertToID(d))
                                    columnFound = 1
                                else if(columnFound == 1) {
                                    currEle.transition().attr("transform", `translate(0, ${currY + filterRectHeight})`)
                                }
                            })

                            // Increase the height of CategoricalColumnsSVG
                            let currHeight = parseInt(d3.select("#CategoricalColumnsSVG").attr("height"))
                            d3.select("#CategoricalColumnsSVG").transition().attr("height", currHeight + filterRectHeight)
                        }
                    })
                categoricalIncre += 1
            }
            else /*if(columnType == "numeric")*/ {

                // Element already exists then delete it and recreate it to preserve order
                if(!d3.select(`#${convertToID(d)}_column`).empty()) {
                    d3.select(`#${convertToID(d)}_column`).remove()
                }

                let columnGTag = d3.select("#NumericColumnsSVG")
                    .attr("height", gap*(numericIncre+1) - gap/2)
                    .append("g")
                    .attr("id", `${convertToID(d)}_column`)
                    .attr("transform", `translate(0,${gap*(numericIncre) - gap/2})`)

                // Filter Rect
                columnGTag.append("rect")
                    .transition()
                    .attr("fill", "rgba(32,142,183)")
                    .attr("width", "100%")
                    .attr("y", 0)
                    .attr("height", 2*gap)

                // Add menu for the filter
                let dropdown = columnGTag.append("g")
                    .attr("transform", `translate(${0}, ${2*gap - 1})`)

                dropdown.append("rect")
                    .attr("x", `10%`)
                    .attr("width", "80%")
                    .attr("height", 2)
                    .attr("fill", "white")
                
                dropdown.append("rect")
                    .attr("x", `90%`)
                    .attr("width", 2)
                    .attr("height", 5)
                    .attr("fill", "white")
                
                dropdown.append("rect")
                    .attr("x", `10%`)
                    .attr("width", 2)
                    .attr("height", 5)
                    .attr("fill", "white")

                dropdown.append("text")
                    .text(function() {
                        let minVal = d3.min(data.map(x => +x[d]))

                        if(minVal > 1000000000){
                            return `${parseFloat(minVal/1000000000).toFixed(2)}B`
                        }
                        if(minVal > 1000000){
                            return `${parseFloat(minVal/1000000).toFixed(2)}M`
                        }
                        if(minVal > 1000){
                            return `${parseFloat(minVal/1000).toFixed(2)}K`
                        }
                        return parseFloat(minVal).toFixed(2)
                    })
                    .style("text-anchor", "middle")
                    .attr("font-size", 10)
                    .style("alignment-baseline", "hanging")
                    .attr("x", `10%`)
                    .attr("y", `8`)
                    .attr("fill", "white")
                
                dropdown.append("text")
                    .text(function() {
                        let maxVal = d3.max(data.map(x => +x[d]))

                        if(maxVal > 1000000000){
                            return `${parseFloat(maxVal/1000000000).toFixed(2)}B`
                        }
                        if(maxVal > 1000000){
                            return `${parseFloat(maxVal/1000000).toFixed(2)}M`
                        }
                        if(maxVal > 1000){
                            return `${parseFloat(maxVal/1000).toFixed(2)}K`
                        }
                        return parseFloat(maxVal).toFixed(2)
                    })
                    .attr("font-size", 10)
                    .style("text-anchor", "middle")
                    .style("alignment-baseline", "hanging")
                    .attr("x", `90%`)
                    .attr("y", `8`)
                    .attr("fill", "white")

                let draggablePartLeft = dropdown.append("g")
                    .style("cursor", "pointer")
                    .attr("id", `${convertToID(d)}_leftDrag`)

                draggablePartLeft.append("rect")
                    .attr("x", function() {

                        let minValue = d3.min(data.map(row => +row[d]))
                        let maxValue = d3.max(data.map(row => +row[d]))
                        let minValueStored = numericalFilteredData[d][0]

                        let minPercent = 10
                        let maxPercent = 90
                        
                        // y = mx+c
                        let slope = (maxPercent - minPercent)/(maxValue - minValue)
                        let yIntercept = minPercent
                        let newPercent = slope*minValueStored + yIntercept
                        return `${newPercent}%`
                    })
                    .attr("width", 2)
                    .attr("height", 5)
                    .attr("y", -5)
                    .attr("fill", "white")
                
                draggablePartLeft.append("circle")
                    .attr("cx", function() {
                        
                        let getBounding = document.getElementById(`${convertToID(d)}_column`).getBoundingClientRect()

                        let minValue = d3.min(data.map(row => +row[d]))
                        let maxValue = d3.max(data.map(row => +row[d]))
                        let minValueStored = numericalFilteredData[d][0]

                        let minPercent = 10
                        let maxPercent = 90
                        
                        // y = mx+c
                        let slope = (maxPercent - minPercent)/(maxValue - minValue)
                        let yIntercept = minPercent
                        let newPercent = slope*minValueStored + yIntercept

                        let percent = (newPercent*getBounding.width/100 + 1)*100/getBounding.width
                        return `${percent}%`
                    })
                    .attr("r", 5)
                    .attr("cy", -9)
                    .attr("fill", "white")

                let draggablePartRight = dropdown.append("g")
                    .style("cursor", "pointer")
                    .attr("id", `${convertToID(d)}_rightDrag`)

                draggablePartRight.append("rect")
                    .attr("x", function() {

                        let minValue = d3.min(data.map(row => +row[d]))
                        let maxValue = d3.max(data.map(row => +row[d]))
                        let minValueStored = numericalFilteredData[d][1]

                        let minPercent = 10
                        let maxPercent = 90
                        
                        // y = mx+c
                        let slope = (maxPercent - minPercent)/(maxValue - minValue)
                        let yIntercept = minPercent
                        let newPercent = slope*minValueStored + yIntercept
                        return `${newPercent}%`
                    })
                    .attr("width", 2)
                    .attr("height", 5)
                    .attr("y", -5)
                    .attr("fill", "white")
                
                draggablePartRight.append("circle")
                    .attr("cx", function() {
                            
                        let getBounding = document.getElementById(`${convertToID(d)}_column`).getBoundingClientRect()

                        let minValue = d3.min(data.map(row => +row[d]))
                        let maxValue = d3.max(data.map(row => +row[d]))
                        let minValueStored = numericalFilteredData[d][1]

                        let minPercent = 10
                        let maxPercent = 90
                        
                        // y = mx+c
                        let slope = (maxPercent - minPercent)/(maxValue - minValue)
                        let yIntercept = minPercent
                        let newPercent = slope*minValueStored + yIntercept

                        let percent = (newPercent*getBounding.width/100 + 1)*100/getBounding.width
                        return `${percent}%`
                    })
                    .attr("r", 5)
                    .attr("cy", -9)
                    .attr("fill", "white")
                
                this[`${convertToID(d)}dragLeftObject`] = d3.drag()
                    .on("start", function() {
                        console.log(this)
                    })
                    .on("drag", function() {

                        let getBounding = document.getElementById(`${convertToID(d)}_column`).getBoundingClientRect()

                        let circle = d3.select(this).select("circle")
                        let rect = d3.select(this).select("rect")

                        let percent = d3.event.x*100/getBounding.width
                        if(percent >= 10) {
                            rect.attr("x", `${percent}%`)
                            circle.attr("cx", `${percent}%`)
                        }
                    })
                    .on("end", function() {

                        let getBounding = document.getElementById(`${convertToID(d)}_column`).getBoundingClientRect()

                        let circle = d3.select(this).select("circle")
                        let rect = d3.select(this).select("rect")

                        let minValue = d3.min(data.map(row => +row[d]))
                        let maxValue = d3.max(data.map(row => +row[d]))
                        
                        if(maxValue == minValue) {

                            // Move the element back to its start location and nothing else has to be done
                            rect.attr("x", `10%`)
                            circle.attr("cx", `${(0.1*getBounding.width + 1)*100/getBounding.width}%`)
                        }
                        else {
                            // Need to find the new minimum
                            let minPercent = 10
                            let maxPercent = 90
                            let currPercent = d3.event.x*100/getBounding.width

                            // y = mx+c
                            let slope = (maxValue - minValue)/(maxPercent - minPercent)
                            let yIntercept = minValue
                            let newMin = slope*currPercent + minValue
                            updateNumericalFilteredData(d, "min", newMin)

                            // Create a new data based on categoricalFilteredData
                            dataAfterFilter = getDataAfterFilter(data)

                            // Call the show data again to change data in all visualizations
                            createAllVisualizations(dataAfterFilter, datasetName)

                        }

                    })
                this[`${convertToID(d)}dragRightObject`] = d3.drag()
                    .on("start", function(dragEle) {
                        console.log("start")
                    })
                    .on("drag", function(dragEle) {

                        let getBounding = document.getElementById(`${convertToID(d)}_column`).getBoundingClientRect()

                        let circle = d3.select(this).select("circle")
                        let rect = d3.select(this).select("rect")

                        let percent = d3.event.x*100/getBounding.width
                        if(percent <= 90) {
                            rect.attr("x", `${percent}%`)
                            circle.attr("cx", `${percent}%`)
                        }
                    })
                    .on("end", function(dragEle) {
                        
                        let getBounding = document.getElementById(`${convertToID(d)}_column`).getBoundingClientRect()

                        let circle = d3.select(this).select("circle")
                        let rect = d3.select(this).select("rect")

                        let minValue = d3.min(data.map(row => +row[d]))
                        let maxValue = d3.max(data.map(row => +row[d]))
                        
                        if(maxValue == minValue) {

                            // Move the element back to its start location and nothing else has to be done
                            rect.attr("x", `90%`)
                            circle.attr("cx", `${(0.9*getBounding.width + 1)*100/getBounding.width}%`)
                        }
                        else {
                            // Need to find the new minimum
                            let minPercent = 10
                            let maxPercent = 90
                            let currPercent = d3.event.x*100/getBounding.width

                            // y = mx+c
                            let slope = (maxValue - minValue)/(maxPercent - minPercent)
                            let yIntercept = minValue
                            let newMax = slope*currPercent + minValue
                            updateNumericalFilteredData(d, "max", newMax)

                            // Create a new data based on categoricalFilteredData
                            dataAfterFilter = getDataAfterFilter(data)

                            // Call the show data again to change data in all visualizations
                            createAllVisualizations(dataAfterFilter, datasetName)

                        }
                        
                    })
                
                draggablePartLeft.call(this[`${convertToID(d)}dragLeftObject`])
                draggablePartRight.call(this[`${convertToID(d)}dragRightObject`])

                // Background rect
                columnGTag.append("rect")
                    .transition()
                    .attr("fill", "white")
                    .attr("y", 0)
                    .attr("width", "100%")
                    .attr("height", gap)
                    .attr("filter", `url(#${d}_shadow)`)

                // Shadow
                let shadow = columnGTag.append("defs")
                    .append("filter")
                    .attr("id", `${d}_shadow`)
                    .attr("x", "0")
                    .attr("y", "0")
                    .attr("width", "100%")
                    .attr("height", "200%")
                
                shadow.append("feOffset")
                    .attr("result", "offOut")
                    .attr("in", "SourceAlpha")
                    .attr("dx", "0")
                    .attr("dy", "1")
                
                shadow.append("feGaussianBlur")
                    .attr("result", "blurOut")
                    .attr("in", "offOut")
                    .attr("stdDeviation", "5")
                
                shadow.append("feBlend")
                    .attr("in", "SourceGraphic")
                    .attr("in2", "blurOut")
                    .attr("mode", "normal")

                columnGTag.append("circle")
                        .transition()
                        .attr("fill", "black")
                        .attr("r", 5)
                        .attr("cx", "10px")
                        .attr("cy", gap/2)

                columnGTag.append("circle")
                    .transition()
                    .attr("fill", getConfidenceColors(data, d)[0])
                    .attr("stroke", getConfidenceColors(data, d)[1])
                    .attr("r", 5)
                    .attr("cx", "10px")
                    .attr("cy", gap/2)
                
                columnGTag.append("text")
                    .transition()
                    .text(function() {
                        if(d.length > maxTextLengthBasedOnDrag)
                            return d.substring(0, maxTextLengthBasedOnDrag) + "..."
                        else return d
                    })
                    .attr("fill", "black")
                    .attr("x", "20px")
                    .attr("y", gap/2 + 5)

                columnGTag.append("line")
                    .transition()
                    .attr("stroke", "#666")
                    .attr("x1", "0%")
                    .attr("y1", gap)
                    .attr("x2", "100%")
                    .attr("y2", gap)
                
                columnGTag.append("svg")
                    .attr("x", `88%`)
                    .attr("y", `${gap/3}`)
                    .append("path")
                    .attr("fill", function() {
                        if(columnsToConsiderForHistogram.includes(d))
                            return "black"
                        else return "white"
                    })
                    .attr("stroke", "black")
                    .attr("transform", "translate(3, 1)")
                    .style("cursor", "pointer")
                    .attr("stroke-width", 0.4)
                    .attr("d", getBarChartIconPath)
                    .on("mouseover", function() {
                        if(columnsToConsiderForHistogram.includes(d))
                            d3.select(this).transition().duration(50).attr("fill", "white")
                        else d3.select(this).transition().duration(50).attr("fill", "black")
                    })
                    .on("mouseleave", function() {
                        if(columnsToConsiderForHistogram.includes(d))
                            d3.select(this).transition().duration(50).attr("fill", "black")
                        else d3.select(this).transition().duration(50).attr("fill", "white")
                    })
                    .on("click", function() {
                        if(columnsToConsiderForHistogram.includes(d)) {
                            d3.select(this).transition().duration(50).attr("fill", "white")
                            let index = columnsToConsiderForHistogram.indexOf(d)
                            columnsToConsiderForHistogram.splice(index, 1)
                        }
                        else {
                            d3.select(this).transition().duration(50).attr("fill", "black")
                            columnsToConsiderForHistogram.push(d)
                        }
                        createHistogramCharts(data, columnsToConsiderForHistogram)
                    })
                
                // Add a filter icon
                columnGTag.append("svg")
                    .attr("x", `78%`)
                    .attr("y", `${gap/3}`)
                    .append("path")
                    .attr("fill", "white")
                    .attr("stroke", "black")
                    .attr("transform", "translate(3, 1)")
                    .style("cursor", "pointer")
                    .attr("stroke-width", 0.4)
                    .attr("d", getFilterIconPath)
                    .on("mouseover", function() {
                        d3.select(this).transition().duration(50).attr("fill", "black")
                    })
                    .on("mouseleave", function() {
                        d3.select(this).transition().duration(50).attr("fill", "white")
                    })
                    .on("click", function() {
                        let filterRect = columnGTag.select("rect")
                        let bgRect = columnGTag.select(`#${convertToID(d)}_column > rect:nth-child(3)`)
                        let bgRectY = bgRect.attr("y")
                        let filterRectY = filterRect.attr("y")
                        let bgRectHeight = bgRect.attr("height")
                        let filterRectHeight = parseInt(filterRect.attr("height"))
                        
                        if(filterRectY != bgRectY) {
                            filterRect.transition().attr("y", bgRectY)

                            // Move all the g below this up
                            let columnFound = 0
                            d3.select("#NumericColumnsSVG").selectAll("#NumericColumnsSVG > g").each(function(ele) {
                                let currEle = d3.select(this)
                                let currEleID = currEle.attr("id")
                                let currY = parseInt(currEle.attr("transform").replace("translate(", "").replace(")", "").split(",")[1])
                                if(currEleID.replace("_column", "") == convertToID(d))
                                    columnFound = 1
                                else if(columnFound == 1) {
                                    currEle.transition().attr("transform", `translate(0, ${currY - filterRectHeight})`)
                                }
                            })

                            // Decrease the height of NumericColumnsSVG
                            let currHeight = parseInt(d3.select("#NumericColumnsSVG").attr("height"))
                            d3.select("#NumericColumnsSVG").transition().attr("height", currHeight - filterRectHeight)

                        }
                        
                        else {
                            filterRect.transition().attr("y", bgRectHeight)

                            // Move all the g below this down
                            let columnFound = 0
                            d3.select("#NumericColumnsSVG").selectAll("#NumericColumnsSVG > g").each(function(ele) {
                                let currEle = d3.select(this)
                                let currEleID = currEle.attr("id")
                                let currY = parseInt(currEle.attr("transform").replace("translate(", "").replace(")", "").split(",")[1])
                                if(currEleID.replace("_column", "") == convertToID(d))
                                    columnFound = 1
                                else if(columnFound == 1) {
                                    currEle.transition().attr("transform", `translate(0, ${currY + filterRectHeight})`)
                                }
                            })

                            // Increase the height of NumericColumnsSVG
                            let currHeight = parseInt(d3.select("#NumericColumnsSVG").attr("height"))
                            d3.select("#NumericColumnsSVG").transition().attr("height", currHeight + filterRectHeight)
                        }
                        
                    })

                numericIncre += 1
            }
        }
        // Remove existing element that needs to be removed
        else {
            d3.select(`#${convertToID(d)}_column`).remove()
        }
    })
}

// Function: Remove all existing elements
function removeAllExistingElements() {

    // Elements created in addColumns
    d3.select("#CategoricalColumnsSVG").selectAll("g").remove()
    d3.select("#NumericColumnsSVG").selectAll("g").remove()
    
    // All bar charts created in createAllBarChartsMain
    d3.select("#bottom_graph_panel_barChart_container").selectAll("svg").remove()

    // Elements created in createMatrixChart
    d3.select(`#top_cluster_panel_container`).selectAll("svg").remove()

    // Elements created in maps
    d3.select("#map").selectAll("g").remove()
    d3.select("#map").selectAll("path").remove()

    // Elements created in line chart
    d3.select("#middle_graph_panel_container").selectAll("svg").remove()
    d3.select("#middle_graph_panel_container").selectAll("g").remove()
}

// Function: Create all visualizations
function createAllVisualizations(data, datasetName) {

    // Now call this function to create all the bar charts for all the enabled columns
    createAllBarChartsMain(data, columnsToConsiderForBarChart)

    // Now call this function to create all the histograms for all the enabled columns
    createHistogramCharts(data,columnsToConsiderForHistogram);
    
    // Create middle line chart
    if(datasetName == "Border_Crossing_Entry_Data.csv")
        createLineChartMiddle(data, "Crossings", "Date")
    else
        createLineChartMiddle(data, "available_properties", "last_review")

    // Create top matrix chart

    try {
        if(datasetName == "Border_Crossing_Entry_Data.csv")
            createMatrixChart(data, "Measure", "State")
        else
            createMatrixChart(data, "neighbourhood_group", "room_type")
    }
    catch (err) {
        console.error(err)
    }

    try {
        // Create the map
        if(datasetName == "Border_Crossing_Entry_Data.csv")
            createMap(data, datasetName, "./data/us-states.json", "Crossings", "State")
        else
            createMap(data, datasetName, "./data/neighbourhood.json", "number_of_reviews", "neighbourhood_group")
    }
    catch (err) {
        console.error(err)
    }
}

// Function: Main function which is called once data is loaded
function mainFunctionToAddColumns(data, datasetName) {

    // Figure out which columns to enable when screen loads
    columnsToConsiderForBarChart = []
    columnsToConsiderForHistogram = []

    categoricalFilteredData = {} 
    numericalFilteredData = {}

    data.columns.forEach(function(d) {
        let columnType = isNaN(data[0][d]) ? "categorical" : "numeric"
        if(columnType == "categorical") {
            let noOfCategories = d3.map(data, row => row[d]).keys().length
            console.log(d, noOfCategories)

            if(noOfCategories < 30)
                columnsToConsiderForBarChart.push(d)
        }
        else{
            
            // Initialize numericalFilteredData
            numericalFilteredData[d] = [d3.min(data.map(row => +row[d])), d3.max(data.map(row => +row[d]))]

            if(d!='id')
                columnsToConsiderForHistogram.push(d)
        }
    })

    // Remove all existing elements that are created below
    removeAllExistingElements()

    // Add a button to change datasets
    addDatasetToggle()
    
    // Show all the columns
    addColumns(data, datasetName, '')

    // Create all visualizations
    createAllVisualizations(data, datasetName)

    // Listen to on click event on the search field
    d3.select('#searchField')
        .on('click', function() {

            let currentString = d3.select(this).node().value

            // Now listen to keypress event
            d3.select(this).on("keyup", function() {
                currentString = d3.select(this).node().value
                addColumns(data, datasetName, currentString)
            })
        })

    // Listen to on click event on the showAllData field
    d3.select("#showAllDataInput")
        .on('click', function() {

            let currentCheck = d3.select(this).property("checked")
            
            if(currentCheck == true) {
                addColumns(data, datasetName, '')
            }
            else {
                let currentString = d3.select('#searchField').node().value
                addColumns(data, datasetName, currentString)
            }

        })
}