async function loadCityData() {
	let cityData = await d3.csv('cities.csv', d=>{
		return {
		  ...d, 
		  eu: d.eu==='true',
		  population: +d.population,
		  x: +d.x,
		  y: +d.y,
		}
	//   }).then(data=>{
	// 	  return data;
	  }).then(data => {
		  return data.filter(d => d.eu === true);
	  });
	return cityData;
}

async function loadBuildingData(){
	let buildingData = await d3.csv('buildings.csv', d =>{
		return {
			...d,
			height_m: +d.height_m, 
			height_ft: +d.height_ft,
			height_px: +d.height_px,
			floors: +d.floors,
			// completed: d.completed==='true', 
		}
	}).then(data => {
		return data.sort(function(a,b){
			return a.height_m - b.height_m;
		});
	});
	return buildingData;
}

async function renderScatterPlot() {
	let cityData = await loadCityData(); 
	d3.select('.city-count').text(`Numer of European Cities: ${cityData.length}`);
	const width = 700;
	const height = 550;
	const svg = d3.select('.population-plot')
				.append('svg')
				.attr('width', width)
				.attr('height', height);
	var circles = svg.selectAll("circle")
			.data(cityData)
			.enter()
			.append("circle")
			.attr("fill", "orange")
			.attr("cx", function(d) {
				return d.x;
			})
			.attr("cy", function(d) {
				return d.y;
			})
			.attr("r", function(d) {
				if (d.population < 1000000) {
					return 4;
				}
				return 8;
			});
	var labels = svg.selectAll("text")  
				.data(cityData)
				.enter()
				.append("text")  
				.text(function(d) {
					return `${d.city}`;
				})
				.attr("opacity", function(d){
					if (d.population < 1000000) {
						return 0;
					}
					return 100;
				}) 
				.attr("x", function(d) {
					return d.x;
				})
				.attr("y", function(d) {
					return d.y + 25;
				})
				.attr("fill", "black")
				.attr("font-size", "11px")
				.attr("text-anchor", "middle");
}

async function renderBarChart() {
	let buildingData = await loadBuildingData(); 
	const width = 500;
	const height = 500;
	const svg = d3.select('.building-height-plot')
				.append('svg')
				.attr('width', width)
				.attr('height', height);
	const rects = svg.selectAll("rect")
				.data(buildingData)
				.enter()
				.append("rect")
				.attr("x", 300)
				.attr("y", function(d, i) {
					return i * (40);
				})
				.attr("height", 30)
				.attr("width", function(d) {
					return d.height_px;
				})
				.attr("fill", "orange")
				.on("click", function(d, i) {
						d3.select('.image').attr("src", `img/${i.image}`);
						d3.select('.city').text(i.city);
						d3.select('.building-name').text(i.building);
						d3.select('.height').text(i.height_ft);
						d3.select('.country').text(i.country);
						d3.select('.floor').text(i.floors);
						d3.select('.completed').text(i.completed);
					});
	const text = svg.selectAll("text")
				.data(buildingData)
				.enter();
				
	// adding labels 
	text.append("text")
	.text(function(d) {
		return d.building;
	})
	.attr("opacity", "100")
	.attr("dx", 0)
	.attr("dy", function(d, i) {
		return i * (40) + 25;
	})
	.attr("fill", "gray")
	.attr("font-size", "20px");

	// adding heights
	text.append("text")
	.text(function(d) {
		return d.height_ft;
	})
	.attr("dx", function(d) {
		if (d.height_px > 270) {
			return d.height_px + 210;
		}
		return d.height_px + 280;
	})
	.attr("dy", function(d, i) {
		return i * (40) + 20;
	})
	.attr("fill", "gray")
	.attr("font-size", "11px")
	.attr("text-anchor", "end");
}

renderScatterPlot();
renderBarChart(); 
