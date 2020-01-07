let boundingDivNameHist = "bottom_graph_panel_container"
let boundingDivHist = d3.select(`#${boundingDivNameHist}`).style("background-color", "white")
let marginHist = { top: 30, right: 30, bottom: 40, left: 40 };
let widthHist = 300 - marginHist.left - marginHist.right;
let heightHist = 150 - marginHist.top - marginHist.bottom;




var data;
var fileName = "IRIS.csv";
var numericalColumns = [];
// d3.csv("./data/" + fileName, function (data1) {

function  createHistogramCharts(data1,numericalColumns) {


  d3.select("#bottom_graph_panel_histogram_container").selectAll("svg").remove();
  data = data1;
 let x = d3.entries(data[0])
  var valueKey = x.length;
  for (i = 0; i < numericalColumns.length; i++) {

    let xp = 300 * i;
    var panel = d3.select("#bottom_graph_panel_histogram_container")
      .append("svg")
      .attr("id", "abc" + i)
      .attr("width", widthHist + marginHist.left + marginHist.right+10)
      .attr("height", heightHist + marginHist.top + marginHist.bottom+20)
      .attr("transform",
        "translate(" + xp + "," + marginHist.top + ")")
      .append("g")
      .attr("id", "abcd" + i)
      .attr("transform",
        "translate(" + 60 + "," + marginHist.top + ")");

    // numericalColumns.push(x[i].key);
    try {
      this["histogram" + i] = new Histogram(data, numericalColumns[i], marginHist, widthHist, heightHist, i, panel);
      this["histogram" + i].test(this["histogram" + i]);
    }  
    catch (err) {
      console.error(err)
    }
  }

}