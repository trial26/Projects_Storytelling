(function() {
	var margin = { top: 30, left: 100, right: 30, bottom: 30},
	height = 400 - margin.top - margin.bottom,
	width = 780 - margin.left - margin.right;

	console.log("Building chart 3");

	var svg = d3.select("#chart-3")
				.append("svg")
				.attr("height", height + margin.top + margin.bottom)
				.attr("width", width + margin.left + margin.right)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	var xPositionScale = d3.scaleLinear().domain([2004,2014]).range([0, width]);
	var yPositionScale = d3.scaleLinear().range([height, 50]);

	var colorScale = d3.scaleOrdinal()
									.domain(['Electricity generation','Transportation','Industry','Agriculture','Commercial','Residential'])
									.range(['pink','blue','green','black','purple','orange']);


	var line = d3.area()
    .x(function(d) {
      return xPositionScale(d.Year);
    })
    .y0(function(d) {
      return yPositionScale(d.Value);
    })
    .y1(height)
    .curve(d3.curveMonotoneX)


	d3.queue()
    .defer(d3.csv, "gg_sector.csv")
    .await(ready);


	function ready(error, datapoints) {

		var minYear = d3.min(datapoints, function(d) { return +d.Year });
		var maxYear = d3.max(datapoints, function(d) { return +d.Year });
		xPositionScale.domain([minYear, maxYear])

		console.log(minYear);

		var minValue =  d3.min(datapoints, function(d) {return +d.Value });
		var maxValue = d3.max (datapoints, function (d){return +d.Value});
		yPositionScale.domain([minValue,maxValue])

		console.log(minValue, ",", maxValue);


		var nested = d3.nest()
			.key(function(d) {
				return d.EconomicSector
			})
			.entries(datapoints)

		console.log("Now we have", nested.length, "data points");
		console.log("It looks like", nested);



		svg.selectAll(".sector-lines")
			.data(nested)
			.enter().append("path")
			.attr("d", function(d) {
				return line(d.values);
			})
			.attr("stroke", "none")
			.attr("fill", function(d) {
				console.log("The nested thing looks like", d);
				return colorScale(d.key);
			})
			.attr("opacity", "0.8")



		svg.selectAll(".country-circle")
			.data(datapoints)
			.enter().append("circle")
			.attr("class", "country-circle")
			.attr("r", 1)
			.attr("fill", function(d) {
				return colorScale(d.EconomicSector);
			})
			.attr("cx", function(d) {
				return xPositionScale(d.Year)
			})
			.attr("cy", function(d) {
				return yPositionScale(d.Value)
			});


			svg.append("circle")
			.attr("r","5")
			.attr("cx",200)
			.attr("cy",0)
			.attr("fill","pink")

			svg.append("text")
				.attr("x", 210)
				.attr("y", 0)
				.attr("font-size", 12)
				.attr("text-anchor","right")
				.text("Electricity");

			svg.append("circle")
			.attr("r","5")
			.attr("cx",200)
			.attr("cy",20)
			.attr("fill","blue")

			svg.append("text")
				.attr("x", 210)
				.attr("y", 20)
				.attr("font-size", 12)
				.attr("text-anchor","right")
				.text("Transportation");

			svg.append("circle")
			.attr("r","5")
			.attr("cx",300)
			.attr("cy",0)
			.attr("fill","green")

			svg.append("text")
				.attr("x", 310)
				.attr("y", 0)
				.attr("font-size", 12)
				.attr("text-anchor","right")
				.text("Industry");

			svg.append("circle")
			.attr("r","5")
			.attr("cx",300)
			.attr("cy",20)
			.attr("fill","black")

			svg.append("text")
				.attr("x", 310)
				.attr("y", 20)
				.attr("font-size", 12)
				.attr("text-anchor","right")
				.text("Agriculture");


			svg.append("circle")
			.attr("r","5")
			.attr("cx",400)
			.attr("cy",0)
			.attr("fill","purple")

			svg.append("text")
				.attr("x", 410)
				.attr("y", 0)
				.attr("font-size", 12)
				.attr("text-anchor","right")
				.text("Commercial");

			svg.append("circle")
			.attr("r","5")
			.attr("cx",400)
			.attr("cy",20)
			.attr("fill","orange")

			svg.append("text")
				.attr("x", 410)
				.attr("y", 20)
				.attr("font-size", 12)
				.attr("text-anchor","right")
				.text("Residential");



		var xAxis = d3.axisBottom(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);
  	}
})();
