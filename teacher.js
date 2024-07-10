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

let updatedAttendance = {}; // Global variable to store updated attendance data

function generateAttendanceTable(containerId, data, classOptions, buttonId) {
    const container = document.getElementById(containerId);

    // Helper function to get past four working days
    function getPastFourWorkingDays() {
        const days = [];
        let count = 0;
        let date = new Date();

        while (count < 4) {
            date.setDate(date.getDate() - 1);
            if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip Sundays (0) and Saturdays (6)
                days.push(new Date(date));
                count++;
            }
        }

        return days.reverse(); // Reverse to have the earliest date first
    }

    // Function to create the table header row
    function createHeaderRow() {
        const headerRow = document.createElement('tr');

        // Create the select element for class selection
        const classSelect = document.createElement('select');
        classSelect.name = 'class';
        classSelect.id = 'classSelect';
        classSelect.className = 'tableSelect';

        classOptions.forEach((optionText, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = optionText;
            classSelect.appendChild(option);
        });

        // Append select element to the first header cell
        const classHeaderCell = document.createElement('th');
        classHeaderCell.appendChild(classSelect);
        headerRow.appendChild(classHeaderCell);

        // Append empty cell
        headerRow.appendChild(document.createElement('th'));

        // Get the current date and past four working days
        const pastFourDays = getPastFourWorkingDays();
        const currentDate = new Date();
        pastFourDays.push(currentDate);

        // Append date headers
        pastFourDays.forEach((date, i) => {
            const dateHeaderCell = document.createElement('th');
            dateHeaderCell.className = 'date';
            dateHeaderCell.id = 'date' + (i + 1);
            dateHeaderCell.textContent = date.toLocaleDateString();
            headerRow.appendChild(dateHeaderCell);
        });

        return headerRow;
    }

    // Function to populate table based on selected class
    function populateTable(selectedClassIndex) {
        // Clear existing table body content
        container.innerHTML = '';

        // Append the header row to the tbody
        container.appendChild(createHeaderRow());

        // Filter data based on selected class
        const filteredData = data.filter(item => item.classIndex === selectedClassIndex);

        // Create table rows
        filteredData.forEach((item, index) => {
            const row = document.createElement('tr');

            const rollNoCell = document.createElement('td');
            rollNoCell.className = 'attendanceData rollNo';
            rollNoCell.id = 'rollNo' + (index + 1);
            rollNoCell.textContent = item.rollNo;
            row.appendChild(rollNoCell);

            const nameCell = document.createElement('td');
            nameCell.className = 'attendanceData name';
            nameCell.id = 'name' + (index + 1);
            nameCell.textContent = item.name;
            row.appendChild(nameCell);

            for (let i = 1; i <= 5; i++) {
                const attendanceCell = document.createElement('td');
                attendanceCell.className = 'attendanceData';
                attendanceCell.id = 'attendance' + (index + 1) + '.' + i;

                // Create checkbox for marking attendance
                const attendanceCheckbox = document.createElement('input');
                attendanceCheckbox.type = 'checkbox';
                attendanceCheckbox.className = 'attendanceCheckbox';
                attendanceCheckbox.checked = true; // Check by default

                // Update attendance data on change
                attendanceCheckbox.addEventListener('change', (event) => {
                    item.attendance[i - 1] = event.target.checked ? 'P' : 'A';
                });

                attendanceCell.appendChild(attendanceCheckbox);
                row.appendChild(attendanceCell);
            }

            container.appendChild(row);
        });
    }

    // Add event listener to class select to filter students
    container.addEventListener('change', (event) => {
        if (event.target.id === 'classSelect') {
            const selectedClassIndex = parseInt(event.target.value, 10);
            populateTable(selectedClassIndex);
        }
    });

    // Populate the table with the first class by default
    populateTable(0);

    // Function to export attendance data to JSON variable
    function exportAttendanceData() {
        const selectedClassIndex = parseInt(document.getElementById('classSelect').value, 10);
        const filteredData = data.filter(item => item.classIndex === selectedClassIndex);
        updatedAttendance = JSON.stringify(filteredData, null, 2);
        console.log(updatedAttendance); // Log the updatedAttendance to console
    }

    // Add event listener to export button
    document.getElementById(buttonId).addEventListener('click', exportAttendanceData);
}

function createTimetable(containerId, data) {
    // Get the container element
    const container = document.getElementById(containerId);
    
    // Create the table element
    const table = document.createElement('table');
    table.className = 'teTable';
    
    // Create the table header
    const header = document.createElement('tr');
    header.className = 'teTableRow';
    
    const headerTime = document.createElement('th');
    headerTime.className = 'teTableHeader';
    headerTime.textContent = 'Time';
    
    const headerSubject = document.createElement('th');
    headerSubject.className = 'teTableHeader';
    headerSubject.textContent = 'class';
    
    header.appendChild(headerTime);
    header.appendChild(headerSubject);
    table.appendChild(header);
    
    // Create table rows
    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.className = 'teTableRow';
        
        const timeCell = document.createElement('td');
        timeCell.className = 'teTableData';
        timeCell.textContent = item.time;

        const subjectCell = document.createElement('td');
        subjectCell.className = 'teTableData';
        subjectCell.textContent = item.class;
        
        row.appendChild(timeCell);
        row.appendChild(subjectCell);
        table.appendChild(row);
    });
    
    // Clear any existing content in the container and append the new table
    container.innerHTML = '';
    container.appendChild(table);
}

const attendanceData = [
    {
        classIndex: 0,
        rollNo: '1',
        name: 'Student A',
        attendance: ['P', 'P', 'P', 'P', 'P']
    },
    {
        classIndex: 0,
        rollNo: '2',
        name: 'Student C',
        attendance: ['P', 'P', 'P', 'P', 'P']
    },
    {
        classIndex: 0,
        rollNo: '3',
        name: 'Liam Smith',
        attendance: ['P', 'A', 'P', 'P', 'P']
    },
    {
        classIndex: 0,
        rollNo: '4',
        name: 'Emma Johnson',
        attendance: ['P', 'P', 'A', 'P', 'P']
    },
    {
        classIndex: 0,
        rollNo: '5',
        name: 'Noah Brown',
        attendance: ['P', 'P', 'P', 'A', 'P']
    },
    {
        classIndex: 0,
        rollNo: '6',
        name: 'Olivia Jones',
        attendance: ['P', 'P', 'P', 'P', 'A']
    },
    {
        classIndex: 0,
        rollNo: '7',
        name: 'Elijah Garcia',
        attendance: ['A', 'P', 'P', 'P', 'P']
    },
    {
        classIndex: 1,
        rollNo: '1',
        name: 'Student B',
        attendance: ['P', 'P', 'P', 'P', 'P']
    },
    {
        classIndex: 1,
        rollNo: '2',
        name: 'Student D',
        attendance: ['P', 'P', 'P', 'P', 'P']
    },
    {
        classIndex: 1,
        rollNo: '3',
        name: 'William Martinez',
        attendance: ['P', 'A', 'P', 'P', 'P']
    },
    {
        classIndex: 1,
        rollNo: '4',
        name: 'Sophia Rodriguez',
        attendance: ['P', 'P', 'A', 'P', 'P']
    },
    {
        classIndex: 1,
        rollNo: '5',
        name: 'James Hernandez',
        attendance: ['P', 'P', 'P', 'A', 'P']
    },
    {
        classIndex: 1,
        rollNo: '6',
        name: 'Isabella Wilson',
        attendance: ['P', 'P', 'P', 'P', 'A']
    },
    {
        classIndex: 1,
        rollNo: '7',
        name: 'Benjamin Anderson',
        attendance: ['A', 'P', 'P', 'P', 'P']
    },
    {
        classIndex: 2,
        rollNo: '1',
        name: 'Mason Thomas',
        attendance: ['P', 'P', 'P', 'P', 'P']
    },
    {
        classIndex: 2,
        rollNo: '2',
        name: 'Mia Lee',
        attendance: ['P', 'P', 'P', 'P', 'P']
    },
    {
        classIndex: 2,
        rollNo: '3',
        name: 'Lucas White',
        attendance: ['P', 'A', 'P', 'P', 'P']
    },
    {
        classIndex: 2,
        rollNo: '4',
        name: 'Amelia Harris',
        attendance: ['P', 'P', 'A', 'P', 'P']
    },
    {
        classIndex: 2,
        rollNo: '5',
        name: 'Henry Clark',
        attendance: ['P', 'P', 'P', 'A', 'P']
    },
    {
        classIndex: 2,
        rollNo: '6',
        name: 'Harper Lewis',
        attendance: ['P', 'P', 'P', 'P', 'A']
    },
    {
        classIndex: 2,
        rollNo: '7',
        name: 'Alexander Walker',
        attendance: ['A', 'P', 'P', 'P', 'P']
    },
    {
        classIndex: 3,
        rollNo: '1',
        name: 'Ethan Hall',
        attendance: ['P', 'P', 'P', 'P', 'P']
    },
    {
        classIndex: 3,
        rollNo: '2',
        name: 'Ava Young',
        attendance: ['P', 'P', 'P', 'P', 'P']
    },
    {
        classIndex: 3,
        rollNo: '3',
        name: 'Sebastian King',
        attendance: ['P', 'A', 'P', 'P', 'P']
    },
    {
        classIndex: 3,
        rollNo: '4',
        name: 'Charlotte Scott',
        attendance: ['P', 'P', 'A', 'P', 'P']
    },
    {
        classIndex: 3,
        rollNo: '5',
        name: 'Jack Green',
        attendance: ['P', 'P', 'P', 'A', 'P']
    },
    {
        classIndex: 3,
        rollNo: '6',
        name: 'Ella Adams',
        attendance: ['P', 'P', 'P', 'P', 'A']
    },
    {
        classIndex: 3,
        rollNo: '7',
        name: 'Daniel Baker',
        attendance: ['A', 'P', 'P', 'P', 'P']
    }
];


// Example class options
const classOptions = ['Class W', 'Class X', 'Class Y', 'Class Z'];

//Data with teacher
const timetableData = [
    { time: "9:00 - 10:00", class: "IT-A-S4" },
    { time: "10:00 - 11:00", class: "IT-B-S4" },
    { time: "11:00 - 12:00", class: "IT-B-S4" },
    { time: "1:00 - 2:00", class: "IT-A-S6" },
    { time: "3:00 - 4:00", class: "IT-A-S6" },
    { time: "4:00 - 5:00", class: "IT-b-S6" }
];




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
    createTimetable('timetable', timetableData);
}

function attendance() {
    console.log("In Teacher Attendance Page");
    RadialChart(56, 100, "Class X", "#radialChart-1");
    RadialChart(4, 100, "Class X", "#radialChart-2");
    RadialChart(90, 100, "Class X", "#radialChart-3");
    RadialChart(75, 100, "Class X", "#radialChart-4");
    generateAttendanceTable('attendanceTableBody', attendanceData, classOptions, 'table-submit');
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

