(function() {
  var margin = { top: 30, left: 100, right: 30, bottom: 30},
  height = 400 - margin.top - margin.bottom,
  width = 780 - margin.left - margin.right;

  console.log("Building chart 1");

  var svg = d3.select("#chart-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var colorScale = d3.scaleOrdinal()
	                .domain(["GG","Temp"])
	                .range(["blue","green"]);
  var xPositionScale = d3.scaleLinear().range([50, width-50]);
  var yPositionScale = d3.scaleLinear().domain([6000,7500]).range([height, 20]);
  var y1PositionScale = d3.scaleLinear().domain([45,65]).range([height, 20]);

  var line = d3.line()
    .x(function(d) {
      return xPositionScale(d.Year);
    })
    .y(function(d) {
      return yPositionScale(d.Value);
    })


    var line2 = d3.line()
      .x(function(d) {
        return xPositionScale(d.Year);
      })
      .y(function(d) {
        return y1PositionScale(d.Value);
      })


  d3.queue()
    .defer(d3.csv, "gg_total_us.csv")
    .await(ready);

  function ready(error, datapoints) {

    var minDatetime = d3.min(datapoints, function(d) { return +d.Year });
    var maxDatetime = d3.max(datapoints, function(d) { return +d.Year });
    xPositionScale.domain([minDatetime, maxDatetime])


    var nested = d3.nest()
     .key(function(d) {
       return d.Type
     })
     .entries(datapoints) 

     svg.selectAll(".alcohol-lines")
       .data(nested)
       .enter().append("path")
       .attr("d", function(d) {
         if(d.key == 'GG') {return line(d.values)}

         if(d.key == 'Temp') {return line2(d.values)}
       })
       .attr("class","alcohol-path")
       .attr("fill", "none")
       .attr("stroke-width",2)
       .attr("stroke", function(d) {
         return colorScale(d.key);
       })

       svg.append("circle")
       .attr("r","5")
       .attr("cx",200)
       .attr("cy",0)
       .attr("fill","blue")

       svg.append("text")
         .attr("x", 210)
         .attr("y", 0)
         .attr("font-size", 12)
         .attr("text-anchor","right")
         .text("Greenhouse emissions");

       svg.append("circle")
       .attr("r","5")
       .attr("cx",200)
       .attr("cy",20)
       .attr("fill","green")

       svg.append("text")
         .attr("x", 210)
         .attr("y", 20)
         .attr("font-size", 12)
         .attr("text-anchor","right")
         .text("Temperature");

       svg.append("text")
         .attr("x", 40)
         .attr("y", 0)
         .attr("font-size", 12)
         .attr("text-anchor","middle")
         .text("Greenhouse emissions");

       svg.append("text")
         .attr("x", width-50)
         .attr("y", 0)
         .attr("font-size", 12)
         .attr("text-anchor","middle")
         .text("Temperature");

      var xAxis = d3.axisBottom(xPositionScale);
      svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      var yAxis = d3.axisLeft(yPositionScale);
      svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(" + (50) + ",0)")
        .call(yAxis);

      var y1Axis = d3.axisRight(y1PositionScale);
      svg.append("g")
        .attr("class", "axis y1-axis")
        .attr("transform", "translate(" + (width-50) + ",0)")
        .call(y1Axis);
    }
})();
