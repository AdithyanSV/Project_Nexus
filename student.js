// Example JSON data for each page
const dashData = {
    "registerNumber": "123456",
    "charts": [
        { "subject": "OS", "value": 95 },
        { "subject": "CVPE", "value": 20 },
        { "subject": "SE", "value": 60 },
        { "subject": "DCN", "value": 75 },
        { "subject": "OOPS", "value": 90 },
        { "subject": "IP", "value": 75 },
        { "subject": "UHV", "value": 50 },
        { "currentValue": 56, "maxValue": 100},
        { "currentValue": 4, "maxValue": 10}
    ]
};

const attendanceData = {
    "registerNumber": "123456",
    "verticalCharts": [
        { "subject": "OS", "value": 95 },
        { "subject": "CVPE", "value": 20 },
        { "subject": "SE", "value": 60 },
        { "subject": "DCN", "value": 75 },
        { "subject": "OOPS", "value": 90 },
        { "subject": "IP", "value": 75 },
        { "subject": "UHV", "value": 50 }
    ],
    "horizontalCharts": [
        { "date": "date-1", "value": 95 },
        { "date": "date-2", "value": 20 },
        { "date": "date-3", "value": 60 },
        { "date": "date-4", "value": 75 },
        { "date": "date-5", "value": 90 },
        { "date": "date-6", "value": 75 },
        { "date": "date-7", "value": 50 },
        { "date": "date-8", "value": 50 },
        { "date": "date-9", "value": 50 },
        { "date": "date-10", "value": 50 }
    ],
    "smallRadialCharts": [
        { "currentValue": 6, "maxValue": 10, "id": "sRadialChart1" },
        { "currentValue": 4, "maxValue": 10, "id": "sRadialChart2" },
        { "currentValue": 2, "maxValue": 10, "id": "sRadialChart3" },
        { "currentValue": 9, "maxValue": 10, "id": "sRadialChart4" },
        { "currentValue": 8, "maxValue": 10, "id": "sRadialChart5" },
        { "currentValue": 7, "maxValue": 10, "id": "sRadialChart6" },
        { "currentValue": 5, "maxValue": 10, "id": "sRadialChart7" },
        { "currentValue": 3, "maxValue": 10, "id": "sRadialChart8" }
    ]
};

const curriculumData = {
    "registerNumber": "123456",
    // Add curriculum-specific data here
};

const scheduleData = {
    "registerNumber": "123456",
    // Add schedule-specific data here
};

const marksData = {
    "registerNumber": "123456",
    "radialCharts": [
        { "currentValue": 4, "maxValue": 10, "id": "radialChart2" }
    ]
};

const tableconfig1 = {
    "registerNumber": "123456",
    "table": [
        { "subject": "OS", "value": 95 },
        { "subject": "CVPE", "value": 20 },
        { "subject": "SE", "value": 60 },
        { "subject": "DCN", "value": 75 },
        { "subject": "OOPS", "value": 90 },
        { "subject": "IP", "value": 75 },
        { "subject": "UHV", "value": 50 }
    ]
};

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
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
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
        .attr("x", innerWidth) // Position text at the rightmost side
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
        if (page.includes("stDash")) {
            dash();
        } else if (page.includes("stAttendance")) {
            attendance();
        } else if (page.includes("stCurriculum")) {
            curriculum();
        } else if (page.includes("stSchedule")) {
            schedule();
        } else if (page.includes("stMarks")) {
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


let chartData = [
    { subject: "OS", value: 95 },
    { subject: "CVPE", value: 20 },
    { subject: "SE", value: 60 },
    { subject: "DCN", value: 75 },
    { subject: "OOPS", value: 90 },
    { subject: "IP", value: 75 },
    { subject: "UHV", value: 50 }
];

function dash() {
    console.log("In Student Dashboard");
    verticalBarChart(chartData[0].value, 100, chartData[0].subject, "#verticalChart1");
    verticalBarChart(20, 100, "CVPE", "#verticalChart2");
    verticalBarChart(60, 100, "SE", "#verticalChart3");
    verticalBarChart(75, 100, "DCN", "#verticalChart4");
    verticalBarChart(90, 100, "OOPS", "#verticalChart5");
    verticalBarChart(75, 100, "IP", "#verticalChart6");
    verticalBarChart(50, 100, "UHV", "#verticalChart7");
    RadialChart(56, 100, "100", "#radialChart1");
    RadialChart(4, 10, "10", "#radialChart2");
}

function attendance() {
    console.log("In Student Attendance Page");
    verticalBarChart(95, 100, "OS", "#verticalChart1");
    verticalBarChart(20, 100, "CVPE", "#verticalChart2");
    verticalBarChart(60, 100, "SE", "#verticalChart3");
    verticalBarChart(75, 100, "DCN", "#verticalChart4");
    verticalBarChart(90, 100, "OOPS", "#verticalChart5");
    verticalBarChart(75, 100, "IP", "#verticalChart6");
    verticalBarChart(50, 100, "UHV", "#verticalChart7");
    RadialChart(56, 100, "100", "#radialChart1");
    horizontalBarChart(95, 100, "date-1", "#horizontalChart1");
    horizontalBarChart(20, 100, "date-2", "#horizontalChart2");
    horizontalBarChart(60, 100, "date-3", "#horizontalChart3");
    horizontalBarChart(75, 100, "date-4", "#horizontalChart4");
    horizontalBarChart(90, 100, "date-5", "#horizontalChart5");
    horizontalBarChart(75, 100, "date-6", "#horizontalChart6");
    horizontalBarChart(50, 100, "date-7", "#horizontalChart7");
    horizontalBarChart(50, 100, "date-8", "#horizontalChart8");
    horizontalBarChart(50, 100, "date-9", "#horizontalChart9");
    horizontalBarChart(50, 100, "date-10", "#horizontalChart10");
    smallRadialChart(6, 10, "#sRadialChart1");
    smallRadialChart(4, 10, "#sRadialChart2");
    smallRadialChart(2, 10, "#sRadialChart3");
    smallRadialChart(9, 10, "#sRadialChart4");
    smallRadialChart(8, 10, "#sRadialChart5");
    smallRadialChart(7, 10, "#sRadialChart6");
    smallRadialChart(5, 10, "#sRadialChart7");
    smallRadialChart(3, 10, "#sRadialChart8");
}

function curriculum() {
    console.log("In Student Curriculum Page");
}

function schedule() {
    console.log("In Student Schedule Page");
}

function marks() {
    console.log("In Student Marks Page");
    RadialChart(4, 10, "#radialChart2");
}

