async function loadCityData() {
	let cityData = await d3.csv('cities.csv', d=>{
		return {
		  ...d, // spread operator
		  eu: d.eu==='true', // convert to boolean
		  population: +d.population,
		  x: +d.x,
		  y: +d.y,
		}
	  }).then(data=>{
		  return data;
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
	var labels = svg.selectAll("text")  // <-- Note "text", not "circle" or "rect"
				.data(cityData)
				.enter()
				.append("text")  
				.text(function(d) {
					return `${d.city}, ${d.country}`;
				})
				.attr("opacity", function(d){
					if (d.population < 1000000) {
						return 0;
					}
					return 100;
				}) 
				.attr("x", function(d) {
					return d.x + 15;
				})
				.attr("y", function(d) {
					return d.y + 15;
				})
				.attr("fill", "red")
				.attr("font-size", "11px")
				.attr("text-anchor", "middle")  // <-- Same here!
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
				.attr("x", 250)
				.attr("y", function(d, i) {
					return i * (25);
				})
				.attr("height", 10)
				.attr("width", function(d) {
					return d.height_px;
				})
				.on("click", function(d, i) {
					// Do something after clicking a bar
					
						d3.select('.image').attr("src", `img/${i.image}`);
						d3.select('.building-name').text(i.building);
						d3.select('.height').text(i.height_ft);
						d3.select('.city').text(i.city);
					});
				// .on("click", function(d){
				// 	// d3.select('.image').attr("src", `img/${d.image}`);
				// 	d3.select('.building-name').text(function(d) {
				// 		return d.building;
				// 	})
				// 	// d3.select('.building-name').text(d.building);
				// 	// d3.select('.height').text(d.height_ft);
				// 	// d3.select('.city').text(d.city);
				// });

	const labels = svg.selectAll("text")
				.data(buildingData)
				.enter()
	
				labels.append("text")
				.text(function(d) {
					return d.building;
				})
				.attr("opacity", "100")
				.attr("dx", 50)
				.attr("dy", function(d, i) {
					return i * (25) + 25;
				})
				.attr("fill", "red")
				.attr("font-size", "11px");

	// const heightLabels = svg.selectAll("text")
	// 					.data(buildingData)
	// 					.enter()
						labels.append("text")
						.text(function(d) {
							return d.height_ft;
						})
						.attr("dy", function(d, i) {
							return i * (25);
						})
						.attr("fill", "red")
						.attr("font-size", "11px")
						.attr("text-anchor", "end");
}

async function fillTableValues(){
	let buildingData = await loadBuildingData(); 
	const image = d3.select("image").select(".image")
				.data(buildingData)
				.enter()
				.append("img")
                .attr("src", function(d) {
					return `img/${d.image}`;
				})
	const table = d3.select(".building-detail")
				.data(buildingData)
				.enter()
	const building = table.select(".building-name")
				.text(function(d) {
					return d.building;
				})
	const height = table.select(".height")
				.text(function(d) {
					console.log(d.height_ft);
					return d.height_ft;
				});
	const city = table.select(".city")
				.text(function(d) {
					console.log(d.city);
					return d.city;
				})
	const country = table.select(".country")
					.text(function(d) {
						console.log(d.country);
						return d.country;
					})
	const floor = table.select(".floor")
					.text(function(d) {
						console.log(d.floors);
						return d.floors;
					})
	const completed = table.select(".completed")
					.text(function(d) {
						console.log(d.completed);
						return d.completed;
					})
}

renderScatterPlot();
renderBarChart(); 
fillTableValues();
