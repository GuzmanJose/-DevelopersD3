
queue()
	.defer(d3.csv, "data/CountryAndIndustry.csv", fix1)
	.defer(d3.csv, "data/CountryAndJobSatisfaction.csv", fix2)
	.defer(d3.csv, "data/CountryScatter.csv", fix3)
	.await(draw);

var tooltipScatter = d3.select("body")
					.append("div")
					.attr("class", "tooltipScatter")
					.style("display", "none");

function draw(error, industry, job, count) {		

	if(error) {
		console.log("error with industry and job data");
	}

	var data = d3.merge([industry, job, count]);	


	var fullWidth = 750;
	var fullHeight = 550;

	var margin = {left: 80, right: 35, top: 50, bottom: 60};

	var width = fullWidth - margin.left - margin.right;
	var height = fullHeight - margin.top - margin.bottom;

	var format = d3.format("g");

	var xScale = d3.scale.linear()
					.range([0, width]);


	var yScale = d3.scale.linear()
					.range([height, 0]);

	var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom")
				.innerTickSize([0])
				.tickPadding(15)
				.tickFormat(format);


	var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left")
				.innerTickSize([0])
				.tickPadding(15)
				.tickFormat(format);


	var scatterSvg = d3.select("#scatter")
						.append("svg")
						.attr("width", fullWidth)
						.attr("height", fullHeight)
						.append("g")
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	scatterSvg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis);

	scatterSvg
			.append("text")
			.attr("class", "xAxis_label scatter")
			.attr("text-anchor", "middle")
			.attr("transform", "translate(" + (width/2) + "," + (height + 25) + ")")
			.attr("dy", 30)
			.text("I love my job");



    scatterSvg.append("g")
    		  .attr("class", "y axis")
    		  .call(yAxis);

    scatterSvg
			.append("text")
			.attr("class", "yAxis_label scatter")
			.attr("transform", "rotate(-90) translate(" + (-height/2) + ",0)")
			.attr("text-anchor", "middle")
			.attr("dy", -60)
			.text("Software Products"); 		  


   	d3.select("button#I_love_my_job").classed("selected", true);	

   			function buttonSelected(button) {
   				var thisButton = d3.select(button);
   				d3.selectAll("button").classed("selected", false);
   				thisButton.classed("selected", true);
   			}	


   	var id = d3.select("button#I_love_my_job").attr('id');
 
	var column = d3.select("#selectScatter").property("value");
	redraw(data, column, id);

	d3.select("#selectScatter").on("change", function() {
		id = d3.selectAll("button.selected").attr('id');
		column = d3.select("#selectScatter").property("value");
		redraw(data, column, id);
	});

	d3.select("button#I_hate_my_job").on("click", function() {
		id = d3.select("button#I_hate_my_job").attr('id');
		column = d3.select("#selectScatter").property("value");
		redraw(data, column, id);
	});

	d3.select("button#I_like_my_job").on("click", function() {
	id = d3.select("button#I_like_my_job").attr('id');
	column = d3.select("#selectScatter").property("value");
	redraw(data, column, id);
	});

	d3.select("button#Somewhere_in_the_middle").on("click", function() {
	id = d3.select("button#Somewhere_in_the_middle").attr('id');
	column = d3.select("#selectScatter").property("value");
	redraw(data, column, id);
	});

	d3.select("button#Dont_like_my_job").on("click", function() {
	id = d3.select("button#Dont_like_my_job").attr('id');
	column = d3.select("#selectScatter").property("value");
	redraw(data, column, id);
	});

	d3.select("button#I_love_my_job").on("click", function() {
		id = d3.select("button#I_love_my_job").attr('id');
		column = d3.select("#selectScatter").property("value");
		redraw(data, column, id);
	});


	function redraw(data, column, id) {

			var dataset = d3.nest()
				.key(function(d) {
				return d.Country;
				})
				.entries(data);
				console.log(dataset);
			var top20 = dataset.sort(function(a, b) {
				return +b.values[0][column] - +a.values[0][column];
				}).slice(0,20);
				console.log(top20);
				xScale.domain(d3.extent(top20, function(d) {
					return d.values[1][id];
				}));

				yScale.domain(d3.extent(top20, function(d) {
					return d.values[0][column];
				}));

				// yScale.domain([0, 100]);

				var circles = scatterSvg.selectAll("circle")
								.data(top20, function(d) {
									return d.key;
								});

				circles
					.enter()
					.append("circle")
					.attr("class", "scatterCircles")
					.attr("r", 0);

				circles
					.exit()
					.transition()
					.attr("r", 0)
					.duration(2000)
					.remove();

				circles
					.sort(function(a, b) {
						return d3.descending(a.values[2].Count, b.values[2].Count);
					})
					.transition()
					.delay(function(d, i) {
						return i * 50
					})
					.duration(2000)
					.attr("cx", function(d) {
						return xScale(d.values[1][id]);
					})
					.attr("cy", function(d) {
						return yScale(d.values[0][column]);
					})
					.attr("r", function(d) {
						return Math.sqrt(d.values[2].Count)/3;
					});
				
				circles
					.on("mouseover", mouseOverScatter)
					.on("mousemove", mouseMoveScatter)
					.on("mouseout", mouseOutScatter);	

				scatterSvg.select(".y.axis")
				  	.transition()
				  	.duration(1000)
				  	.call(yAxis);

				scatterSvg.select(".x.axis")
					.transition()
					.duration(1000)
					.call(xAxis);  	


				scatterSvg.select(".xAxis_label.scatter")
							.text(id.replace(/_/g, " "));

				scatterSvg.select(".yAxis_label.scatter")
							.text(column.replace(/_/i," "));
				


				  	buttonSelected(document.getElementById(id));


		} // function redraw

}    // function draw



function mouseOverScatter(d) {

		d3.select(this).moveToFront();

	var column= d3.select("#selectScatter").property("value");
	var	id = d3.select("button.selected").attr('id');
	var loveHate = id.replace(/_/g, " ");
	var valueColumn = column.replace(/_/g, " ");

		d3.select(this)
			.transition()
			.duration(500)
			.style("fill", "#89DDFF")
			.style("opacity", 1)
			.attr("r", function(d) {
				return Math.sqrt(d.values[2].Count)/2;
			})
			.style("stroke", "#D6AF0A")
			.style("stroke-width", 2);

		tooltipScatter
			.style("display", null)
			.html("<p class='dotToolIndex text-center'>" + "<span class='infoDotF'>" + d.key + "</span>"  + "</p>"  +
				  "<p class='dotToolIndex'>" +  'Developers' + ":  "  + "<span class='infoDot'>" + d.values[2].Count + "," + "</span>"  + "</p>"  +
				  "<p class='dotToolIndex'>" +  loveHate + " :  "  + "<span class='infoDot'>" + d.values[1][id] + "," + "</span>"  + "</p>"  +	
				  "<p class='dotToolIndex'>" + valueColumn + " : "    + "<span class='infoDot'>" + d.values[0][column] + "</span>"  + "</p>"
				  );



}



function mouseMoveScatter(d) {

	tooltipScatter
	    .style("top", (d3.event.pageY - 10) + "px" )
	    .style("left", (d3.event.pageX + 10) + "px");
}

function mouseOutScatter(d) {
		
	d3.select(this)
		.transition()
		.duration(500)
		.style("fill", "#257BC9")
		.style("opacity", .5)
		.attr("r", function(d) {
			return Math.sqrt(d.values[2].Count)/3;
		})
		.style("stroke-width", 0);

	tooltipScatter
		.style("display", "none");	

}

d3.selection.prototype.moveToFront = function() {
	return this.each(function() {
		this.parentNode.appendChild(this);
	});
};



function fix1(d) {
	d.Software_Products = +d.Software_Products;
	d.Web_Services = +d.Web_Services;
	d.Finance_Banking = +d.Finance_Banking;
	d.Internet = +d.Internet;
	d.Consulting = +d.Consulting;
	d.Media_Advertising = +d.Media_Advertising;
	d.Healthcare = +d.Healthcare;
	d.Education = +d.Education;
	d.Telecommunications = +d.Telecommunications;
	d.Manufacturing = +d.Manufacturing;
	d.Government = +d.Government;
	d.Consumer_Products = +d.Consumer_Products;
	d.Retail = +d.Retail;
	d.Gaming = +d.Gaming;
	d.Defense = +d.Defense;
	d.Aerospace = +d.Aerospace;
	d.Non_Profit = +d.Non_Profit;
	d.Student = +d.Student;
	return d;
}


function fix2(d) {
	d.I_love_my_job = +d.I_love_my_job;
	d.I_hate_my_job = +d.I_hate_my_job;
	d.I_like_my_job = +d.I_like_my_job;
	d.Somewhere_in_the_middle = +d.Somewhere_in_the_middle;
	d.Dont_like_my_job = +d.Dont_like_my_job;
	return d;
}


function fix3(d) {
	d.Count = +d.Count;
	return d;
}







