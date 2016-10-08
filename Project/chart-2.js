(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 400 - margin.top - margin.bottom,
    width = 780 - margin.left - margin.right;

  var svg = d3.select("#chart-2")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var colorScale = d3.scaleOrdinal().range(['red', 'orange', 'blue','grey'])

  var xPositionScale = d3.scalePoint()
    .domain(['US', 'Global'])
    .range([0, width])
    .padding(0.5);

  var radius = 120;

  var arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(80);

  var labelArc = d3.arc()
      .outerRadius(radius + 10)
      .innerRadius(radius + 10);

  var pie = d3.pie()
    .value(function(d) {
      return d.Value;
    });

  d3.queue()
    .defer(d3.csv, "gas_type.csv")
    .await(ready)

  function ready(error, datapoints) {
    var nested = d3.nest()
      .key(function(d) {
        return d.Region;
      })
      .entries(datapoints);


    var charts = svg.selectAll(".pie-charts")
      .data(nested)
      .enter().append("g")
      .attr("transform", function(d) {
        var yPos = 200
        var xPos = xPositionScale(d.key);
        return "translate(" + xPos + "," + yPos + ")"
      })


    charts.each(function(d) {
        var monthlyData = d.values;
        var g = d3.select(this);

        g.selectAll("path")
          .data(pie(monthlyData))
          .enter().append("path")
          .attr("d", arc)
          .attr("fill", function(d) {
            return colorScale(d.data.Gas);
          })


      })

      charts.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("font-size", 20)
        .text(function(d) {
          return d.key
        })


        svg.append("circle")
        .attr("r","5")
        .attr("cx",300)
        .attr("cy",0)
        .attr("fill","red")

        svg.append("text")
          .attr("x", 310)
          .attr("y", 0)
          .attr("font-size", 12)
          .attr("text-anchor","right")
          .text("Carbon dioxide");

        svg.append("circle")
        .attr("r","5")
        .attr("cx",300)
        .attr("cy",20)
        .attr("fill","orange")

        svg.append("text")
          .attr("x", 310)
          .attr("y", 20)
          .attr("font-size", 12)
          .attr("text-anchor","right")
          .text("Methane");


        svg.append("circle")
        .attr("r","5")
        .attr("cx",400)
        .attr("cy",0)
        .attr("fill","blue")

        svg.append("text")
          .attr("x", 410)
          .attr("y", 0)
          .attr("font-size", 12)
          .attr("text-anchor","right")
          .text("Nitrous oxide");

        svg.append("circle")
        .attr("r","5")
        .attr("cx",400)
        .attr("cy",20)
        .attr("fill","grey")

        svg.append("text")
          .attr("x", 410)
          .attr("y", 20)
          .attr("font-size", 12)
          .attr("text-anchor","right")
          .text("F-gases");

  }
})();
