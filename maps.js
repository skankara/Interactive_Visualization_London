function drawStreets(){
	var streetCoordinates = [];
	d3.json("streets.json").then(function(data) {
 	 	streetCoordinates = data;
		streetMap(streetCoordinates);
	});
	
}
function streetMap(streetCoordinates){
	d3.select("#street_map").attr("transform", "translate(0,0) rotate(-90)");
	let svgContainer = d3.select("#street_map").append("g");
	streetCoordinates.forEach(function(l_streetCoordinate,index){
		let lineFunction = d3.line()
							.x(function(d) { return d.y*40; })
							.y(function(d) { return d.x*40; })
							.curve(d3.curveLinear); 

		let lineGraph = svgContainer.append("path")
									.attr("d", lineFunction(l_streetCoordinate))
									.attr("stroke", "grey")
									.attr("stroke-width", 1)
									.attr("fill", "none");
	})
	d3.csv("pumps.csv").then(function(data) {
 	 	let pumpCoordinates = data;
		pumpMapPlot(pumpCoordinates)
	});
	
	
}
function pumpMapPlot(pumpCoordinates){
	//d3.select("#street_map").attr("transform", "translate(0,0) rotate(360)");
	let svgContainer = d3.select("#street_map").append("g");
	pumpCoordinates.forEach(function(pumpCoordinate,index){
		let circlePoints = svgContainer.append("circle");
		
		let circleAttributes = circlePoints.attr("cx",function(){ 
												console.log("pumpCoordinate.x : ", pumpCoordinate.x);
												return parseFloat(pumpCoordinate.y)*40 ;}
												)
										.attr("cy", parseFloat(pumpCoordinate.x)*40)
										.attr("r", 10)
										.style("fill","red");
		
	})
}
function sliderBar(){
	d3.csv("deathdays.csv").then(function(data) {
 	 	let deathdays = data;
		
		console.log("deathdays : ", deathdays);
		var svg = d3.select("#slider"),
	    margin = {right: 10, left: 10},
	    width = +svg.attr("width") - margin.left - margin.right,
	    height = +svg.attr("height");
	
		var x = d3.scaleLinear()
		   //.domain(d3.extent(deathdays, function(d) { return d.date; }))
			.domain([0, 42])
		    .range([0, width])
		   .clamp(true);
		
		var slider = svg.append("g")
		    .attr("class", "slider")
		    .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");
		
		slider.append("line")
		    .attr("class", "track")
		    .attr("x1", x.range()[0])
		    .attr("x2", x.range()[1])
		  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
		    .attr("class", "track-inset")
		  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
		    .attr("class", "track-overlay")
		    .call(d3.drag()
		        .on("start.interrupt", function() { slider.interrupt(); })
		        .on("start drag", function() { hue(x.invert(d3.event.x)); }));
		
		k = -1;
		
		for(let i=0;i<42;i++)
		{
			let y= -x(i);
			slider.append("text")/*.insert("g", ".track-overlay")*/.attr("class","ticks")
							.attr("x",10)
							.attr("y",y)
							//.attr("text-anchor", "middle")
							.text(function(d) { 
								console.log("d : ", d)
								k = k+1; 
								return deathdays[k].date;
							//return d; 
							})
							.attr("transform", "rotate(90)")
							
			
		}
		
		var handle = slider.insert("circle", ".track-overlay")
		    .attr("class", "handle")
		    .attr("r", 9);
		
		slider.transition() // Gratuitous intro!
		   // .duration(750)
		    .tween("hue", function() {
		      var i = d3.interpolate(0, 0);
		      return function(t) { 
					hue(i(t)); };
		    });
		
		function hue(h) {
			console.log("h : ", h);
		  handle.attr("cx", x(h));
			drawDeath(h,deathdays);
		  //svg.style("background-color", d3.hsl(h, 0.8, 0.8));
		}
	});

}
function drawDeath(date,deathdays){
	let colors = ['#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#005824'];
	let h = parseInt(date);
	console.log("date : ", h);
	d3.selectAll(".death_class").remove();
	let svgContainer = d3.select("#street_map").append("g");
	let deathCount = 0;
	for(let i=0;i<h;i++){
		deathCount=deathCount+parseInt(deathdays[i].deaths);
	}
	console.log("deathCount : ", deathCount);
	
	let tempCount = 0;
	d3.csv("deaths_age_sex.csv").then(function(death_age_sex) {
		
		death_age_sex.forEach(function(l_death_age_sex,i){
			if(tempCount <= deathCount)
			{
				if(parseInt(l_death_age_sex.gender) == 0)
				{
					let circlePoints = svgContainer.append("circle").attr("class","death_class");
					let circleAttributes = circlePoints
											.attr("cx",parseFloat(l_death_age_sex.y)*40)
											.attr("cy", parseFloat(l_death_age_sex.x)*40)
											.attr("r", 5)
											.style("fill",function(){
													let age = parseInt(l_death_age_sex.age);
													return colors[age];
													//return "black";
											})
											.attr("stroke-width", 0.3)
											.attr("stroke", "black");
				}
				else
				{
					let rectPoints = svgContainer.append("rect").attr("class","death_class");
					rectPoints.attr("x",parseFloat(l_death_age_sex.y)*40)
								.attr("y", parseFloat(l_death_age_sex.x)*40)
								.attr("width", 8)
								.attr("height", 8)
								.style("fill",function(){
												let age = parseInt(l_death_age_sex.age);
												return colors[age];
													//return "black";
											})
											.attr("stroke-width", 0.3)
											.attr("stroke", "black");
				}				
				
			}
			tempCount = tempCount+1;
						
		})
		
	})
	
}

function legends(){
	let container = d3.select("#street_map").append("g");
	container.append("rect").attr("x",110)
								.attr("y", 600)
								.attr("width", 10)
								.attr("height", 10)
								.style("fill","white")
								.attr("stroke-width", 1)
								.attr("stroke", "black");
	container.append("text").attr("x",620)
								.attr("y", -110)
								.style("fill","black")
								.text("Female").attr("transform","rotate(90)")
	
	container.append("circle").attr("cx",90)
			.attr("cy", 605)
			.attr("r", 5)
			.style("fill","white")
			.attr("stroke-width", 1)
			.attr("stroke", "black");
	container.append("text").attr("x",620)
							.attr("y", -85)
							.style("fill","black")
							.text("Male").attr("transform","rotate(90)")
	
	container.append("circle").attr("cx",60)
				.attr("cy", 605)
				.attr("r", 10)
				.style("fill","red")
				
	container.append("text").attr("x",620)
							.attr("y", -55)
							.style("fill","black")
							.text("Pump").attr("transform","rotate(90)")	
		//-----------------------------------------					
	container.append("rect").attr("x",110)
								.attr("y", 400)
								.attr("width", 10)
								.attr("height", 15)
								.style("fill","#ccece6")
								.attr("stroke-width", 1)
								.attr("stroke", "black");
								
	container.append("text").attr("x",430)
							.attr("y", -110)
							.style("fill","black")
							.text("Age 0-10").attr("transform","rotate(90)")		
	
	container.append("rect").attr("x",90)
								.attr("y", 400)
								.attr("width", 10)
								.attr("height", 15)
								.style("fill",'#99d8c9')
								.attr("stroke-width", 1)
								.attr("stroke", "black");
								
	container.append("text").attr("x",430)
							.attr("y", -90)
							.style("fill","black")
							.text("Age 11-20").attr("transform","rotate(90)")			
							
							
	container.append("rect").attr("x",70)
								.attr("y", 400)
								.attr("width", 10)
								.attr("height", 15)
								.style("fill",'#66c2a4')
								.attr("stroke-width", 1)
								.attr("stroke", "black");
								
	container.append("text").attr("x",430)
							.attr("y", -70)
							.style("fill","black")
							.text("Age 21-40").attr("transform","rotate(90)")
	
	container.append("rect").attr("x",50)
								.attr("y", 400)
								.attr("width", 10)
								.attr("height", 15)
								.style("fill",'#41ae76')
								.attr("stroke-width", 1)
								.attr("stroke", "black");
								
	container.append("text").attr("x",430)
							.attr("y", -50)
							.style("fill","black")
							.text("Age 41-60").attr("transform","rotate(90)")								
			
	container.append("rect").attr("x",30)
								.attr("y", 400)
								.attr("width", 10)
								.attr("height", 15)
								.style("fill",'#238b45')
								.attr("stroke-width", 1)
								.attr("stroke", "black");
								
	container.append("text").attr("x",430)
							.attr("y", -30)
							.style("fill","black")
							.text("Age 61-80").attr("transform","rotate(90)")
	
	container.append("rect").attr("x",10)
								.attr("y", 400)
								.attr("width", 10)
								.attr("height", 15)
								.style("fill",'#005824')
								.attr("stroke-width", 1)
								.attr("stroke", "black");
								
	container.append("text").attr("x",430)
							.attr("y", -10)
							.style("fill","black")
							.text("Age > 80").attr("transform","rotate(90)")	
}
