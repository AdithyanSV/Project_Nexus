function RadialChart(currentValue, maxValue, location) {

    // Set up the SVG canvas dimensions
    const container = d3.select(location);
    const width = container.node().clientWidth;
    const height = container.node().clientHeight;
    const margin = Math.min(width, height) * 0.09; // 10% of the smallest dimension
    const radius = Math.min(width, height) / 2 - margin;

    const svg = container
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Background circle
    svg.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", radius)
        .style("fill", "none")
        .style("stroke", "#333")
        .style("stroke-width", "10px");

    // Data
    // const currentValue = 4;
    // const maxValue = 10;

    // Arc generator
    const arc = d3.arc()
        .innerRadius(radius-5)
        .outerRadius(radius+5)
        .startAngle(-Math.PI)
        .endAngle((2 * Math.PI) * (currentValue / maxValue) - Math.PI);

    // Gradient for the progress arc
    const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#6A71E0");

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#FFAEFF");

    // Progress arc
    svg.append("path")
        .attr("d", arc)
        .style("fill", "url(#gradient)");

    // Text for the current value
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-0.1em")
        .attr("class", "current-value")
        .style("font-size", "48px")
        .style("fill", "white")
        .text(currentValue);

    // Text for the maximum value
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1.5em")
        .attr("class", "max-value")
        .style("font-size", "18px")
        .style("fill", "white")
        .text(`of ${maxValue}`);
};


function verticalBarChart(currentValue, maxValue, subject, location) {
    // Set up the SVG canvas dimensions
    const container = d3.select(location);
    const width = container.node().clientWidth;
    const height = container.node().clientHeight;
    const margin = { top: 10, right: 0, bottom: 20, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create the SVG element
    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create a group element for the bar chart
    const chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create a linear gradient for the bar
    const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "barGradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#6A71E0");

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#FFAEFF");

    // Create the background bar
    chartGroup.append("rect")
        .attr("x", innerWidth / 2 - 20)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", innerHeight)
        .attr("fill", "#333");

    // Create the progress bar
    chartGroup.append("rect")
        .attr("x", innerWidth / 2 - 20)
        .attr("y", innerHeight * (1 - currentValue / maxValue))
        .attr("width", 10)
        .attr("height", innerHeight * (currentValue / maxValue))
        .attr("fill", "url(#barGradient)");

    // Add current value text
    chartGroup.append("text")
        .attr("x", innerWidth / 2 - 30)
        .attr("y", 13)
        .attr("text-anchor", "middle")
        .attr("class", "current-value")
        .style("font-size", "11px")
        .style("fill", "white")
        .attr("transform", `rotate(-90, ${innerWidth / 2 - 30}, ${13})`)
        .text(`${((currentValue / maxValue) * 100).toFixed(0)}%`);

    // Add label text
    chartGroup.append("text")
        .attr("x", innerWidth / 2 - 30)
        .attr("y", innerHeight - 15)
        .attr("text-anchor", "middle")
        .attr("class", "label")
        .style("font-size", "10px")
        .style("font-align", "right")
        .style("fill", "white")
        .attr("transform", `rotate(-90, ${innerWidth / 2 - 30}, ${innerHeight - 15})`)
        .text(subject);
}


function horizontalBarChart(currentValue, maxValue, subject, location) {
    // Set up the SVG canvas dimensions
    const container = d3.select(location);
    const width = container.node().clientWidth;
    const height = container.node().clientHeight;
    const margin = { top: 25, right: 10, bottom: 10, left: 10 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create the SVG element
    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create a group element for the bar chart
    const chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create a linear gradient for the bar
    const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "barGradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#6A71E0");

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#FFAEFF");

    // Create the background bar
    chartGroup.append("rect")
        .attr("x", 0)
        .attr("y", innerHeight / 2 - 2)
        .attr("width", innerWidth)
        .attr("height", 10)
        .attr("fill", "#333");

    // Create the progress bar
    chartGroup.append("rect")
        .attr("x", 0)
        .attr("y", innerHeight / 2 - 2)
        .attr("width", innerWidth * (currentValue / maxValue))
        .attr("height", 10)
        .attr("fill", "url(#barGradient)");

    // Add current value text at the end of the progress bar
    chartGroup.append("text")
        .attr("x", 210)  // Position right next to the progress bar
        .attr("y", innerHeight / 2 - 15)  // Center vertically
        .attr("text-anchor", "start")
        .attr("class", "current-value")
        .style("font-size", "14px")
        .style("fill", "white")
        .text(`${((currentValue / maxValue) * 100).toFixed(0)}%`);

    // Add label text to the left of the progress bar
    chartGroup.append("text")
        .attr("x", margin.left / 2 + 15)  // Position to the left of the progress bar
        .attr("y", innerHeight / 2 - 15)  // Center vertically
        .attr("text-anchor", "middle")
        .attr("class", "label")
        .style("font-size", "14px")
        .style("fill", "white")
        .attr("transform", `rotate(0, ${margin.left / 2 + 15}, ${innerHeight / 2 + 5})`)
        .text(subject);
}



// Chart Function Calls
verticalBarChart(95, 100, "OS", "#verticalChart1");
verticalBarChart(20, 100, "CVPE", "#verticalChart2");
verticalBarChart(60, 100, "SE", "#verticalChart3");
verticalBarChart(75, 100, "DCN", "#verticalChart4");
verticalBarChart(90, 100, "OOPS", "#verticalChart5");
verticalBarChart(75, 100, "IP", "#verticalChart6");
verticalBarChart(50, 100, "UHV", "#verticalChart7");
horizontalBarChart(95, 100, "OS", "#horizontalChart1");
horizontalBarChart(20, 100, "CVPE", "#horizontalChart2");
horizontalBarChart(60, 100, "SE", "#horizontalChart3");
horizontalBarChart(75, 100, "DCN", "#horizontalChart4");
horizontalBarChart(90, 100, "OOPS", "#horizontalChart5");
horizontalBarChart(75, 100, "IP", "#horizontalChart6");
horizontalBarChart(50, 100, "UHV", "#horizontalChart7");
horizontalBarChart(50, 100, "BS", "#horizontalChart8");


RadialChart(56, 100, "#radialChart1");
RadialChart(4, 10, "#radialChart2");