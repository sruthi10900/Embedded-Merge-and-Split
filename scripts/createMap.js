//Bug: Exit() not working correctly

let indexCreated = []
let originalRegions = []

function initializeMap(datasetName, mapJson, countData) {
    let boundingRect = document.getElementById("map").getBoundingClientRect()

    // Add a tooltip
    let tip = d3.tip()
        .attr('id', `map_d3-tip`)
        .style("font-size", "4")
        .html(function(d) {
            return d 
        });

    // Invoke the tip in the context of your visualization
    d3.select(`#map`).call(tip)

    //========projection======
    let location = null
    let jsonColumn = null
    if(datasetName == "Border_Crossing_Entry_Data.csv") {
        projection = d3
            .geoAlbersUsa()
            .translate([boundingRect.width/2, boundingRect.height/2])
            .scale([500]);

        jsonColumn = "name"
    }
    else {
        projection = d3
            .geoMercator()
            .center([-74.006, 40.7128])
            .scale(30000)
            .translate([boundingRect.width/2, boundingRect.height/2]);

        jsonColumn = "BoroName"
    }

    var geoPath = d3.geoPath().projection(projection);
    

    //=======scale==========
    let dataExtent = d3.extent(countData.map(d => d["value"]))
    let colorScale = d3.scaleLinear()
        .domain(dataExtent)
        .range(["#71c7ec", "#005073"])

    // Binding the path elements with geoData
    let dataBinding = d3.select("#map").selectAll("path")
        .data(countData)
    
    dataBinding.enter()
        .append("path")
        .attr("id", d => `map_path_${convertToID(d["key"])}`)
        .attr("d", d => {
            let boroName = d["key"]
            if(!originalRegions.includes(boroName))
                originalRegions.push(boroName)
            let index = -1
            mapJson.features.forEach((feature, indexToBeUsed) => {
                if(boroName == feature.properties[jsonColumn]) {
                    index = indexToBeUsed
                }
            });
            indexCreated.push(index)
            return geoPath(mapJson.features[index])
        })
        .attr("stroke", "black")
        .attr("fill", d => {
            return colorScale(d["value"])
        })
        .on('mouseover', function(d) {
            tip.attr('class', 'd3-tip animate').show(d3.select(this).attr("id").replace("map_path_", ""))
        })
        .on('mouseout', function(d) {
            tip.attr('class', 'd3-tip').show(d3.select(this).attr("id").replace("map_path_", ""))
            tip.hide()
          })


    originalRegions.forEach(region => {
        if(!countData.map(d => d["key"]).includes(region)) {
            d3.select(`#map_path_${convertToID(region)}`).transition().attr("fill", "white")
        }
        else {
            let value = countData.filter(d => d["key"] == region)
            d3.select(`#map_path_${convertToID(region)}`).transition().attr("fill", colorScale(value[0]["value"]))
        }
    })
        
    if(d3.select("#map").select("g").empty()) {
        let g = d3.select("#map").append("g")
        mapJson.features.forEach((feature, indexToBeUsed) => {
            if(!indexCreated.includes(indexToBeUsed)) {
                g.append("path")
                    .attr("d", geoPath(feature))
                    .attr("fill", "white")
                    .attr("stroke", "black")
                    .on('mouseover', function(d) {
                        tip.attr('class', 'd3-tip animate').show(feature.properties[jsonColumn])
                    })
                    .on('mouseout', function(d) {
                        tip.attr('class', 'd3-tip').show(feature.properties[jsonColumn])
                        tip.hide()
                      })
            }
        });
    }

    // Creating the legend

    if(d3.select("#map").select("defs").empty()) {
        var defs = d3.select("#map").append("defs");

        //Append a linearGradient element to the defs and give it a unique id
        var linearGradient = defs.append("linearGradient")
            .attr("id", "linear-gradient");

        linearGradient
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");

        //Set the color for the start (0%)
        linearGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#71c7ec"); //light blue

        //Set the color for the end (100%)
        linearGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#005073"); //dark blue

        //Draw the rectangle and fill with gradient
        d3.select("#map").append("rect")
            .attr("width", boundingRect.width - 100)
            .attr("height", 10)
            .attr("x", 50)
            .attr("y", boundingRect.height - 10)
            .style("fill", "url(#linear-gradient)");

    }
    let legendBinding = d3.select("#map").selectAll("text").data(dataExtent)
    
    legendBinding.enter()
        .append("text")
        .attr("x", (d, i) => i*(boundingRect.width) + (1-i)*100 - 50)
        .attr("y", boundingRect.height + 10)
        .style("fill", "black")
        .style("font-family", "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif")
        .attr("text-anchor", "middle")
        .style("font-size", "10")
        .attr("alignment-baseline", "hanging")
        .text((d, i) => dataExtent[i])

    legendBinding.text((d, i) => dataExtent[i])
}

function createMap(data, datasetName, jsonFile, numericalColumn, locationColumn) {

    //========Get Data=========
    var countData = d3.nest()
        .key(d => convertToID(d[locationColumn]))
        .rollup(function(v) { return d3.sum(v, function(d) { return d[numericalColumn]; });  })
        .entries(data)

    d3.json(jsonFile, function(mapJson) {
        initializeMap(datasetName, mapJson, countData)
    })


}