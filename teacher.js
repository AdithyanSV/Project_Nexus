//Normal Radial Chart
function RadialChart(currentValue, maxValue, label, location) {
    // Set up the SVG canvas dimensions
    const container = d3.select(location);
    const width = container.node().clientWidth;
    const height = container.node().clientHeight;
    const margin = Math.min(width, height) * 0.09; // 10% of the smallest dimension
    const radius = Math.min(width, height) / 2 - margin;

    // Set up the SVG canvas
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

    // Arc generator
    const arc = d3.arc()
        .innerRadius(radius - 5)
        .outerRadius(radius + 5)
        .startAngle(-Math.PI);

    const arcPath = svg.append("path")
        .datum({ endAngle: -Math.PI }) // start angle at -Math.PI (no progress)
        .style("fill", "url(#gradient)")
        .attr("d", arc);

    // Text for the current value
    const currentValueText = svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".21em")
        .attr("class", "current-value")
        .style("font-size", "75px")
        .style("fill", "white")
        .text(0);

    // Text for the label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "3em")
        .attr("class", "label")
        .style("font-size", "18px")
        .style("fill", "white")
        .text(`${label}`);

    arcPath.transition()
        .duration(1000)
        .ease(d3.easeCubicInOut)
        .attrTween("d", function(d) {
            const interpolate = d3.interpolate(d.endAngle, (2 * Math.PI) * (currentValue / maxValue) - Math.PI);
            return function(t) {
                d.endAngle = interpolate(t);
                return arc(d);
            };
        });

    currentValueText.transition()
        .duration(1000)
        .ease(d3.easeCubicInOut)
        .tween("text", function() {
            const interpolate = d3.interpolate(0, currentValue);
            return function(t) {
                this.textContent = Math.round(interpolate(t));
            };
        });
}
//Small Radial Chart
function smallRadialChart(currentValue, maxValue, location) {
    // Set up the SVG canvas dimensions
    const container = d3.select(location);
    const width = container.node().clientWidth;
    const height = container.node().clientHeight;
    const margin = Math.min(width, height) * 0.14; // 14% of the smallest dimension
    const radius = Math.min(width, height) / 2 - margin;

    // Set up the SVG canvas
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
        .style("stroke-width", "6px");

    // Gradient for the progress arc
    const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "gradient-small")
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

    // Arc generator
    const arc = d3.arc()
        .innerRadius(radius - 3)
        .outerRadius(radius + 3)
        .startAngle(-Math.PI);

    const arcPath = svg.append("path")
        .datum({ endAngle: -Math.PI }) // start angle at -Math.PI (no progress)
        .style("fill", "url(#gradient-small)")
        .attr("d", arc);

    // Text for the current value
    const currentValueText = svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".32em")
        .attr("class", "current-value")
        .style("font-size", "50px")
        .style("fill", "white")
        .text(0);

    // Animate the progress arc and text
    arcPath.transition()
        .duration(1000)
        .ease(d3.easeCubicInOut) 
        .attrTween("d", function(d) {
            const interpolate = d3.interpolate(d.endAngle, (2 * Math.PI) * (currentValue / maxValue) - Math.PI);
            return function(t) {
                d.endAngle = interpolate(t);
                return arc(d);
            };
        });

    currentValueText.transition()
        .duration(1000)
        .ease(d3.easeCubicInOut) 
        .tween("text", function() {
            const interpolate = d3.interpolate(0, currentValue);
            return function(t) {
                this.textContent = Math.round(interpolate(t));
            };
        });
}
//Vertical Bar Chart
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
    const progressBar = chartGroup.append("rect")
        .attr("x", innerWidth / 2 - 20)
        .attr("y", innerHeight)
        .attr("width", 10)
        .attr("height", 0)
        .attr("fill", "url(#barGradient)");

    // Add current value text
    const currentValueText = chartGroup.append("text")
        .attr("x", innerWidth / 2 - 25)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .attr("class", "current-value")
        .style("font-size", "14px")
        .style("fill", "white")
        .attr("transform", `rotate(-90, ${innerWidth / 2 - 25}, ${15})`)
        .text('0%');

    // Add label text
    chartGroup.append("text")
        .attr("x", innerWidth / 2 - 25)
        .attr("y", innerHeight - 15)
        .attr("text-anchor", "middle")
        .attr("class", "label")
        .style("font-size", "14px")
        .style("font-align", "right")
        .style("fill", "white")
        .attr("transform", `rotate(-90, ${innerWidth / 2 - 25}, ${innerHeight - 15})`)
        .text(subject);

    // Animate the progress bar
    progressBar.transition()
        .duration(1000)
        .ease(d3.easeCubicInOut) 
        .attr("y", innerHeight * (1 - currentValue / maxValue))
        .attr("height", innerHeight * (currentValue / maxValue));

    // Animate the current value text
    currentValueText.transition()
        .duration(1000)
        .ease(d3.easeCubicInOut) 
        .tween("text", function() {
            const interpolate = d3.interpolate(0, (currentValue / maxValue) * 100);
            return function(t) {
                this.textContent = `${Math.round(interpolate(t))}%`;
            };
        });
}
//Horizontal Bar Chart
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
        .attr("x1", "100%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "0%");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#FFAEFF");

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#6A71E0");

    // Create the background bar
    chartGroup.append("rect")
        .attr("x", 0)
        .attr("y", innerHeight / 2 - 5)
        .attr("width", innerWidth)
        .attr("height", 10)
        .attr("fill", "#333");

    // Create the progress bar
    const progressBar = chartGroup.append("rect")
        .attr("x", 0)
        .attr("y", innerHeight / 2 - 5)
        .attr("width", 0) // Start with 0 width for animation
        .attr("height", 10)
        .attr("fill", "url(#barGradient)");

    // Add current value text
    const currentValueText = chartGroup.append("text")
        .attr("x", innerWidth) // Start with 0 position for animation
        .attr("y", innerHeight / 2 - 10) // Center vertically
        .attr("text-anchor", "end") // Align text to the end (right)
        .attr("class", "current-value")
        .style("font-size", "14px")
        .style("fill", "white")
        .text('0%'); // Start with 0% for animation

    // Add label text to the left of the progress bar
    chartGroup.append("text")
        .attr("x", 0) // Position to the left of the progress bar
        .attr("y", innerHeight / 2 - 10) // Center vertically
        .attr("text-anchor", "start")
        .attr("class", "label")
        .style("font-size", "14px")
        .style("fill", "white")
        .text(subject);

    // Animate the progress bar
    progressBar.transition()
        .duration(1000)
        .ease(d3.easeCubicInOut) 
        .attr("width", innerWidth * (currentValue / maxValue));

    // Animate the current value text
    currentValueText.transition()
        .duration(1000)
        .ease(d3.easeCubicInOut) 
        .tween("text", function() {
            const interpolate = d3.interpolate(0, (currentValue / maxValue) * 100);
            return function(t) {
                this.textContent = `${Math.round(interpolate(t))}%`;
            };
        });
}


document.addEventListener("DOMContentLoaded", () => {   
    function handlePageLoad() {
        const page = window.location.pathname;
        console.log(page);
        if (page.includes("teDash")) {
            dash();
        } else if (page.includes("teAttendance")) {
            attendance();
        } else if (page.includes("teCurriculum")) {
            curriculum();
        } else if (page.includes("teSchedule")) {
            schedule();
        } else if (page.includes("teMarks")) {
            marks();
        } else {
            console.log("Error Detected, Invalid Page");
        }
    }
    // Initial load
    handlePageLoad();
    // client-side routing
    window.addEventListener('popstate', handlePageLoad);
});

function dash() {
    console.log("In Teacher Dashboard");
    RadialChart(56, 100, "Class X", "#radialChart1");
    RadialChart(4, 100, "Class X", "#radialChart2");
    RadialChart(90, 100, "Class X", "#radialChart3");
}

function attendance() {
    console.log("In Teacher Attendance Page");
    RadialChart(56, 100, "Class X", "#radialChart-1");
    RadialChart(4, 100, "Class X", "#radialChart-2");
    RadialChart(90, 100, "Class X", "#radialChart-3");
    RadialChart(75, 100, "Class X", "#radialChart-4");
}

function curriculum() {
    console.log("In Teacher Curriculum Page");
}

function schedule() {
    console.log("In Teacher Schedule Page");
}

function marks() {
    console.log("In Teacher Marks Page");
    RadialChart(4, 10, "#radialChart2");
}

