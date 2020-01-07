/*
Issues:
- Bin is getting splitted when an other bin is simultaneously clicked.
- Drag functionality only for last histogram


Yet to be Done:
 
- Update slider to be added

*/
class Histogram {


    constructor(data, numericalColumns, margin, width, height, id, svg) {
        console.log(width)
        this.data = data;
        this.numericalColumns = numericalColumns;
        this.height = height;
        this.width = width;
        this.id = id;
        this.updatebins = 5;
        this.margin = margin;
        let pos = margin.left + id * 250;
        this.svg = svg;
        this.x = d3.scaleLinear()
            .domain([d3.min(data, function (d) {
                return +d[numericalColumns];
            }), d3.max(data, function (d) {
                return +d[numericalColumns];
            })])
            .range([0, width]);
        this.svg.append("g")
            .attr("id", "HistogramxAxis" + id)

            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.x).ticks(5).tickFormat(function(e){
                if(e > 1000000000){
                    return `${e/1000000000}B`
                }
                if(e > 1000000){
                    return `${e/1000000}M`
                }
                if(e > 1000){
                    return `${e/1000}K`
                }
                return e;
            })
            );
        d3.select(`#HistogramxAxis` + id).selectAll("text").attr("transform", "translate(-10, 10) rotate(-90)")
            .style("text-anchor", "end")
            .style("alignment-baseline", "ideographic")
    }



    // Updating the number of bins
    update(data, nBin, numericalColumns,self=this) {
        var histogram = d3.histogram()
            .value(function (d) { return d[numericalColumns]; })   // I need to give the vector of value
            .domain(self.x.domain())  // then the domain of the graphic
            .thresholds(self.x.ticks(nBin));

        self.bins = histogram(data);
        let data_temp = [];
        let tempDataFormated = [];
        let row = {};
        let row1 = {}
        var i = 0;
        // format the data as per the required bins
        while (i < self.bins.length) {
            row = {}
            row1 = {}
            row['range'] = self.bins[i].x0 + "," + self.bins[i].x1;
            row['value'] = self.bins[i].length;
            data_temp.push(row);
            var a = row.range;
            a = a.replace(/\./g, "_");
            row1['range'] = a;
            row1['value'] = row.value;
            tempDataFormated.push(row1);
            i++;
        }
        self.y = d3.scaleLinear().domain([0, d3.max(data_temp, function (d) { return +d.value; })])

            .range([self.height, 0]);
        self.y.domain([0, d3.max(self.bins, function (d) { return d.length; })]);
        let axisX = self.x;
        let axisY = self.y;

        let u = self.svg.selectAll("rect")
            .data(self.bins);


        self.merge(data_temp, tempDataFormated, self.bins[0].x0, self.bins[0].x1, axisX, axisY,self);

    }
    slider(object, data) {
        //     $(function () {
        //         $("#slider-range-max").slider({
        //             range: "max",
        //             min: 1,
        //             max: 30,

        //             value: 30,
        //             slide: function (event, ui) {
        //                 // $("#bins").val(ui.value);
        //                 var n = $("#slider-range-max").slider("value")

        //                 if (n == 1)
        //                     object.update(data, n);
        //                 else if (n == 2)
        //                     object.update(data, n - 1);
        //                 else
        //                     object.update(data, n);



        //             }
        //         });
        //         // $("#bins").val($("#slider-range-max").slider("value"));
        //     });
    }

    // Drag and split functionality
    merge(data_temp, tempDataFormated, low, high, axisX, axisY,self=this) {
        var i = 0;
        for (i = 0; i < data_temp.length; i++) {
            data_temp[i]["range"].split(',')[0] = +data_temp[i]["range"].split(',')[0];
            self.curElement = +data_temp[i]["range"].split(',')[0];
            if (self.curElement >= low && self.curElement < high) {
                data_temp.splice(i, 1);
                tempDataFormated.splice(i, 1);
                i = i - 1;
            }

        }


        let row = {}
        let row1 = {}
        row['range'] = low + "," + high;
        var count = 0;
        let nc = self.numericalColumns;

        var data_count = d3.nest()
            .key(function (d) {
                return d[nc] >= low && d[nc] < high;
            })

            .rollup(function (leaves) {
                return leaves.length;
            })
            .entries(data);

        data_count.forEach(function (element) {
            if (element.key == "true") {
                count = element.value;
            }

        });


        row['value'] = count
        data_temp.push(row);
        var b = row.range;
        b = b.replace(/\./g, "_");
        row1['range'] = b;
        row1['value'] = row.value;
        tempDataFormated.push(row1);

        let idp = self.id;
        self.svg.selectAll("rect").remove();
        self.svg.select('#bottom_graph_panel_svgyAxisLabel').remove();
        // self.svg.select('#'+idp+'xAxisConfidence').remove();
        
        
        let r = self.svg;
      /*  var brushed = d3.brushX()                    
        .extent([[0, 0], [250, 250]])
        .on("start end", function d() {
            var e = d3.event.selection
            console.log(e);
        });

     d3.select('#abcd0').call(brushed);*/


  

        self.y = d3.scaleLinear().domain([0, d3.max(data_temp, function (d) { return +d.value; })])

            .range([self.height, 0]);
        var yAxis = r.append("g")
            .attr("id", `bottom_graph_panel_svgyAxisLabel`)
            .call(d3.axisLeft(self.y).ticks(4)
                .tickFormat(function (e) {
                    if (Math.floor(e) != e)
                        return
                    if (e > 1000) {
                        return `${e / 1000}K`
                    }
                    if (e > 1000000) {
                        return `${e / 1000000}M`
                    }
                    if (e > 1000000000) {
                        return `${e / 1000000000}B`
                    }
                    return e;
                }));

        axisY = self.y;

        



        var brushed = d3.brushX()                    
        .extent([[0, 0], [230, 80]])
        .on("start end", brushEven);

     r.call(brushed);
	 
	 
	         var bs = "";
            self = this
            function brushEven() {
                var s = d3.event.selection;

  if (d3.event.type === "start"){
    bs = d3.event.selection;
  } else if (d3.event.type === "end"){
    if (bs[0] !== s[0] && bs[1] !== s[1]) {
      console.log('moved both');
    } else if (bs[0] !== s[0]) {
      console.log('moved left');
    } else {
      console.log('moved right');
    }

let extent = s[1]-s[0]

if(extent>200 && extent<=250){
    self.updatebins=1;
    self.update(data, self.updatebins, self.numericalColumns,self);
}
if(extent>150 && extent<=200){
    self.updatebins=5;
    self.update(data, self.updatebins, self.numericalColumns,self);
}
if(extent>100 && extent<=150){
    self.updatebins=10;
    self.update(data, self.updatebins, self.numericalColumns,self);
}
if(extent>50 && extent<=100){
    self.updatebins=15;
    self.update(data, self.updatebins, self.numericalColumns,self);
}
if(extent>0 && extent<=50){
    self.updatebins=20;
    self.update(data, self.updatebins, self.numericalColumns,self);
}

//
  }
            
    }
    // d3.selectAll(".selection").remove();
r=r.append('g');
        self.dataBinding = r.selectAll("rect").data(data_temp);

        i = 0;



        let o = self.height;

        self.dataBinding.enter()
            .append("rect")
            .attr("id", (d, i) =>
                `bottom_graph_panel_svg${tempDataFormated[i]["range"].split(',')[0]}`)
            .attr("fill", "rgb(32,142,183)")
            .attr("transform", function (d, i) {
                let xPos = 0
                xPos = axisX(data_temp[i]["range"].split(',')[0])
                return "translate(" + xPos + "," + axisY(data_temp[i]["value"]) + ")";
            })
            .attr("width", function (d, i) {
                return axisX(data_temp[i]["range"].split(',')[1]) - axisX(data_temp[i]["range"].split(',')[0]);
            })
            .attr("height", function (d, i) {
                return o - axisY(data_temp[i]["value"]);
            })
            .attr("stroke", "black")


        self.dataBinding
            .attr("width", function (d, i) {
                return axisX(data_temp[i]["range"].split(',')[1]) - axisX(data_temp[i]["range"].split(',')[0]);
            })
            .attr("height", function (d, i) {
                return o - axisY(data_temp[i]["value"]);
            })
            .attr("transform", function (d, i) {
                let xPos = 0
                xPos = axisX(data_temp[i]["range"].split(',')[0])
                return "translate(" + xPos + "," + axisY(data_temp[i]["value"]) + ")";
            }).on('click', function (d) {

                r.selectAll("rect")
                .call(drag);
                d3.select(this).style("fill", "rgb(7,77,101)");
            });
        self.dataBinding.exit().remove();

        r.selectAll("rect").on('mouseover', function (d) {

            r.selectAll("rect")
            .call(drag);
            d3.select(this).style("fill", "rgb(7,77,101)");
        })
            .on('mouseout', function (d) {

                r.selectAll("rect").style("fill", "rgb(32,142,183)");
            });

        r.append("text")
            .attr("id", `${self.id}xAxisLabel`)
            .attr("transform",
                "translate(" + (self.width / 2) + " ," +
                (self.height + 1.8*self.margin.top) + ")")
            .style("text-anchor", "middle")
            .style("font-family", "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif")
            .style("font-size", 10)
            .attr("fill", "black")
            .text(nc);

        // Add a confidence circle with xaxis label
        let textLabelWidth = document.getElementById(`${self.id}xAxisLabel`).getBoundingClientRect().width
        r.append("circle")
            .attr("id", `${self.id}xAxisConfidence`)
            .attr("cx", self.width/2 - textLabelWidth/2 - 20)
            .attr("cy", self.height + 1.7*self.margin.top)
            .attr("fill", getConfidenceColors(self.data, self.numericalColumns)[0])
            .attr("stroke", getConfidenceColors(self.data, self.numericalColumns)[1])
            .attr("r", 5)


        r.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - self.margin.left)
            .attr("x", 0 - (self.height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-family", "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif")
            .style("font-size", 10)
            .text("Value");


            let drag = d3.drag().on("start", (d, i, arr) => {
                let targetElement = r.select(`#bottom_graph_panel_svg${tempDataFormated[i]["range"].split(',')[0]}`)
                targetElement.attr("fill", "rgb(7,77,101)")
                let targetHeight = targetElement.attr("height")
                let targetWidth = targetElement.attr("width")
                let targetTransform = targetElement.attr("transform")
    
                r.append("rect")
                    .attr("id", "tempRect")
                    .attr("fill", "red")
                    .attr("stroke", "red")
                    .style("stroke-dasharray", ("3, 3"))
                    .style("stroke-width", "2")
                    .attr("width", targetWidth)
                    .attr("height", targetHeight)
                    .attr("transform", targetTransform)
            })
                .on("drag", (d, i) => {
                    console.log(r.select("#tempRect").attr("fill"))
                    let targetElement = r.select(`#bottom_graph_panel_svg${tempDataFormated[i]["range"].split(',')[0]}`)
    
                    let targetHeight = targetElement.attr("height")
                    let targetWidth = targetElement.attr("width")
                    let temp = axisX(data_temp[i]["range"].split(',')[1]) - axisX(data_temp[i]["range"].split(',')[0]);
                    temp = +temp;
                    targetWidth = +targetWidth;
    
                    let mouseX = d3.event.x
                    let mouseY = d3.event.y
    
                    let nearestCategory = axisX.invert(mouseX);
                    console.log(axisX(data_temp[i]["range"].split(',')[1]));
                    console.log(mouseX);
    
                    if(mouseX<data_temp[i]["range"].split(',')[1]) {
                        console.log("helloo");
                        r.select("#tempRect").attr("width",axisX(data_temp[i]["range"].split(',')[1])-mouseX);
                        r.select("#tempRect").attr("transform", `translate(${mouseX}, ${axisY(data_temp[i]["value"])})`)
                    }
                    else {
                        r.select("#tempRect").attr("width",mouseX-axisX(data_temp[i]["range"].split(',')[0]));
                        r.select("#tempRect").attr("transform", `translate(${axisX(data_temp[i]["range"].split(',')[0])}, ${axisY(data_temp[i]["value"])})`)
                    }
                })
                .on("end", (d, i) => {
                    // let targetElement = svg.select(`#bottom_graph_panel_svg${data_temp[i]["range"].split(',')[0]}`)     
    
                    d3.select("#tempRect").remove()
                    let mouseX = d3.event.x
    self=this
                    let nearestCategory = axisX.invert(mouseX);
                    let j = 0;
                    for (j = 0; j < data_temp.length; j++) {
                        let nearestElementLeft = +data_temp[j]["range"].split(',')[0]
                        let nearestElementRight = +data_temp[j]["range"].split(',')[1]
                        let currentElement = +data_temp[i]["range"].split(',')[0];
                        if (currentElement < nearestElementLeft && nearestCategory >= nearestElementLeft && nearestCategory <= nearestElementRight) {
                            self.merge(data_temp, tempDataFormated, data_temp[i]["range"].split(',')[0], nearestElementRight, axisX, axisY,self);
                            break;
                        }
                        else if (currentElement > nearestElementLeft && nearestCategory >= nearestElementLeft && nearestCategory <= nearestElementRight) {
                            self.merge(data_temp, tempDataFormated, nearestElementLeft, data_temp[i]["range"].split(',')[1], axisX, axisY,self);
                            break;
                        }
                        else if (nearestCategory >= nearestElementLeft && nearestCategory <= nearestElementRight) {
                            self.merge(data_temp, tempDataFormated, nearestElementLeft, Math.round(nearestCategory * 100) / 100, axisX, axisY,self);
                            self.merge(data_temp, tempDataFormated, Math.round(nearestCategory * 100) / 100, nearestElementRight, axisX, axisY,self);
                            break;
                        }
    
                        if (j == data_temp.length - 1) {
                            break;
                        }
                    }
                });
    
    
                
       
    
}
           
    test(object) {
        this.slider(object, data);
        this.update(data, this.updatebins, this.numericalColumns,this);
    }

}