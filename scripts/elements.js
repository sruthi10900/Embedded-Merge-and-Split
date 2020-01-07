//let svg1 = d3.select(`#${midPanel}_svg`)
let svg2 = d3.select(`#${GlobalVariables.ritPanel}_svg`)

/*let circle = svg1.append("circle")
    .attr("r", "25")
    .attr("class", dragMidPanel)
    .attr("id", "circle1")
    .attr("fill", "red")
    .attr("cx", "25")
    .attr("cy", "25")
*/
let rect = svg2.append("rect")
    .attr("width", "25")
    .attr("class", GlobalVariables.dragRitPanel)
    .attr("id", "rect1")
    .attr("fill", "blue")
    .attr("height", "25")

