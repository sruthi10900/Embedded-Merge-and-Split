/**
 * BUGS:
 * 1. Refresh rate issue
 * 2. Elements swap during the transition
 */

class BarChart {

    // Function: Constructor of the class
    constructor(boundingPanel, data, categoricalColumn, numericalColumn) {
        this.marginsForBarCharts = {
            top: 30,
            bottom: 100,
            left: 30,
            right: 30
        }

        this.paddingForBarCharts = {
            top: 0,
            bottom: 30,
            left: 30,
            right: 0
        }

        this.data = data
        this.boundingPanel = boundingPanel
        this.boundingRect = document.getElementById(`${boundingPanel}`).getBoundingClientRect();
        this.BAR_CHART_WIDTH = this.boundingRect.width - this.marginsForBarCharts.left - this.marginsForBarCharts.right
        this.BAR_CHART_HEIGHT = this.boundingRect.height - this.marginsForBarCharts.top - this.marginsForBarCharts.bottom
        this['drag'+this.boundingPanel] = null //This creates a variable 'variable name'
        this.dataBinding = null
        this.tip = null
        
        this.categoricalColumn = categoricalColumn
        this.numericalColumn = numericalColumn
        
    }

    // Function: Inverts a given scale
    invertScale(scale){
        var domain = scale.domain()
        var range = scale.range()
        var scale = d3.scaleQuantize().domain(range).range(domain)

        return function(x){
            return scale(x)
        }
    }

    // Function: Gets the position and yScale for the given data

    getScales(data) {
        let positionScale = d3.scaleBand()
            .domain(data.map(d => d[this.categoricalColumn]))
            .range([0, this.BAR_CHART_WIDTH])
            .padding(0.1)

        let yScale = d3.scaleLinear() 
            .domain([0, d3.max(data.map(d => d3.sum(d[this.numericalColumn].split("-").map(k => +k))))])
            .range([this.BAR_CHART_HEIGHT, 0])
        
        return {positionScale, yScale}
    }

    // Function: Returns the drag object that supports merge and split operations
    getDragObject(data) {

        let {positionScale, yScale} = this.getScales(data)

        // custom invert function
        let positionScaleInvert = this.invertScale(positionScale)
        let yScaleInvert = this.invertScale(yScale)
        
        /* 3 phases of drag
         * Phase 1: Drag Start - Here we do two things
         *          1. Change color of target element to red
         *          2. Create a temp rectangle that guides the user where the outcome will be when he/she stops
         * Phase 2: Dragging - Here only one thing happens
         *          1. Based on where the user is trying to drag the element, the UI will display how the output will look like when the user stops the drag
         * Phase 3: Drag ends - Here a lot of things happen, but mainly one thing happens and a lot of different sceanrios
         *          1. Based on where the user stops dragging, we update the data and then call showdata again.
         *             Cases to handle in drag end:
         *             i)  
        */

        this['drag'+this.boundingPanel] = d3.drag()
        .on("start", d => {
            let x = 1

            // Get the target element
            let targetRectNumber = d[this.numericalColumn].split("-").length
            let targetElement = d3.select(`#${this.boundingPanel}${d[this.categoricalColumn]}${targetRectNumber}`)

            // Change targets color to red
            targetElement.attr("fill","rgb(7,77,101)")

            // Get the properties of target element to create a temp rectangle
            let targetHeight = targetElement.attr("height")
            let targetWidth = targetElement.attr("width")
            let targetTransform = targetElement.attr("transform")

            // Actually create the temp rectangle
            d3.select(`#${this.boundingPanel}barChart`)
                .append("rect")
                .attr("id", "tempRect")
                .attr("fill", "none")
                .attr("stroke", "rgb(7,77,101)")
                .style("stroke-dasharray", ("3, 3"))
                .style("stroke-width", "2")
                .attr("width", targetWidth)
                .attr("height", targetHeight)
                .attr("transform", targetTransform)
        })
        .on("drag", (d, i, arr) => {

            d3.selectAll("#tempArrow").remove()

            // Get the target element
            let targetRectNumber = d[this.numericalColumn].split("-").length
            let targetElement = d3.select(`#${this.boundingPanel}${d[this.categoricalColumn]}${targetRectNumber}`)

            // Get the properties of target element to move the temp rectangle
            let targetHeight = targetElement.attr("height")
            let targetWidth = targetElement.attr("width")

            // Get the current position of mouse to decide where the user is trying to place the target
            let mouseX = d3.event.x
            let mouseY = d3.event.y

            // Get the nearest category based on the x-coordinate of mouse to identify where the user is trying to place the target
            let nearestCategory = positionScaleInvert(mouseX)

            // Get the topmost element of the stack of bars where the user is trying to place the target, lets call it nearestElement
            let nearestRectNumber = 1
            while(true) {
                let x = d3.select(`#${this.boundingPanel}${nearestCategory}${nearestRectNumber}`)
                if(x.empty()) {
                    nearestRectNumber -= 1
                    break
                }
                nearestRectNumber += 1
            }
            let nearestElement = d3.select(`#${this.boundingPanel}${nearestCategory}${nearestRectNumber}`)
            
            // Move the target along with the mouse
            targetElement.attr("transform", `translate(${mouseX - targetWidth/2}, ${mouseY - targetHeight/2})`)
            
            // If the nearestCategory is not the same as target's current category, then move the temp rect to new category position
            let newTarget = d3.select("#tempRect")
            if(nearestCategory != d[this.categoricalColumn]) {

                let nearestHeight = nearestElement
                    .attr("transform")
                    .replace("translate(","")
                    .replace(")","").split(",")[1] - targetHeight

                newTarget
                    .transition()
                    .duration(100)
                    .ease(d3.easeLinear)
                    .attr("transform", `translate(${positionScale(nearestCategory)}, ${nearestHeight})`)
            }
            // Otherwise just place the temp rect back to target's original position
            else {

                // For each data element do this
                let targetCategoryIndex = []
                data.forEach((element, index) => {
                    // If the element encountered is the target element
                    if(element[this.categoricalColumn] == d[this.categoricalColumn]){
                        targetCategoryIndex.push(index)
                    }
                });

                // Sort the targetCategoryIndex based on the length of the numerical value at that index. This way the index at 0th position of targetCategoryIndex represents the bottommost element in the stack and the last element represents the topmost element
                let self = this
                targetCategoryIndex.sort(function(a, b){
                    return data[a][self.numericalColumn].length - data[b][self.numericalColumn].length;
                });

                // Finding the data index that has longest numerical value among the values in "targetCategoryIndex", i.e. finding the topmost element with category = targetCategory
                let targetTopmostElementIndex = targetCategoryIndex[targetRectNumber - 1]

                // FInding the overall category of the target and the original category of the target
                let targetOriginalNumerical = data[targetTopmostElementIndex][this.numericalColumn].split("-").pop()

                let targetY = targetElement
                    .attr("transform")
                    .replace("translate(","")
                    .replace(")","").split(",")[1]
            
                let overallHeightOfStack = yScale(d3.sum(data[targetTopmostElementIndex][this.numericalColumn].split("-").slice(0,-1).map(k => +k)))
                
                let topOfTargetStack = this.BAR_CHART_HEIGHT - overallHeightOfStack
                let yPositionOfTarget = yScale(targetOriginalNumerical) - parseFloat(targetY)

                if(targetRectNumber == targetCategoryIndex.length && targetRectNumber != 1 && yPositionOfTarget - topOfTargetStack > 25){
                    newTarget
                        .transition()
                        .duration(100)
                        .ease(d3.easeLinear)
                        .attr("transform", `translate(${positionScale(d[this.categoricalColumn])}, ${yScale(d3.sum(d[this.numericalColumn].split("-").map(k => +k))) - 25})`)
                    
                    d3.select(`#${this.boundingPanel}barChart`)
                        .append("path")
                        .attr("id", "tempArrow")
                        .attr("fill", "rgb(7,77,101)")
                        .attr("d", "M 0 0 L 6 4 L 4 4 L 4 8 L -4 8 L -4 4 L -6 4 L 0 0")
                        .style("text-align", "center")
                        .style("display", "block")
                        .attr("transform", `translate(${positionScale(d[this.categoricalColumn]) + positionScale.bandwidth()/2}, ${(yScale(d3.sum(d[this.numericalColumn].split("-").slice(0, -1).map(k => +k))) - 25/2 - 4)})`)
                }
                else {
                    d3.selectAll("#tempArrow").remove()
                    newTarget
                        .transition()
                        .duration(100)
                        .ease(d3.easeLinear)
                        .attr("transform", `translate(${positionScale(d[this.categoricalColumn])}, ${yScale(d3.sum(d[this.numericalColumn].split("-").map(k => +k)))})`)
                }

                
            }    

        })
        .on("end", (d,i,arr) => {

            // Basically the idea here is that the target element will always be the topmost element.
            // Therefore, its numerical value will always be of maximum length.
            // If we want to drop some middle or lower element then we have to think of some other logic.

            //What I want: (For merge)
            // 1. Category of nearest element change to A-C. Other things remain same
            // 2. Category of target element change to A-C. and value also change. Other things remain same

            // What I want: (For split)
            // 1. Category of all elements (except target element) whose category is same as target elements category does not have target category in it anymore
            
            
            // Since we have dropped the element we can remove the temp rectangle
            
            d3.selectAll("#tempArrow").remove()
            d3.select("#tempRect").remove()

            // Get the target SVG topmost element (i.e. one that has the targetRectNumber = number of numerical values separated by '-' in "numericalColumn")
            let targetRectNumber = d[this.numericalColumn].split("-").length
            let targetElement = d3.select(`#${this.boundingPanel}${d[this.categoricalColumn]}${targetRectNumber}`)
            
            // Get the nearest category where we are planning to drop the element needed later
            let mouseX = d3.event.x
            let nearestCategory = positionScaleInvert(mouseX)

            // If the target element is not at the same position when we drop it, 
            // then we find all the datapoints which are at the category of target element
            // and all the datapoints which are at the category of nearest category
            let nearestCategoryIndex = []
            let targetCategoryIndex = []

            if(nearestCategory != d[this.categoricalColumn]) {

                // For each data element do this
                data.forEach((element, index) => {

                    // If the element encountered is the place where we are planning to drop
                    if(element[this.categoricalColumn] == nearestCategory){
                        nearestCategoryIndex.push(index)
                    }

                    // Else if the element encountered is the target element
                    else if(element[this.categoricalColumn] == d[this.categoricalColumn]){
                        targetCategoryIndex.push(index)
                    }
                });

                // Sort the targetCategoryIndex based on the length of the numerical value at that index. This way the index at 0th position of targetCategoryIndex represents the bottommost element in the stack and the last element represents the topmost element
                let self = this
                targetCategoryIndex.sort(function(a, b){
                    return data[a][self.numericalColumn].length - data[b][self.numericalColumn].length;
                });

                // Finding the data index that has longest numerical value among the values in "targetCategoryIndex", i.e. finding the topmost element with category = targetCategory
                let targetTopmostElementIndex = targetCategoryIndex[targetRectNumber - 1]

                // FInding the overall category of the target and the original category of the target
                let targetCategory = data[targetTopmostElementIndex][this.categoricalColumn]
                let tempCategory = targetCategory.split("-")[targetRectNumber - 1]
                
                // Now for each element that has the same category as the current taregt element, 
                // we will remove the original numerical value of the target element from them if they 
                // lie on top of the target element, i.e. their index in targetCategoryIndex is higher 
                // than our actual target
                data.forEach((element, index) => {

                    // If the element encountered is not the target element but category is same
                    if(element != d && element[this.categoricalColumn] == targetCategory) {
                        if (targetCategoryIndex.indexOf(index) > targetRectNumber-1){                            
                            let numericalValueArray = element[this.numericalColumn].split("-")
                            numericalValueArray.splice(targetRectNumber-1, 1)
                            element[this.numericalColumn] = numericalValueArray.join("-")
                        }
                    }

                })

                // Now for each element that has the same category as the current taregt element, we will remove the original category of the target element from them
                data.forEach((element, index) => {

                    // If the element encountered is not the target element but category is same
                    if(element != d && element[this.categoricalColumn] == targetCategory) {
                        let x = element[this.categoricalColumn].split("-").filter(function(value) {
                            return value != tempCategory;
                        }).join("-")
                        element[this.categoricalColumn] = x
                    }

                })

                // Find the original numerical value of the target element
                let tempNumerical = data[targetTopmostElementIndex][this.numericalColumn].split("-").pop()

                // Sort the nearestCategoryIndex based on the length of the numerical value at that index. This way the index at 0th position of nearestCategoryIndex represents the bottommost element in the stack and the last element represents the topmost element
                nearestCategoryIndex.sort(function(a, b){
                    return data[a][self.numericalColumn].length - data[b][self.numericalColumn].length;
                });
                
                // Finding the data index that has longest numerical value among the values in "nearestCategoryIndex", i.e. finding the topmost element with category = nearestCategoryIndex
                let nearestTopmostElementIndex = nearestCategoryIndex[nearestCategoryIndex.length - 1]

                // Adding the original category and numerical value of the target element to the nearest category
                data[targetTopmostElementIndex][this.categoricalColumn] = `${data[nearestTopmostElementIndex][this.categoricalColumn]}-${tempCategory}`
                data[targetTopmostElementIndex][this.numericalColumn] = `${data[nearestTopmostElementIndex][this.numericalColumn]}-${tempNumerical}`
                
                // Adding the original category of the target element to all the elements in the stack of nearest category
                nearestCategoryIndex.forEach(index => {
                    data[index][this.categoricalColumn] = `${data[index][this.categoricalColumn]}-${tempCategory}`
                });
            }
            // Else if the element is at the same category as earlier and is the topmost element
            else {

                // For each data element do this
                let targetCategoryIndex = []
                data.forEach((element, index) => {
                    // If the element encountered is the target element
                    if(element[this.categoricalColumn] == d[this.categoricalColumn]){
                        targetCategoryIndex.push(index)
                    }
                });

                // Sort the targetCategoryIndex based on the length of the numerical value at that index. This way the index at 0th position of targetCategoryIndex represents the bottommost element in the stack and the last element represents the topmost element
                let self = this
                targetCategoryIndex.sort(function(a, b){
                    return data[a][self.numericalColumn].length - data[b][self.numericalColumn].length;
                });

                // Finding the data index that has longest numerical value among the values in "targetCategoryIndex", i.e. finding the topmost element with category = targetCategory
                let targetTopmostElementIndex = targetCategoryIndex[targetRectNumber - 1]

                // FInding the overall category of the target and the original category of the target
                let targetCategory = data[targetTopmostElementIndex][this.categoricalColumn]
                let targetOriginalCategory = targetCategory.split("-")[targetRectNumber - 1]
                let targetOriginalNumerical = data[targetTopmostElementIndex][this.numericalColumn].split("-").pop()

                // Finding the height of elements below our target + height of target
                let targetY = targetElement
                    .attr("transform")
                    .replace("translate(","")
                    .replace(")","").split(",")[1]
            
                let overallHeightOfStack = yScale(d3.sum(data[targetTopmostElementIndex][this.numericalColumn].split("-").slice(0,-1).map(k => +k)))
                
                let topOfTargetStack = this.BAR_CHART_HEIGHT - overallHeightOfStack
                let yPositionOfTarget = yScale(targetOriginalNumerical) - parseFloat(targetY)

                // Checking if the element is the topmost element and there are elements below it and that we have dragged it up enough
                if(targetRectNumber == targetCategoryIndex.length && targetRectNumber != 1 && yPositionOfTarget - topOfTargetStack > 25) {

                    // Now for each element that has the same category as the current taregt element, 
                    // we will remove the original numerical value of the target element from them if they 
                    // lie on top of the target element, i.e. their index in targetCategoryIndex is higher 
                    // than our actual target
                    data.forEach((element, index) => {

                        // If the element encountered is not the target element but category is same
                        if(element != d && element[this.categoricalColumn] == targetCategory) {
                            if (targetCategoryIndex.indexOf(index) > targetRectNumber-1){                            
                                let numericalValueArray = element[this.numericalColumn].split("-")
                                numericalValueArray.splice(targetRectNumber-1, 1)
                                element[this.numericalColumn] = numericalValueArray.join("-")
                            }
                        }

                    })

                    // Now for each element that has the same category as the current taregt element, we will remove the original category of the target element from them
                    data.forEach((element, index) => {

                        // If the element encountered is not the target element but category is same
                        if(element != d && element[this.categoricalColumn] == targetCategory) {
                            let x = element[this.categoricalColumn].split("-").filter(function(value) {
                                return value != targetOriginalCategory;
                            }).join("-")
                            element[this.categoricalColumn] = x
                        }

                    })

                    // Changing the original category and numerical value of the target element to the original category and numerical value
                    data[targetTopmostElementIndex][this.categoricalColumn] = targetOriginalCategory
                    data[targetTopmostElementIndex][this.numericalColumn] = targetOriginalNumerical

                }
            }
            this.showData(data)
            targetElement.attr("fill","rgb(32,142,183)")
        })
    }

    // Function: Initialize a bar chart
    initialize() {

        // Initialize some variables
        let container = d3.select(`#${this.boundingPanel}`)

        if(d3.select(`#${this.boundingPanel}barChart`).empty()) {
            
            // Create tag for brushing functionality for changing number of bins
            d3.select(`#${this.boundingPanel}`).append("g")
                .attr("class", "brush")
            
            // Add a Barchart group tag        
            container.append("g")
                .attr("id", `${this.boundingPanel}barChart`)
                .attr("width", this.BAR_CHART_WIDTH)
                .attr("height", this.BAR_CHART_HEIGHT)
                .attr("transform", `translate(${this.paddingForBarCharts.left + this.marginsForBarCharts.left}, ${this.paddingForBarCharts.top + this.marginsForBarCharts.top})`)

            // Add a group tag for xaxis
            container.append("g")
                .attr("id", `${this.boundingPanel}xAxis`)
                .style("font-size", 8)
                .attr("transform", `translate(${this.paddingForBarCharts.left + this.marginsForBarCharts.left}, ${this.BAR_CHART_HEIGHT + this.paddingForBarCharts.top + this.marginsForBarCharts.top})`)
            
            // Add a text tag for xaxis label
            let textLabel = container.append("text")
                .attr("id", `${this.boundingPanel}xAxisLabel`)
                .attr("transform", `translate(${this.marginsForBarCharts.left + (this.paddingForBarCharts.left + this.marginsForBarCharts.left + this.BAR_CHART_WIDTH)/2}, ${this.BAR_CHART_HEIGHT + this.marginsForBarCharts.bottom + 0.7*this.marginsForBarCharts.top})`)
                .attr("text-anchor", "middle")
                .style("font-family", "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif")
                .style("font-size", 10)
                .text(this.categoricalColumn)

            // Add a confidence circle with xaxis label
            let textLabelWidth = document.getElementById(`${this.boundingPanel}xAxisLabel`).getBoundingClientRect().width
            container.append("circle")
                .attr("id", `${this.boundingPanel}xAxisConfidence`)
                .attr("cx", (this.BAR_CHART_WIDTH)/2 + this.paddingForBarCharts.left + this.marginsForBarCharts.left - textLabelWidth/2 - 20)
                .attr("cy", this.BAR_CHART_HEIGHT + this.marginsForBarCharts.bottom + 0.6*this.marginsForBarCharts.top)
                .attr("fill", getConfidenceColors(this.data, this.categoricalColumn)[0])
                .attr("stroke", getConfidenceColors(this.data, this.categoricalColumn)[1])
                .attr("r", 5)

            // Add a group tag for yaxis
            container.append("g")
                .attr("id", `${this.boundingPanel}yAxis`)
                .style("font-size", 8)
                .attr("transform", `translate(${this.paddingForBarCharts.left + this.marginsForBarCharts.left}, ${this.paddingForBarCharts.top + this.marginsForBarCharts.top})`)
            
            // Add a text tag for yaxis label
            container.append("text")
                .attr("id", `${this.boundingPanel}yAxisLabel`)
                .attr("text-anchor", "middle")
                .attr("transform", `translate(${this.marginsForBarCharts.left}, ${this.marginsForBarCharts.top + (this.BAR_CHART_HEIGHT + this.paddingForBarCharts.top)/2}) rotate(-90)`)
                .style("font-family", "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif")
                .style("font-size", 10)
                .text(this.numericalColumn)
            }

        // Add a tooltip
        let self = this
        this.tip = d3.tip()
            .attr('id', `${this.boundingPanel}_d3-tip`)
            .style("font-size", "4")
            .html(function(d) {
                let rectNumber = d[self.numericalColumn].split("-").length - 1
                return d[self.categoricalColumn].split("-")[rectNumber]; 
            });

        // Invoke the tip in the context of your visualization
        d3.select(`#${this.boundingPanel}barChart`).call(this.tip)

            // Add a tooltip
            /*let toolTip = container.append("g")
                //.attr("display", "none")
                .style("position", "absolute")
                .attr("id", `${this.boundingPanel}toolTip`)

            toolTip.append("rect")
                .attr("width", "70")
                .attr("height", "40")
                .attr("opacity", 0.8)
                .attr("stroke", "black")
                .style("stroke-opacity", 0.8)*/
    }

    // Function: Updates a bar chart based on user interactions by binding data with the visualization
    showData(data) {

        let {positionScale, yScale} = this.getScales(data)

        this.getDragObject(data)

        this.dataBinding = d3.select(`#${this.boundingPanel}barChart`).selectAll("rect").data(data)
        
        let self = this
        this.dataBinding.enter()
            .append("rect")
            .attr("fill", "rgb(32,142,183)")
            .attr("class", "barChartRectangles")
            .attr("id", d => {
                let rectNumber = d[this.numericalColumn].split("-").length
                return `${this.boundingPanel}${d[this.categoricalColumn]}${rectNumber}`
            })
            .attr("width", positionScale.bandwidth())
            .attr("transform", d => {
                let sumOfAllEntries = d3.sum(d[this.numericalColumn].split("-").map(k => +k))
                return `translate(${positionScale(d[this.categoricalColumn])}, ${yScale(sumOfAllEntries)})`
            })
            .attr("height", d => {
                let sumOfAllEntries = d3.sum(d[this.numericalColumn].split("-").map(k => +k))
                return this.BAR_CHART_HEIGHT - yScale(sumOfAllEntries)
            })
            .attr("stroke", "black")
            .on('mouseover', function(d) {
                self.tip.attr('class', 'd3-tip animate').show(d)
            })
            .on('mouseout', function(d) {
                self.tip.attr('class', 'd3-tip').show(d)
                self.tip.hide()
              })
                
        this.dataBinding.attr("fill", "rgb(32,142,183)")
            .transition()
            .attr("id", d => {
                let rectNumber = d[this.numericalColumn].split("-").length
                return `${this.boundingPanel}${d[this.categoricalColumn]}${rectNumber}`
            })
            .attr("width", positionScale.bandwidth())
            .attr("transform", d => {
                let sumOfAllEntries = d3.sum(d[this.numericalColumn].split("-").map(k => +k))
                let xPosition = positionScale(d[this.categoricalColumn])
                let yPosition = yScale(sumOfAllEntries)
                return `translate(${xPosition}, ${yPosition})`
            })
            .attr("height", d => {
                let listOfAllEntries = d[this.numericalColumn].split("-").map(k => +k)
                let length = listOfAllEntries.length
                let sumOfAllEntries = listOfAllEntries[length - 1]
                return this.BAR_CHART_HEIGHT - yScale(sumOfAllEntries)
            })

        this.dataBinding.exit().remove()

        // Create xAxis
        let xAxis = d3.axisBottom(positionScale)
            .tickFormat(function(e) {  
                let maxLength = 15
                e = e.replace("_or_", "\/").replace("_", " ")
                if(e.length > maxLength){
                    return e.substring(0, maxLength) + "..."
                }
                return e
            })

        d3.select(`#${this.boundingPanel}xAxis`).transition().call(xAxis)
            .call(
                g => {
                    g.selectAll("g").selectAll("text").attr("transform", "translate(-10, 10) rotate(-90)")
                        .style("text-anchor", "end")
                        .style("alignment-baseline", "ideographic")
                }
            )

        // Create yAxis
        let yAxis = d3.axisLeft(yScale)
            .ticks(4)
            .tickFormat(function(e){
                if(Math.floor(e) != e)
                    return
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
        d3.select(`#${this.boundingPanel}yAxis`).transition().call(yAxis)
        
        // Create Drag Functionality for merge and split
        d3.select(`#${this.boundingPanel}barChart`).selectAll("rect").call(this['drag'+this.boundingPanel])

        // Create Brush Functionality for changing number of bins
        /*d3.select(".brush").call(
            d3.brushX()
                .extent([
                    [this.paddingForBarCharts.left + this.marginsForBarCharts.left, this.paddingForBarCharts.top + this.marginsForBarCharts.top],
                    [this.paddingForBarCharts.left + this.marginsForBarCharts.left + this.BAR_CHART_WIDTH, this.paddingForBarCharts.top + this.marginsForBarCharts.top + this.BAR_CHART_HEIGHT]
                ])
                .on("brush", d => {
                    console.log("brushed")
                    console.log(d)
                })
        )*/


        /*d3.select(`#${this.boundingPanel}barChart`).selectAll("rect")
        .on("mousemove", function(d) {
            d3.select(`#${self.boundingPanel}toolTip`)
                .attr("transform", d => {
                    console.log(document.getElementById(`middle_graph_panel_barChart_container`).getBoundingClientRect().x)
                    return `translate(${d3.event.x - document.getElementById(`middle_graph_panel_barChart_container`).getBoundingClientRect().x - self.boundingRect.x + self.marginsForBarCharts.left + self.paddingForBarCharts.left + self.marginsForBarCharts.right + self.paddingForBarCharts.right + 80 }, ${d3.event.y - self.boundingRect.y + 10})`
                })
                .style("display", "block")
        })
        .on("mouseleave", function(d) {
            //d3.select(`#${self.boundingPanel}toolTip`).style("display", "none")
        })*/

    }

    // Function: Main function
    mergeBarChart() {

        // Initialize everything
        this.initialize()
        
        // Calling the main function
        this.showData(this.data)
    }
}