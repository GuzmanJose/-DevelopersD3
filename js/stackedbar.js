d3.csv("data/CountryAndCompensation.csv", stackedBar);

var tooltipStacked = d3.select("body")
					.append("div")
					.attr("class", "tooltipStacked")
					.style("display", "none");



function stackedBar(error, data) {
		if (error) {
			console.log("Error on Country And Compensation")
		}

		var colours = ['#FD526F', '#DD4060', '#9A1D5B', '#6E3660', '#361D53', '#3A4187'];

		

		var stack = d3.layout.stack();

		var fullWidth = 1000;
		var fullHeight = 700;

		var margin = {top: 10, bottom: 200, right: 10, left: 100};

		var width = fullWidth - margin.left - margin.right;
		var height = fullHeight - margin.top - margin.bottom;

		var xScale = d3.scale.ordinal()
				.rangeRoundBands([0, width], .1);


		var yScale = d3.scale.linear()
				.range([height, 0]);

		var colorScale = d3.scale.linear()
						.range(colours);

		var xAxis = d3.svg.axis()  
					.scale(xScale)
					.innerTickSize([0])
					.tickPadding(20)
					.orient("bottom");

		var yAxis = d3.svg.axis()  
					.scale(yScale)
					.innerTickSize([0])
					.tickPadding(25)
					.orient("left");

		var stackBar = d3.select("#stackedGraph")
					.append("svg")
					.attr("height", fullHeight)
					.attr("width", fullWidth)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			stackBar
					.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")" )
					.call(xAxis)
						.selectAll("text")
						.attr("dy", ".5em")
						.attr("class", "xAxis_label stackbar")
						.attr("transform", "rotate(-30)")
						.style("text-anchor", "end");


			stackBar
					.append("text")
					.attr("class", "yAxis_label scatter")
					.attr("transform", "rotate(-90) translate(" + (-height/2) + ",0)")
					.attr("text-anchor", "middle")
					.attr("dy", -70)
					.text("Developers");			

			stackBar
					.append("g")
					.attr("class", "y axis")
					.call(yAxis)
						.selectAll("text")
						.attr("dy", ".5em")
						.style("text-anchor", "middle");



		var layerCount;
		
		d3.select("button#Less_than_twentyK").classed("selected1", true);

		function buttonSelected(button) {
			var thisButton = d3.select(button);
			d3.selectAll("button").classed("selected1", false);
			thisButton.classed("selected1", true);
		}

		var money = d3.select("button#Less_than_twentyK").attr('id');
		redraw(money);

		d3.select("button#More_than_HsixtyK").on("click", function() {
		var	radiobtn = document.getElementById('grouped');
		 	radiobtn.checked = true;
			money = d3.select("button#More_than_HsixtyK").attr('id');
			redraw(money);
		});

		d3.select("button#Less_than_twentyK").on("click", function() {
		var	radiobtn = document.getElementById('grouped');
		 	radiobtn.checked = true;
			money = d3.select("button#Less_than_twentyK").attr('id');
			redraw(money);
		});

		var legendNewNames = [];

		var occupationslegend = d3.keys(data[0]).filter(function(key) {
						if (key === "Rather_not_Say") {
								legendNewNames.push("Rather not say");
							}
						if (key === "Unemployed") {
								legendNewNames.push("Unemployed");
							}
						if (key === "Less_than_twentyK") {
								legendNewNames.push("Less Than $20,000");
							}
						if (key === "twentyK_fortyK") {
								legendNewNames.push("$20,000 to $40,000");
							}
						if (key === "fortyK_sixtyK") {
								legendNewNames.push("$40,000 to $60,000");
							}
						if (key === "sixtyK_eightyK") {
								legendNewNames.push("$60,000 to $80,000");
							}
						if (key === "eightyK_hundredK") {
								legendNewNames.push("$80,000 to $ 100,000");
							}
						if (key === "hundredK_HtwentyK") {
								legendNewNames.push("$100,000 to $120,000");
							}
						if (key === "HtwentyK_HfortyK") {
								legendNewNames.push("$120,000 to $140,000");
							}
						if (key === "HfortyK_HsixtyK") {
								legendNewNames.push("$140,000 to $160,000");
							}
						if (key === "More_than_HsixtyK") {
								legendNewNames.push("More Than $160,000");
							}	
							return key !== "Country";
		});

			legend(legendNewNames);


	function redraw(money) {
			
		var topTen = data.sort(function(a, b) {
					return b[money] - a[money];
		}).slice(0, 10);

		var occupations = d3.keys(topTen[0]).filter(function(key) { 
							return key !== "Country";
		});

		layerCount = occupations.length;

		colorScale.domain(d3.range(occupations.length));

		var dataToStack = occupations.map(function(occupation) {
							return topTen.map(function(d) {
								return {x: d.Country, y: +d[occupation], compensation: occupation};
							})
		});


		var layers = stack(dataToStack);

		var yGroupMax =  d3.max(layers, function(layer) {
								return d3.max(layer, function(d) {
									return d.y;
								});
								});

		var yStackMax = d3.max(layers, function(layer) {
								return d3.max(layer, function(d) {
									return d.y0 + d.y;
								});
								});

		xScale.domain(topTen.map(function(d) {
			return d.Country;
		}));

		yScale.domain([0, yStackMax]);

		var layer = stackBar.selectAll(".layer.stacked")
					.data(layers);

			layer		
				.enter()
				.append("g")
				.attr("class", "layer stacked")
				.style("fill", function(d, i) {
					return colorScale(i);
				});

			layer
				.exit()
				.transition()
				.duration(2500)
				.remove();

		var rect = layer.selectAll("rect")
						.data(function(d) {
							return d;
						});

					rect
						.enter()
						.append("rect")
						.attr("x", function(d) {
							return xScale(d.x);
						})
						.attr("y", height)
						.attr("width", xScale.rangeBand())
						.attr("height", 0);

					rect
						.exit()
						.transition()
						.duration(2500)
						.remove();

					rect
					 	.transition()
					 	.delay(function(d, i) {
					 		return i * 10;
					 	})
					 	.attr("y", function(d) {
					 		return yScale(d.y0 + d.y);
					 	});

				 	rect
				 		.on("mouseover", mouseOverStack)
				 		.on("mousemove", mouseMoveStack)
				 		.on("mouseout", mouseOutStack);

					stackBar.select(".y.axis")
						.transition()
						.duration(2500)
						.call(yAxis);

					stackBar.select(".x.axis")
						.transition()
						.duration(2500)
						.call(xAxis)
						.selectAll("text")
						.attr("dy", ".5em")
						.attr("class", "xAxis_label stackbar")
						.attr("transform", "rotate(-30)")
						.style("text-anchor", "end");   			



		 			d3.selectAll("input").on("change", change);

		 			transitionGrouped();

		 			function change() {
		 				if (this.value === "grouped") {
		 					transitionGrouped();
		 				}
		 				else {
		 					transitionStacked();
		 				}
		 			}

		 			function transitionGrouped() {
		 					yScale.domain([0, yGroupMax]);

		 				rect
		 					.transition()
		 					.duration(500)
		 					.delay(function(d, i) {
		 						return i * 10;
		 					})
		 					.attr("x", function(d, i, j) {
		 						return xScale(d.x) + xScale.rangeBand() / layerCount * j;
		 					})
		 					.attr("width", xScale.rangeBand() / layerCount)
	 						.transition()
		 					.attr("y", function(d) {
		 						return yScale(d.y); 
		 					})
		 					.attr("height", function(d) { 
		 						return height - yScale(d.y); 
		 					});

						stackBar.select(".y.axis")
							.transition()
							.duration(1000)
							.call(yAxis);


		 			}

		 			function transitionStacked() {
		 				yScale.domain([0, yStackMax]);

		 				rect
		 					.transition()
		 					.duration(500)
		 					.delay(function(d, i) {
		 						return i * 10;
		 					})
		 					.attr("y", function(d) {
		 						return yScale(d.y0 + d.y);
		 					})
		 					.attr("height", function(d) {
		 						return yScale(d.y0) - yScale(d.y0 + d.y);
		 					})
	 					.transition()
	 						.attr("x", function(d) {
	 							return xScale(d.x);
	 						})
	 						.attr("width", xScale.rangeBand());

						stackBar.select(".y.axis")
							.transition()
							.duration(1000)
							.call(yAxis);


		 			}	

		 			
		 		buttonSelected(document.getElementById(money));	

	} // ----> function redraw


	function legend(occupations) {

 				var adjustX = 5;
 				var legendSvg = d3.select("#stackLegend")
 								.append("svg")
 								.attr("height", 300)
								.attr("width", fullWidth/3)
								.append("g")
								.attr("transform", "translate(" + margin.right + "," + margin.top + ")");

		 				var legend = legendSvg.selectAll(".legend.stackedBar")
		 						.data(occupations);

	 						legend
		 						.enter()
		 						.append("g")
		 						.attr("class", "legend stackedBar")
		 						.attr("transform", function(d, i) { return "translate(0," + i * 25 + ")"; });

	 						legend
	 							.append("rect")
	 							.attr("x", adjustX)
	 							.attr("width", 18)
	 							.attr("height", 18)
	 							.style("fill", function(d, i) { return colorScale(i)});

 							legend
 								.append("text")
 								.attr("x", adjustX+25)
 								.attr("y", 9)
						        .attr("dy", ".35em")
						        .style("text-anchor", "start")
						        .text(function(d, i) {      		
						        	return occupations[i]; 
						        });


		 			} // ----> Legend

} // ----> function stackedBar




	function mouseOverStack(d) {

			if (d.compensation == "Rather_not_Say") {
				d.compensation = "Rather not say";
			}
			if (d.compensation === "Unemployed") {
				d.compensation = "Unemployed";
			}
			if (d.compensation === "Less_than_twentyK") {
					d.compensation = "Less Than $20,000";
			}
			if (d.compensation === "twentyK_fortyK") {
					d.compensation = "$20,000 to $40,000";
			}
			if (d.compensation === "fortyK_sixtyK") {
					d.compensation = "$40,000 to $60,000";
			}
			if (d.compensation === "sixtyK_eightyK") {
					d.compensation = "$60,000 to $80,000";
			}
			if (d.compensation === "eightyK_hundredK") {
					d.compensation = "$80,000 to $ 100,000";
			}
			if (d.compensation === "hundredK_HtwentyK") {
					d.compensation = "$100,000 to $120,000";
			}
			if (d.compensation === "HtwentyK_HfortyK") {
					d.compensation = "$120,000 to $140,000";
			}
			if (d.compensation === "HfortyK_HsixtyK") {
					d.compensation = "$140,000 to $160,000";
			}
			if (d.compensation === "More_than_HsixtyK") {
					d.compensation = "More Than $160,000";
			}

			d3.select(this).moveToFront(); // not working

			d3.select(this)
				.style("stroke-width", 1.5)
				.style("stroke", '#D6AF0A');

			tooltipStacked
				.style("display", null)
				.html("<p class='dotToolIndex text-center'>" + "<span class='infoDotF'>" + d.x + "</span>"  + "</p>"  +
					  "<p class='dotToolIndex'>" + d.compensation +" :  "  + "<span class='infoDot'>" + d.y + "</span>"  + " " +"<i class='fa fa-user' aria-hidden='true'></i>" + "</p>"
						 );

	}
	
	function mouseMoveStack(d) {

			tooltipStacked
			    .style("top", (d3.event.pageY - 10) + "px" )
			    .style("left", (d3.event.pageX + 10) + "px");
	}

	function mouseOutStack(d) {

			d3.select(this)
				.style("stroke-width", 0)
				.style("stroke", 'none');

			tooltipStacked
				.style("display", "none");	
	}


	d3.selection.prototype.moveToFront = function() {
		return this.each(function() {
			this.parentNode.appendChild(this);
		});
	};

