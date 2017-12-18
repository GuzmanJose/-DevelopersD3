
queue()
	.defer(d3.json, "data/map/countries.json")
	.defer(d3.csv, "data/Country.csv", FixType)
	.defer(d3.csv, "data/CountryAndEmployment.csv", FixType2)
	.await(drawMap);



var margin = {top: 10, left: 10, bottom: 10, right: 10};
var width = parseInt(d3.select('#worldMap').style('width'));
var width = width - margin.left - margin.right;
var mapRatio = .56;
var height = width * mapRatio;

var xScale, yScale, tooltipBar, xAxis, yAxis;

var projection = d3.geo.mercator()
					.scale(100)
					.translate([width/2, height/2]);

var path = d3.geo.path()
			.projection(projection);

var worldColor = d3.scale.linear()
					.range(["#0A467D", "#89DDFF"]);

var map = d3.select("#worldMap")
			.append("svg")
			.attr("width", width)
			.attr("height", height - 60);

var tooltipMap = d3.select("body")
					.append("div")
					.attr("class", "tooltipMap")
					.style("display", "none");


function drawMap(error, world, myCountries, employment) {


		if (error) {
			console.log("Error in your data");
		}


		var data = d3.merge([myCountries, employment]);

		worldColor.domain(d3.extent(data, function(d) {
				return d.Count;
		}));

		var countries = topojson.feature(world, world.objects.units).features;

		var dataset = d3.nest()
						.key(function(d) {
							return d.Country;
						})
						.entries(data);

		dataset.forEach(function(d) {
			var dataName = d.key;
			var dataValue = +d.values[0].Count;
			var dataValue1 = +d.values[1].Employed_full_time;
			var dataValue2 = +d.values[1].Employed_part_time;
			var dataValue3 = +d.values[1].Unemployed;
			var dataValue4 = +d.values[1].Freelance_Contractor;
			var dataValue5 = +d.values[1].Retired;


			countries.forEach(function(k) {
				var worldName = k.properties.name;
				if (dataName == "Russian Federation") {
					dataName = "Russia"
				}
				if (dataName == worldName) {
					k.properties.developers = dataValue;
					k.properties.values = { Employed_full_time: dataValue1, 
											Employed_part_time: dataValue2,
											Freelancer: dataValue4,
											Retired: dataValue5,
											Unemployed: dataValue3, 
										   };
				}
			});

		});
		

		map.selectAll("path.countries")
			.data(countries)
			.enter()
			.append("path")
			.attr("class", "countries")
			.attr("d", path)
			.style("fill", function(d) {
				var value = +d.properties.developers;
				return worldColor(value);
			})
			.on("mouseover", mouseOver)
			.on("mousemove", mouseMove)
		    .on("mouseout", mouseOut);

			var legend = d3.legend.color()
							.shapeWidth(15)
							.shapePadding(0)
							.labelFormat(d3.format(".2s"))
							.orient("vertical")
							.scale(worldColor);

			map.append("g")
				.attr("class", "legend")
				.attr("transform", "translate(20," + (height - 180) + ")" )
				.call(legend);

			 d3.select(window).on('resize', resize);

			
		
}

	
	function mouseOver(d) {

			if (d.properties.values.Employed_full_time === null) {
			tooltipMap.style("display", "none");
		}
		
		d3.select(this).moveToFront();
		d3.select(this).style("stroke", "#D6AF0A");
		tooltipMap
			.style("display", null)
			.html("<p class='dotToolIndex text-center'>" + "<span class='infoDotF'>" + d.properties.name + "</span>" + "</p>"  +
				  "<p class='dotToolIndex'>" +  "Developers :  "  + "<span class='infoDot'>" +  d.properties.developers + "," + "</span>"  + "</p>"  +
				  "<p class='dotToolIndex'>" +  "Employed Full-time :  "  + "<span class='infoDot'>" + d.properties.values.Employed_full_time + "," + "</span>" + "</p>"  +	
				  "<p class='dotToolIndex'>" +  "Employed Part-time : "    + "<span class='infoDot'>" + d.properties.values.Employed_part_time + "," + "</span>" + "</p>" +
				  "<p class='dotToolIndex'>" +  "Freelancer : "    + "<span class='infoDot'>" + d.properties.values.Freelancer + "," + "</span>" + "</p>" +
				  "<p class='dotToolIndex'>" +  "Retired : "    + "<span class='infoDot'>" + d.properties.values.Retired + "," + "</span>" + "</p>" +
				  "<p class='dotToolIndex'>" +  "Unemployed : "    + "<span class='infoDot'>" + d.properties.values.Unemployed + "," + "</span>" + "</p>"
				  );
		
	
	}

	function mouseMove(d) {
		tooltipMap
		    .style("top", (d3.event.pageY - 10) + "px" )
		    .style("left", (d3.event.pageX + 10) + "px");
	}

	function mouseOut(d) {
		d3.select(this).style("stroke", "none");
		tooltipMap
			.style("display", "none");	
	}





	d3.selection.prototype.moveToFront = function() {
		return this.each(function() {
			this.parentNode.appendChild(this);
		});
	};



function resize() {

    width = parseInt(d3.select('#worldMap').
    		style('width')
    		);

    width = width - margin.left - margin.right;
    height = width * mapRatio;

    projection
        .translate([width / 2, height / 2])
        .scale(width/6);

    map
        .style('width', width + 'px')
        .style('height', height + 'px');

    map.selectAll('.countries').attr('d', path);
}



function FixType(d) {
	d.Count= +d.Count;
		return d;
}

function FixType2(d) {

	return d;
}





