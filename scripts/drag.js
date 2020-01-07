function makeDragLft() {
    let drg = document.getElementById(GlobalVariables.lftPanel).getBoundingClientRect();

    let elementsToBeDragged = d3.selectAll(`.${GlobalVariables.dragLftPanel}`)

    elementsToBeDragged.on("mouseover", function() {

        elementToBeDragged = d3.select(this)
        
        dragObject = d3.drag()
                .on("start", function() {
                    elementToBeDragged.raise().attr("stroke", "black");
                })
                .on("drag", function() {
                    
                    let tagName = elementToBeDragged.node().tagName

                    let xLocation = d3.event.x
                    let yLocation = d3.event.y
                    
                    xLocation = Math.max(0, xLocation)
                    xLocation = Math.min(xLocation, drg.width)

                    yLocation = Math.max(0, yLocation)
                    yLocation = Math.min(yLocation, drg.height)

                    if(tagName.toLowerCase() == "circle") {
                        elementToBeDragged.attr("cx", xLocation).attr("cy", yLocation);
                    }
                    else if(tagName.toLowerCase() == "rect") {
                        elementToBeDragged.attr("x", xLocation).attr("y", yLocation);
                    }
                })
                .on("end", function() {
                    elementToBeDragged.attr("stroke", null);
                });

        elementToBeDragged.call(dragObject);
    })
}


function makeDragBtm() {
    let drg = document.getElementById(GlobalVariables.btmPanel).getBoundingClientRect();

    let elementsToBeDragged = d3.selectAll(`.${GlobalVariables.dragBtmPanel}`)

    elementsToBeDragged.on("mouseover", function() {

        elementToBeDragged = d3.select(this)
        
        dragObject = d3.drag()
                .on("start", function() {
                    elementToBeDragged.raise().attr("stroke", "black");
                })
                .on("drag", function() {
                    
                    let tagName = elementToBeDragged.node().tagName

                    let xLocation = d3.event.x
                    let yLocation = d3.event.y
                    
                    xLocation = Math.max(0, xLocation)
                    xLocation = Math.min(xLocation, drg.width)

                    yLocation = Math.max(0, yLocation)
                    yLocation = Math.min(yLocation, drg.height)

                    if(tagName.toLowerCase() == "circle") {
                        elementToBeDragged.attr("cx", xLocation).attr("cy", yLocation);
                    }
                    else if(tagName.toLowerCase() == "rect") {
                        elementToBeDragged.attr("x", xLocation).attr("y", yLocation);
                    }
                })
                .on("end", function() {
                    elementToBeDragged.attr("stroke", null);
                });

        elementToBeDragged.call(dragObject);
    })
}

function makeDragRit() {
    let drg = document.getElementById(GlobalVariables.ritPanel).getBoundingClientRect();

    let elementsToBeDragged = d3.selectAll(`.${GlobalVariables.dragRitPanel}`)

    elementsToBeDragged.on("mouseover", function() {

        elementToBeDragged = d3.select(this)
        
        dragObject = d3.drag()
                .on("start", function() {
                    elementToBeDragged.raise().attr("stroke", "black");
                })
                .on("drag", function() {
                    
                    let tagName = elementToBeDragged.node().tagName

                    let xLocation = d3.event.x
                    let yLocation = d3.event.y
                    
                    xLocation = Math.max(0, xLocation)
                    xLocation = Math.min(xLocation, drg.width)

                    yLocation = Math.max(0, yLocation)
                    yLocation = Math.min(yLocation, drg.height)

                    if(tagName.toLowerCase() == "circle") {
                        elementToBeDragged.attr("cx", xLocation).attr("cy", yLocation);
                    }
                    else if(tagName.toLowerCase() == "rect") {
                        elementToBeDragged.attr("x", xLocation).attr("y", yLocation);
                    }
                })
                .on("end", function() {
                    elementToBeDragged.attr("stroke", null);
                });

        elementToBeDragged.call(dragObject);
    })
}

function makeDragTop() {
    let drg = document.getElementById(GlobalVariables.topPanel).getBoundingClientRect();

    let elementsToBeDragged = d3.selectAll(`.${GlobalVariables.dragTopPanel}`)

    elementsToBeDragged.on("mouseover", function() {

        elementToBeDragged = d3.select(this)
        
        dragObject = d3.drag()
                .on("start", function() {
                    elementToBeDragged.raise().attr("stroke", "black");
                })
                .on("drag", function() {
                    
                    let tagName = elementToBeDragged.node().tagName

                    let xLocation = d3.event.x
                    let yLocation = d3.event.y
                    
                    xLocation = Math.max(0, xLocation)
                    xLocation = Math.min(xLocation, drg.width)

                    yLocation = Math.max(0, yLocation)
                    yLocation = Math.min(yLocation, drg.height)

                    if(tagName.toLowerCase() == "circle") {
                        elementToBeDragged.attr("cx", xLocation).attr("cy", yLocation);
                    }
                    else if(tagName.toLowerCase() == "rect") {
                        elementToBeDragged.attr("x", xLocation).attr("y", yLocation);
                    }
                })
                .on("end", function() {
                    elementToBeDragged.attr("stroke", null);
                });

        elementToBeDragged.call(dragObject);
    })
}

function makeDragMid() {
    let drg = document.getElementById(GlobalVariables.midPanel).getBoundingClientRect();

    let elementsToBeDragged = d3.selectAll(`.${GlobalVariables.dragMidPanel}`)

    elementsToBeDragged.on("mouseover", function() {

        elementToBeDragged = d3.select(this)
        
        dragObject = d3.drag()
                .on("start", function() {
                    elementToBeDragged.raise().attr("stroke", "black");
                })
                .on("drag", function() {
                    
                    let tagName = elementToBeDragged.node().tagName

                    let xLocation = d3.event.x
                    let yLocation = d3.event.y
                    
                    xLocation = Math.max(0, xLocation)
                    xLocation = Math.min(xLocation, drg.width)

                    yLocation = Math.max(0, yLocation)
                    yLocation = Math.min(yLocation, drg.height)

                    if(tagName.toLowerCase() == "circle") {
                        elementToBeDragged.attr("cx", xLocation).attr("cy", yLocation);
                    }
                    else if(tagName.toLowerCase() == "rect") {
                        elementToBeDragged.attr("x", xLocation).attr("y", yLocation);
                    }
                })
                .on("end", function() {
                    elementToBeDragged.attr("stroke", null);
                });

        elementToBeDragged.call(dragObject);
    })
}