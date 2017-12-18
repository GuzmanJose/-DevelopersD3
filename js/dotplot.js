
queue()
	.defer(d3.csv, "data/CountryAndCurrentLanguage.csv", fixdot1)
	.defer(d3.csv, "data/CountryAndFutureLanguage.csv", fixdot2)
	.await(dotplot);

	 	var tooldot = d3.select("div#dotPlot")
	 					.append("div")
	 					.attr("class", "dotToolTip");

function dotplot(error, current, future) {
		
		if (error){
			console.log("Problem with dotplot data");

		}

		var data = d3.merge([current, future]);

		var fullWidth = 1000;
		var fullHeight = 700;

		var margin = {right: 10, left: 100, top: 50, bottom: 150};

		var width = fullWidth - margin.right - margin.left;
		var height = fullHeight - margin.top - margin.bottom;

		var xScale = d3.scale.ordinal()
						.rangeRoundBands([0, width]);

		var yScale = d3.scale.linear()
						.range([height, 0]);

		var xAxis = d3.svg.axis()
					 	.scale(xScale)
					 	.innerTickSize([0])
					 	.tickPadding(20)
					 	.orient("bottom");

	 	var yAxis = d3.svg.axis()
	 					.scale(yScale)
	 					.innerTickSize([0])
	 					.tickPadding(20)
	 					.orient("left");



		var dotPlotsvg = d3.select("#dotPlot")
							.append("svg")
							.attr("width", fullWidth)
							.attr("height", fullHeight)
							.append("g")
							.attr("transform", "translate(" + margin.left + "," + margin.top + ")" );


		dotPlotsvg
				.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")" )
				.call(xAxis)
					.selectAll("text")
					.attr("class", "xAxis_label dotplot")
					.attr("transform", "rotate(-30)")
					.style("text-anchor", "end");

		dotPlotsvg
				.append("g")
				.attr("class", "y axis")
				.call(yAxis)
					.selectAll("text")
					.style("text-anchor", "middle");

		dotPlotsvg
				.append("text")
				.attr("class", "yAxis_label scatter")
				.attr("transform", "rotate(-90) translate(" + (-height/2) + ",0)")
				.attr("text-anchor", "middle")
				.attr("dy", -70)
				.text("Developers");	


	
		var column = d3.select("#selectDot").property("value");

		redraw(data, column);
    
		d3.select("#selectDot").on("change", function() {
					column = d3.select("#selectDot").property("value");
					redraw(data, column);
		});

		function redraw(data, column) {

		var dataset = d3.nest()
					.key(function(d) {
						return d.Country;
					})
					.entries(data);
			
			var topTen = dataset.sort(function(a, b) {
					return +b.values[0][column] - +a.values[0][column];
			}).slice(0,15);
			

			xScale.domain(topTen.map(function(d) { return d.key; } ));

			yScale.domain(d3.extent(data, function(d) {
				return d[column];
			}));




			var linesBetweenDots = dotPlotsvg.selectAll("line.Between")
									.data(topTen, function(d) {
										return d.key;
									});

				linesBetweenDots
					.enter()
					.append("line")
					.attr("stroke-width", 0)
					.attr("class", "Between");
					

				linesBetweenDots
					.exit()
					.remove();		

				linesBetweenDots
					.transition()
					.duration(2000)
					.attr("x1", function(d) {
						return xScale(d.key) + xScale.rangeBand();
					})
					.attr("y1", function(d) {
						return yScale(d.values[0][column]);
					})
					.attr("x2", function(d) {
						return xScale(d.key) + xScale.rangeBand();
					})
					.attr("y2", function(d) {
						return yScale(d.values[1][column]);
					});



			var circles1 = dotPlotsvg.selectAll("circle.dots1")
							.data(topTen, function(d) {
								return d.key;
							});

			circles1
				.enter()
				.append("circle")
				.attr("r", 1)
				.attr("class", "dots1");

			circles1
				.exit()
				.remove();				

			circles1
				.transition()
				.duration(2000)
				.attr("cx", function(d) {
					return xScale(d.key) + xScale.rangeBand();
				})
				.attr("cy", function(d) {
					return yScale(d.values[0][column]);
				})
				.attr("r", 6);

			circles1
				.on("mouseover", mouseOverdot1)
				.on("mouseout", mouseOutdot1);



			var circles2 = dotPlotsvg.selectAll("circle.dots2")
							.data(topTen, function(d) {
								return d.key;
							});

			circles2
			.enter()
			.append("circle")
			.attr("r", 1)
			.attr("class", "dots2");

			circles2
				.exit()
				.remove();				

			circles2
				.transition()
				.duration(2000)
				.attr("cx", function(d) {
					return xScale(d.key) + xScale.rangeBand();
				})
				.attr("cy", function(d) {
					return yScale(d.values[1][column]);
				})
				.attr("r", 6);

			circles2
				.on("mouseover", mouseOverdot2)
				.on("mouseout", mouseOutdot2);


			dotPlotsvg.select(".y.axis")
				.transition()
				.duration(2000)
				.call(yAxis);

			dotPlotsvg.select(".x.axis")
				.transition()
				.duration(2000)
				.call(xAxis)
				.selectAll("text")
				.attr("class", "xAxis_label dotplot")
				.attr("transform", "rotate(-30)")
				.style("text-anchor", "end");

		}  //---> Function Redraw

				function mouseOverdot1(d) {
					$("p.hoverMe").hide();

					d3.select(this)
						.transition()
						.duration(500)
						.attr("r", 10)
						.attr("stroke", "#D6AF0A")
						.attr("stroke-width", 2);

					tooldot
					.html("<p class='dotToolIndex text-center'>" + "<span class='infoDotF'>" + " Present " + "</span>"  + "</p>"  +
						  "<p class='dotToolIndex'>" +  "Country :  "  + "<span class='infoDot'>" + d.key + "," + "</span>"  + "</p>"  +
						  "<p class='dotToolIndex'>" +  "Language :  "  + "<span class='infoDot'>" + column + "," + "</span>"  + "</p>"  +	
						  "<p class='dotToolIndex'>" +  "Currently Using : "    + "<span class='infoDot'>" + d.values[0][column] + "</span>"+ " " + "<i class='fa fa-user' aria-hidden='true'></i>" + "</p>"
						  );
		
				}


				function mouseOutdot1(d) {

					d3.select(this)
						.transition()
						.duration(500)
						.attr("r", 6)
						.attr("stroke-width", 0);

					tooldot
						.html("<p class='dotToolIndex text-center'>" + "<span class='infoDotF'>" + " Time " + "</span>"  + "</p>"  +
							"<p class='dotToolIndex'>" +  "Country :  "  + "<span class='infoDot'>" + " " + "</span>"  + "</p>"  +
						  "<p class='dotToolIndex'>" +  "Language :  "  + "<span class='infoDot'>" + " " + "</span>"  + "</p>"  +	
						  "<p class='dotToolIndex'>" +  "Users : "    + "<span class='infoDot'>" + " " + "</span>"  + "</p>"
						  );
		
				}


				function mouseOverdot2(d) {
					$("p.hoverMe").hide();
					d3.select(this)
						.transition()
						.duration(500)
						.attr("r", 10)
						.attr("stroke", "#D6AF0A")
						.attr("stroke-width", 2);

					tooldot
					.html("<p class='dotToolIndex text-center'>" + "<span class='infoDotF'>" + " Future " + "</span>"  + "</p>"  +
						  "<p class='dotToolIndex'>" +  "Country :  "  + "<span class='infoDot'>" + d.key + "," + "</span>"  + "</p>"  +
						  "<p class='dotToolIndex'>" +  "Language :  "  + "<span class='infoDot'>" + column + "," + "</span>"  + "</p>"  +	
						  "<p class='dotToolIndex'>" +  "Future Users : "    + "<span class='infoDot'>" + d.values[1][column] + "</span>" + " " + "<i class='fa fa-user' aria-hidden='true'></i>" + "</p>"
						  );
		
				}


				function mouseOutdot2(d) {

					d3.select(this)
						.transition()
						.duration(500)
						.attr("r", 6)
						.attr("stroke-width", 0);

					tooldot
						.html("<p class='dotToolIndex text-center'>" + "<span class='infoDotF'>" + " Time " + "</span>"  + "</p>"  +
						  "<p class='dotToolIndex'>" +  "Country :  "  + "<span class='infoDot'>" + " " + "</span>"  + "</p>"  +
						  "<p class='dotToolIndex'>" +  "Language :  "  + "<span class='infoDot'>" + " " + "</span>"  + "</p>"  +	
						  "<p class='dotToolIndex'>" +  "Users : "    + "<span class='infoDot'>" + " " + "</span>"  + "</p>"
						  );
		
				}				



	} //Function Dot Plot	





	function fixdot1(d) {
		d.Dart = +d.Dart;
		d.Go = +d.Go;
		d.f = +d.f;
		d.r = +d.r;
		d.lamp = +d.lamp;	
		d.php = +d.php;
		d.Hadoop = +d.Hadoop;
		d.Haskell = +d.Haskell;
		d.iOS = +d.iOS;
		d.Java = +d.Java;
		d.JavaScript = +d.JavaScript;
		d.Matlab = +d.Matlab;
		d.MongoDB = +d.MongoDB;
		d.Node_js = +d.Node_js;
		d.Objective_C = +d.Objective_C;
		d.Perl = +d.Perl;
		d.sql = +d.sql;
		d.Python = +d.Python;
		d.Redis = +d.Redis;
		d.Ruby = +d.Ruby;
		d.SQL_Server = +d.SQL_Server;
		d.Rust = +d.Rust;
		d.Salesforce = +d.Salesforce;
		d.Scala = +d.Scala;
		d.Sharepoint = +d.Sharepoint;
		d.Spark = +d.Spark;
		d.Swift = +d.Swift;
		d.Visual_Basic = +d.Visual_Basic;
		d.Windows_Phone = +d.Windows_Phone;
        d.Wordpress = +d.Wordpress;
        return d;
	}

	function fixdot2(d) {
		d.Dart = +d.Dart;
		d.Go = +d.Go;
		d.f = +d.f;
		d.r = +d.r;
		d.lamp = +d.lamp;	
		d.php = +d.php;
		d.Hadoop = +d.Hadoop;
		d.Haskell = +d.Haskell;
		d.iOS = +d.iOS;
		d.Java = +d.Java;
		d.JavaScript = +d.JavaScript;
		d.Matlab = +d.Matlab;
		d.MongoDB = +d.MongoDB;
		d.Node_js = +d.Node_js;
		d.Objective_C = +d.Objective_C;
		d.Perl = +d.Perl;
		d.sql = +d.sql;
		d.Python = +d.Python;
		d.Redis = +d.Redis;
		d.Ruby = +d.Ruby;
		d.SQL_Server = +d.SQL_Server;
		d.Rust = +d.Rust;
		d.Salesforce = +d.Salesforce;
		d.Scala = +d.Scala;
		d.Sharepoint = +d.Sharepoint;
		d.Spark = +d.Spark;
		d.Swift = +d.Swift;
		d.Visual_Basic = +d.Visual_Basic;
		d.Windows_Phone = +d.Windows_Phone;
        d.Wordpress = +d.Wordpress;
        return d;
	}
