/**
 * Issues:
 */

 function makeResizeableContainer(resizerID, resizerDependents) {

    let length = resizerDependents.length
    var resizer = d3.select(`#${resizerID}`);

    makeDragLft()
    makeDragBtm()
    makeDragRit()
    makeDragTop()
    makeDragMid()

    var dragResize = d3.drag()
        .on('drag', function() {

            for(i = 0; i<length; i++){

                let containerElementID = resizerDependents[i][0]
                let classOfElementsToBeDragged = resizerDependents[i][1]
                let direction = resizerDependents[i][2]
                let fixedSide = resizerDependents[i][3]

                let leftTopFixedSideElementID = resizerDependents[i][4]
                let rightBottomFixedSideElementID = resizerDependents[i][5]
                let leftTopFixedSideElement, rightBottomFixedSideElement;
                if(leftTopFixedSideElementID != 0) {
                    leftTopFixedSideElement = d3.select(`#${leftTopFixedSideElementID}`);
                }
                if(rightBottomFixedSideElementID != 0) {
                    rightBottomFixedSideElement = d3.select(`#${rightBottomFixedSideElementID}`);
                }

                var resizable = d3.select(`#${containerElementID}`);

                if(direction == 1) { // Horizontal Resize
                    
                    if(fixedSide == 1) { // left side fixed

                        // Determine resizer position relative to resizable (parent)
                        x = d3.mouse(this.parentNode)[0];

                        // Determine the left and right extremes
                        let leftExtreme = parseInt(leftTopFixedSideElement.style("left"), 10)
                        let rightExtreme = parseInt(rightBottomFixedSideElement.style("left"), 10) + parseInt(rightBottomFixedSideElement.style("width"), 10)
            
                        // Avoid negative or really small widths
                        x = Math.max(leftExtreme + GlobalVariables.minPanelSize, x);
                        x = Math.min(rightExtreme - GlobalVariables.minPanelSize, x);

                        // Check if we have 7th parameter
                        if(resizerDependents[i].length == 7){
                            widthLeftExtremeID = resizerDependents[i][6]
                            widthLeftExtremeElement = d3.select(`#${widthLeftExtremeID}`);
                            widthLeftExtreme = parseInt(widthLeftExtremeElement.style("left"), 10) + parseInt(widthLeftExtremeElement.style("width"), 10)
                            width = x - widthLeftExtreme
                        }
                        else{
                            width = x - leftExtreme
                        }

                        resizable.style('width', width + 'px');
                        resizer.style('left', x + 'px');
                    }
                    else { // right side fixed

                        // Determine resizer position relative to resizable (parent)
                        x = d3.event.x;

                        // Determine the left and right extremes
                        let leftExtreme = parseInt(leftTopFixedSideElement.style("left"), 10)
                        let rightExtreme = parseInt(rightBottomFixedSideElement.style("left"), 10) + parseInt(rightBottomFixedSideElement.style("width"), 10)
            
                        // Avoid negative or really small widths
                        x = Math.max(leftExtreme + GlobalVariables.minPanelSize, x);
                        x = Math.min(x, rightExtreme - GlobalVariables.minPanelSize);

                        // Check if we have 7th parameter
                        if(resizerDependents[i].length == 7){
                            widthRightExtremeID = resizerDependents[i][6]

                            // IN ORDER TO RESOVE AN ISSUE
                            if(containerElementID == widthRightExtremeID) {
                                width = window.innerWidth - x
                            }
                            else {
                                widthRightExtremeElement = d3.select(`#${widthRightExtremeID}`);
                                widthRightExtreme = parseInt(widthRightExtremeElement.style("left"), 10) + parseInt(widthRightExtremeElement.style("width"), 10)
                                width = widthRightExtreme - x
                            }
                        }
                        else{

                            // IN ORDER TO RESOLVE THE ISSUE
                            if(containerElementID == rightBottomFixedSideElementID) {
                                width = window.innerWidth - x
                            }
                            else {
                                width = rightExtreme - x
                            }
                        }

                        resizable.style('left', x + 'px');
                        resizable.style('width', width + 'px');
                        resizer.style('left', x + 'px');
                    }
                }
                else { // vertical Resize

                    if(fixedSide == 1) { // top side fixed

                        // Determine resizer position relative to resizable (parent)
                        y = d3.event.y;

                        // Determine the top and bottom extremes
                        let topExtreme = parseInt(leftTopFixedSideElement.style("top"), 10)
                        let bottomExtreme = parseInt(rightBottomFixedSideElement.style("top"), 10) + parseInt(rightBottomFixedSideElement.style("height"), 10)
            
                        // Avoid negative or really small widths
                        y = Math.max(topExtreme + GlobalVariables.minPanelSize, y);
                        y = Math.min(y, bottomExtreme - GlobalVariables.minPanelSize);

                        // Check if we have 7th parameter
                        if(resizerDependents[i].length == 7){
                            heightTopExtremeID = resizerDependents[i][6];
                            heightTopExtremeElement = d3.select(`#${heightTopExtremeID}`);
                            heightTopExtreme = parseInt(heightTopExtremeElement.style("top"), 10);
                            height = y - heightTopExtreme;
                        }
                        else{
                            height = y - topExtreme;
                        }

                        resizable.style('height', height + 'px');
                        resizer.style('top', y + 'px');
                    }
                    else { // bottom side fixed

                       // Determine resizer position relative to resizable (parent)
                        y = d3.mouse(this.parentNode)[1]

                        // Determine the top and bottom extremes
                        let topExtreme = parseInt(leftTopFixedSideElement.style("top"), 10)
                        let bottomExtreme = parseInt(rightBottomFixedSideElement.style("top"), 10) + parseInt(rightBottomFixedSideElement.style("height"), 10)

                        // Avoid negative or really small widths
                        y = Math.max(topExtreme + GlobalVariables.minPanelSize, y);
                        y = Math.min(y, bottomExtreme - GlobalVariables.minPanelSize);
                        // Check if we have 7th parameter
                        if(resizerDependents[i].length == 7){
                            heightBottomExtremeID = resizerDependents[i][6]
                            
                            // IN ORDER TO RESOLVE AN ISSUE
                            if(containerElementID == heightTopExtremeID){
                                height = window.innerHeight - y
                            }
                            else {
                                heightBottomExtremeElement = d3.select(`#${heightBottomExtremeID}`);
                                heightBottomExtreme = parseInt(heightBottomExtremeElement.style("top"), 10) + parseInt(heightBottomExtremeElement.style("height"), 10)
                                height = heightBottomExtreme - y
                            }
                        }
                        else{

                            // IN ORDER TO RESOLVE AN ISSUE
                            if(containerElementID == rightBottomFixedSideElementID){
                                height = window.innerHeight - y
                            }
                            else{
                                height = bottomExtreme - y;
                            }
                        }

                        resizable.style('top', y + 'px');
                        resizable.style('height', height + 'px');
                        resizer.style('top', y + 'px');
                    }
                }
            }

            makeDragLft()
            makeDragBtm()
            makeDragRit()
            makeDragTop()
            makeDragMid()

        })
        
    resizer.call(dragResize);

}

makeResizeableContainer("resizer", GlobalVariables.resizerDependents)
makeResizeableContainer("resizer2", GlobalVariables.resizer2Dependents)
makeResizeableContainer("resizer3", GlobalVariables.resizer3Dependents)
makeResizeableContainer("resizer4", GlobalVariables.resizer4Dependents)