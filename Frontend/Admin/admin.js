// let workingData =[];
async function fetchData(url) {
    try {
        const response = await fetch(url);
        // Check if the request was successful
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        // Parse the JSON response
        const data = await response.json();
        workingData = data;
        return data;
    } catch (error) {
        // Handle any errors
        console.error('There has been a problem with your fetch operation:', error);
        return null;  // Return null or an empty array to handle errors gracefully
    }
}



async function initializeTable(url) {
    const dataUrl = url;
    const data = await fetchData(dataUrl);
    if (data) {
        buildTable("studentTableBody", data);
    }
}

function createTable(containerId, columnTitles) {
    // Get the container element by its ID
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id "${containerId}" not found.`);
        return;
    }

    // Create the table element and add classes and IDs
    const table = document.createElement("table");
    table.classList.add('table');

    // Create the table header
    const tHead = document.createElement("tHead");
    tHead.id = "studentTableHead";
    const headerRow = document.createElement("tr");
    tHead.classList.add('tableHead');
    headerRow.classList.add('tableHeadRow', 'tableRow');

    // Iterate over the column titles array and create <th> elements
    columnTitles.forEach((title, index=0) => {
        const th = document.createElement("th");
        th.classList.add('tableHeadCell', 'tableCell');
        th.id = `header${index + 1}`;
        th.textContent = title;
        headerRow.appendChild(th);
    });

    tHead.appendChild(headerRow);
    table.appendChild(tHead);

    // Create the table body (empty initially)
    const tbody = document.createElement("tbody");
    tbody.classList.add('tableBody');
    tbody.id = "studentTableBody";
    table.appendChild(tbody);

    // Append the table to the container
    container.appendChild(table);
};

function buildTable(tableBodyId, data) {
    // Get the table body element by its ID
    let tableBody = document.getElementById(tableBodyId);
    if (!tableBody) {
        console.error(`Table with id "${tableBodyId}" not found.`);
        return;
    }    
    console.log("Build Open");
    for (let i = 0; i < data.length; i++) {
        let row = document.createElement("tr");
        row.classList.add('tableDataRow', 'tableRow');
        let rowdata = `
        <td> ${data[i].admission_number} </td>
        <td> ${data[i].name} </td>
        <td> ${data[i].email} </td>
        <td> ${data[i].phone_no} </td>
        <td class="options" id="options${i}">
        <button>Edit</button>
        <button>Delete</button>
        <button>Confirm</button>
        <button>Cancel</button></td>`;
        row.innerHTML = rowdata;
        tableBody.appendChild(row);
    }
};






document.addEventListener("DOMContentLoaded", () => {
    
    function handlePageLoad() {
        const page = window.location.pathname;
        console.log(page);
        if (page.includes("dash")) {
            dash();
        } else if (page.includes("student")) {
            student();
        } else if (page.includes("teacher")) {
            teacher();
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
    console.log("In Admin Dashboard");
}

function student() {
    console.log("In Admin Student Page");
    createTable("studentTable", ["Adm.No", "Name", "email", "phone"]);
    initializeTable('http://localhost:8080/dummy.json');   
}

function teacher() {
    console.log("In Admin Teacher Page");
    createTable("teacherTable", ["Adm.No", "Name", "email", "phone"]);
    initializeTable('http://localhost:8080/dummy.json');
}