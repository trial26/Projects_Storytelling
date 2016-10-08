(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 450 - margin.top - margin.bottom,
    width = 1080 - margin.left - margin.right;

  
  var svg = d3.select("#chart-4")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xPositionScale = d3.scalePoint()
                      .domain([1990,2014])
                      .range([0, width])
                      .padding(0.5);

  var radius = 120;


  var radiusScale = d3.scaleLinear()
    .domain([25, 85])
    .range([30, radius]);

  var tScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, radius]);

  var angleScale = d3.scalePoint()
    .domain(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Blah'])
    .range([0, Math.PI * 2]);

  var radialArea = d3.radialArea()
    .angle(function(d) {
      return angleScale(d.month)
    })
    .innerRadius(function(d) {
      return radiusScale(d.min);
    })
    .outerRadius(function(d){
      return radiusScale(d.max)
    })


  d3.queue()
    .defer(d3.csv, "minmax.csv")
    .await(ready)

  function ready(error, datapoints) {

  var nested = d3.nest()
    .key(function(d) {
      return d.year;
    })
    .entries(datapoints);

  var charts = svg.selectAll(".radial-charts")
    .data(nested)
    .enter().append("g")
    .attr("transform", function(d) {
      var yPos = 150
      var xPos = xPositionScale(d.key);
      return "translate(" + xPos + "," + yPos + ")"
    });

  charts.each(function(d) {

    var g = d3.select(this);
    var pathData = d.values;

    pathData.push(pathData[0]);


    g.selectAll("circle")
      .data([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
      .enter().append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", function(d) {
        return radiusScale(d)
      })
      .attr("fill", "none")
      .attr("stroke", "lightgrey")

      g.append("path")
        .datum(pathData)
        .attr("d", radialArea)
        .attr("fill", "pink")
        .attr("stroke","red");

      g.selectAll(".temp")
        .data([20,40,60,80])
        .enter().append("text")
        .attr("y", function(d) {
          return -radiusScale(d)-5
        })
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .text(function(d){
          return d
        })

      g.selectAll(".months")
        .data(datapoints)
        .enter().append("text")
        .attr("x", function(d) {
          var a = angleScale(d.month);
          return (radius + 30) * Math.sin(a);
        })
        .attr("y", function(d) {
          var a = angleScale(d.month);
          return (radius + 30) * Math.cos(a) * -1;
        })
        .attr("font-size", 12)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .text(function(d) {
          return d.month;
        })


    })


    charts.append("text")
      .attr("x", 0)
      .attr("y", 200)
      .attr("text-anchor", "middle")
      .text(function(d) {
        return d.key
      })

  }
})();
