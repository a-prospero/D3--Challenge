var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;



var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//load data from data.csv
d3.csv("./assets/data/data.csv").then(function(healthData){

// // Print the data
//     console.log(data);

// format the data 
  healthData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    });

// create scales
  var xScale = d3.scaleLinear()
  .domain([d3.min(healthData, d => d. poverty)*0.9, d3.max(healthData, d => d.poverty)*1.1])
  .range([0, width]);

  var yScale = d3.scaleLinear()
  .domain([d3.min(healthData, d => d. healthcare)*0.8, d3.max(healthData, d => d.healthcare)*0.85])
  .range([height, 0]);

//Create axis functions
  var bottomAxis = d3.axisBottom(xScale);
  var leftAxis = d3.axisLeft(yScale);

//Append Axes to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

// Create Circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "16")
    .attr("fill", "lightblue")
    .style("text-align", "center")
    .attr("opacity", ".5");

// Create circle labels
  chartGroup.selectAll()
    .data(healthData)
    .enter()
    .append("text")
    .style("text-align", "center")
    .attr("x", d => xScale(d.poverty) -5)
    .attr("y", d => yScale(d.healthcare) +5)
    .style("fill", "black")
    .attr("font-size", "11")
    .text(d => d.abbr);

//Initialize tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip d3-tip")
    .offset([80, -60])
     .html(function(d) {
       return (`${d.state}<br>poverty: ${d.poverty}%<br>healthcare: ${d.healthcare}%`);
     });
// Create tooltip in the chart
  chartGroup.call(toolTip);

// Create event listeners to display and hide the tooltip
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
   })
  // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
     });

    // Create axes labels
   chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .classed("active", true)
    .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);

  // changes classes to change bold text
      if (chosenXAxis === "poverty") {
        albumsLabel
          .classed("active", true)
           .classed("inactive", false);
        hairLengthLabel
          .classed("active", false)
          .classed("inactive", true);
        }
      else {
        albumsLabel
          .classed("active", false)
          .classed("inactive", true);
        hairLengthLabel
           .classed("active", true)
           .classed("inactive", false);
        }

  });