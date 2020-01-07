
var margin = { top: 10, right: 30, bottom: 30, left: 40 };
var width = 460 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var svg = d3.select("#bottom_graph_panel")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var categ = "sepal_length";
var fileName = "IRIS.csv";

d3.csv("./data/" + fileName, function (data) {

    var x = d3.scaleLinear()
        .domain([d3.min(data, function (d) {
            return +d[categ];
        }), d3.max(data, function (d) {
            return +d[categ];
        })])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));


    // $( function() {
    //     $( "#rect" ).draggable({
    // axis: "x",
    // start: function(event, ui) {
    // start = ui.position.left;
    // },
    // stop: function(event, ui) {
    // stop = ui.position.left;
    // console.log('has moved ' + ((start < stop) ? 'right':'left'))
    // }
    // }).resizable();
    //   } );


    $(function () {
        $("#slider-range-max").slider({
            range: "max",
            min: 1,
            max: 30,

            value: 30,
            slide: function (event, ui) {
                // $("#bins").val(ui.value);
                var n = $("#slider-range-max").slider("value")
                if (n == 1)
                    update(n);
                else if (n == 2)
                    update(n - 1);
                else
                    update(n);

            }
        });
        // $("#bins").val($("#slider-range-max").slider("value"));
    });



    function update(nBin) {


        var histogram = d3.histogram()
            .value(function (d) { return d[categ]; })   // I need to give the vector of value
            .domain(x.domain())  // then the domain of the graphic
            .thresholds(x.ticks(nBin));

        var bins = histogram(data);
        let data_temp = [];
        let temp1 = [];
        var i = 0;
        while (i < bins.length) {
            row = {}
            row1 = {}
            row['range'] = bins[i].x0 + "," + bins[i].x1;
            row['value'] = bins[i].length;
            data_temp.push(row);
            var a = row.range;
            a = a.replace(/\./g, "_");
            // a=a.replace(".","_")
            row1['range'] = a;
            row1['value'] = row.value;
            temp1.push(row1);
            i++;
        }
        var y = d3.scaleLinear().domain([0, d3.max(data_temp, function (d) { return +d.value; })])

            .range([height, 0]);
        var yAxis = svg.append("g")
            .attr("id", `bottom_graph_panel_svgyAxisLabel`)
            .call(d3.axisLeft(y));
        y.domain([0, d3.max(bins, function (d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
        yAxis
            .transition()
            .duration(1000)
            .call(d3.axisLeft(y));

        var u = svg.selectAll("rect")
            .data(bins);

        // Manage the existing bars and eventually the new ones:
        u
            .enter()
            .append("rect") // Add a new rect for each new elements
            .merge(u) // get the already existing elements as well
            .transition() // and apply changes to all of them
            .duration(1000)
            .attr("x", 1)
            .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1; })
            .attr("height", function (d) { return height - y(d.length); })
            .style("fill", "#69b3a2");


        // If less bar in the new histogram, I delete the ones not in use anymore
        u
            .exit()
            .remove();



        // merge(100,150);


        function merge(low, high) {
            for (i = 0; i < data_temp.length; i++) {
                data_temp[i]["range"].split(',')[0] = +data_temp[i]["range"].split(',')[0];
                p = +data_temp[i]["range"].split(',')[0];
                if (p >= low && p < high) {
                    data_temp.splice(i, 1);
                    temp1.splice(i, 1);
                    i = i - 1;
                }

            }
            row = {}
            row1 = {}
            row['range'] = low + "," + high;
            var count = 0;
            for (i = 0; i < data.length; i++) {
                var a = +data[i][categ];
                if (a >= low && a < high) {
                    count++;
                }
                if (a == d3.max(data, function (d) {
                    return +d[categ];
                }) && a >= low && a <= high) {
                    count++;
                }


            }
            row['value'] = count;
            data_temp.push(row);
            var b = row.range;
            b = b.replace(/\./g, "_");
            row1['range'] = b;
            row1['value'] = row.value;
            temp1.push(row1);

            console.log(data_temp);

            svg.selectAll("rect").remove();
            svg.selectAll('#bottom_graph_panel_svgyAxisLabel').remove();

            var y = d3.scaleLinear().domain([0, d3.max(data_temp, function (d) { return +d.value; })])

                .range([height, 0]);
            var yAxis = svg.append("g")
                .attr("id", `bottom_graph_panel_svgyAxisLabel`)
                .call(d3.axisLeft(y));

            let drag = d3.drag().on("start", (d, i, arr) => {
                console.log(data_temp);

                let targetElement = svg.select(`#bottom_graph_panel_svg${temp1[i]["range"].split(',')[0]}`)
                targetElement.attr("fill", "red")
                let targetHeight = targetElement.attr("height")
                let targetWidth = targetElement.attr("width")
                let targetTransform = targetElement.attr("transform")

                svg
                    .append("rect")
                    .attr("id", "tempRect")
                    .attr("fill", "none")
                    .attr("stroke", "red")
                    .style("stroke-dasharray", ("3, 3"))
                    .style("stroke-width", "2")
                    .attr("width", targetWidth)
                    .attr("height", targetHeight)
                    .attr("transform", targetTransform)
            }).on("drag", (d, i) => {
                let targetElement = svg.select(`#bottom_graph_panel_svg${temp1[i]["range"].split(',')[0]}`)


                let targetHeight = targetElement.attr("height")
                let targetWidth = targetElement.attr("width")
                let temp = x(data_temp[i]["range"].split(',')[1]) - x(data_temp[i]["range"].split(',')[0]);
                console.log(temp);
                temp = +temp;
                targetWidth = +targetWidth;


                let mouseX = d3.event.x
                let mouseY = d3.event.y

                targetElement.attr("width");

                targetElement.attr("transform", `translate(${x(data_temp[i]["range"].split(',')[0])}, ${y(data_temp[i]["value"])})`)

            }).on("end", (d, i) => {
                // let targetElement = svg.select(`#bottom_graph_panel_svg${data_temp[i]["range"].split(',')[0]}`)     


                d3.select("#tempRect").remove()
                let mouseX = d3.event.x

                let nearestCategory = x.invert(mouseX);
                for (j = 0; j < data_temp.length; j++) {
                    let nearestElementLeft = +data_temp[j]["range"].split(',')[0]
                    let nearestElementRight = +data_temp[j]["range"].split(',')[1]
                    let currentElement = +data_temp[i]["range"].split(',')[0];
                    if (currentElement < nearestElementLeft && nearestCategory >= nearestElementLeft && nearestCategory <= nearestElementRight) {
                        merge(data_temp[i]["range"].split(',')[0], nearestElementRight);
                        break;
                    }
                    else if (currentElement > nearestElementLeft && nearestCategory >= nearestElementLeft && nearestCategory <= nearestElementRight) {
                        merge(nearestElementLeft, data_temp[i]["range"].split(',')[1]);
                        break;
                    }
                    else if (nearestCategory >= nearestElementLeft && nearestCategory <= nearestElementRight) {
                        merge(nearestElementLeft, Math.round(nearestCategory * 100) / 100);
                        merge(Math.round(nearestCategory * 100) / 100, nearestElementRight);
                        break;
                    }

                    if (j == data_temp.length - 1) {
                        break;
                    }
                }
                // targetElement.attr("fill","blue")
                // merge(data_temp[i]["range"].split(',')[0],data_temp[i]["range"].split(',')[1]);
            });

            //     function update(nBin) {
            //         console.log("heellooooo");
            //   // set the parameters for the histogram
            //    histogram 
            //       .value(function(d) { return d[categ]; })   // I need to give the vector of value
            //       .domain(x.domain())  // then the domain of the graphic
            //       .thresholds(x.ticks(nBin)); // then the numbers of bins
            //       console.log("heellooooo2");
            //   // And apply this function to data to get the bins


            //   // Y axis: scale and draw:

            //       y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
            //       console.log("heellooooo3");
            //       svg.append("g")
            //       .call(d3.axisLeft(y));
            //       console.log("heellooooo4");

            //       bins = histogram(data);

            //  // append the bar rectangles to the svg element
            //  let bind= svg.selectAll("rect")
            //       .data(bins)

            //       bind.enter()
            //       .append("rect")
            //         .attr("x", 1)
            //         .attr("id", (d,i) => `bottom_graph_panel_svg${i}`)
            //         .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            //         .attr("width", function(d) { return x(d.x1) - x(d.x0) ; })
            //         .attr("height", function(d) { return height - y(d.length); })

            //         .style("fill", "#69b3a2")
            //         .on('click', function(d){
            //             d3.selectAll("rect").style("fill", "#69b3a2");
            //             // .call(drag);
            //             d3.select(this).style("fill","red");
            //         })

            //         .style("fill", "green");  

            //         bind
            //       .append("rect")
            //         .attr("x", 1)
            //         .attr("id", (d,i) => `bottom_graph_panel_svg${i}`)
            //         .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            //         .attr("width", function(d) { return x(d.x1) - x(d.x0) ; })
            //         .attr("height", function(d) { return height - y(d.length); })

            //         .style("fill", "#69b3a2")
            //         .on('click', function(d){
            //             d3.selectAll("rect").style("fill", "#69b3a2");
            //             // .call(drag);
            //             d3.select(this).style("fill","red");
            //         })

            //         .style("fill", "green"); 

            //         bind.exit().remove();


            // update(10);

            dataBinding = svg.selectAll("rect").data(data_temp);

            console.log(temp1);

            dataBinding.enter()
                .append("rect")
                .attr("id", (d, i) =>
                    `bottom_graph_panel_svg${temp1[i]["range"].split(',')[0]}`)
                .attr("fill", "blue")
                .attr("width", function (d, i) {
                    return x(data_temp[i]["range"].split(',')[1]) - x(data_temp[i]["range"].split(',')[0]);
                })
                .attr("height", function (d, i) {
                    return height - y(data_temp[i]["value"]);
                })
                .attr("transform", function (d, i) {
                    let xPos = 0
                    xPos = x(data_temp[i]["range"].split(',')[0])
                    return "translate(" + xPos + "," + y(data_temp[i]["value"]) + ")";
                }).on('click', function (d) {
                    svg.selectAll("rect").style("fill", "#69b3a2")
                        .call(drag);
                    d3.select(this).style("fill", "red");
                });

            dataBinding
                .append("rect")
                .attr("id", (d, i) => `bottom_graph_panel_svg${temp1[i]["range"].split(',')[0]}`)
                .attr("fill", "blue")
                .attr("width", function (d, i) {
                    return x(data_temp[i]["range"].split(',')[1]) - x(data_temp[i]["range"].split(',')[0]);
                })
                .attr("height", function (d, i) {
                    return height - y(data_temp[i]["value"]);
                })
                .attr("transform", function (d, i) {
                    let xPos = 0
                    xPos = x(data_temp[i]["range"].split(',')[0])
                    return "translate(" + xPos + "," + y(data_temp[i]["value"]) + ")";
                }).on('click', function (d) {
                    d3.selectAll("rect").style("fill", "#69b3a2")
                        .call(drag);
                    d3.select(this).style("fill", "red");
                });

            dataBinding.exit().remove();
        }
        merge(bins[0].x0, bins[0].x1);

    }

    update(10);

})
