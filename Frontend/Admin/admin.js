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

async function initializeTable(url, tableBodyId) {
    const dataUrl = url;
    const data = await fetchData(dataUrl);
    if (data) {
        buildTable(tableBodyId, data);
    }
}

function createTable(containerId, columnTitles, tableBodyId, tableHeadId) {
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
    tHead.id = tableHeadId;
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
    tbody.id = tableBodyId;
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
            <button data-testId=${i} id="cellEdit${i}" class="controlBtn cellControl primaryCtrl">Edit</button>
            <button data-testId=${i} id="cellDelete${i}" class="controlBtn cellControl primaryCtrl negativeControl">Delete</button>
            <button data-testId=${i} id="cellConfirm${i}" class="controlBtn cellControl secondaryCtrl positiveControl hidden">Confirm</button>
            <button data-testId=${i} id="cellCancel${i}" class="controlBtn cellControl secondaryCtrl negativeControl hidden">Cancel</button>
        </td>`;
        row.innerHTML = rowdata;
        tableBody.appendChild(row);

        // Add event listeners to the buttons
        document.getElementById(`cellEdit${i}`).addEventListener('click', editCell);
        document.getElementById(`cellDelete${i}`).addEventListener('click', deleteCell);
        document.getElementById(`cellConfirm${i}`).addEventListener('click', confirmCell);
        document.getElementById(`cellCancel${i}`).addEventListener('click', cancelCell);
    }
};

function editCell() {
    let testId = this.getAttribute("data-testId");
    let row = this.closest("tr");

    // Get the current values
    let admissionNumber = row.cells[0].textContent.trim();
    let name = row.cells[1].textContent.trim();
    let email = row.cells[2].textContent.trim();
    let phoneNo = row.cells[3].textContent.trim();

    // Replace cells with input fields
    row.cells[0].innerHTML = `<input type="text" value="${admissionNumber}" placeholder="${admissionNumber}" />`;
    row.cells[1].innerHTML = `<input type="text" value="${name}"  placeholder="${name}"/>`;
    row.cells[2].innerHTML = `<input type="text" value="${email}"  placeholder="${email}"/>`;
    row.cells[3].innerHTML = `<input type="text" value="${phoneNo}"  placeholder="${phoneNo}"/>`;

    // Toggle button visibility
    toggleButtons(testId, true, false);
}

function deleteCell() {
    let testId = this.getAttribute("data-testId");
    let row = this.closest("tr");

    // Get the current values
    let admissionNumber = row.cells[0].textContent.trim();
    let name = row.cells[1].textContent.trim();
    let email = row.cells[2].textContent.trim();
    let phoneNo = row.cells[3].textContent.trim();

    let deleteData = [{
        "admission_number" : admissionNumber,
        "name" : name,
        "email" : email,
        "phone_no" : phoneNo
    }];
    console.log(deleteData);

    // Toggle button visibility for deletion confirmation
    toggleButtons(testId, false, true);
}

function confirmCell() {
    let testId = this.getAttribute("data-testId");
    let row = this.closest("tr");

    if (row.classList.contains('pending-delete')) {
        // If the row is pending deletion, remove it
        row.remove();
    } else {
        //Get the old values from the placeholders of the input fields
        let oldAdmissionNumber = row.cells[0].querySelector("input").placeholder.trim();
        let oldName = row.cells[1].querySelector("input").placeholder.trim(); 
        let oldEmail = row.cells[2].querySelector("input").placeholder.trim();
        let oldPhoneNo = row.cells[3].querySelector("input").placeholder.trim();
        // Get the new values from input fields
        let admissionNumber = row.cells[0].querySelector("input").value.trim();
        let name = row.cells[1].querySelector("input").value.trim();
        let email = row.cells[2].querySelector("input").value.trim();
        let phoneNo = row.cells[3].querySelector("input").value.trim();
        
        //Data to send back to the server
        let updateData = [{
            "admission_number" : oldAdmissionNumber,
            "name" : oldName,
            "email" : oldEmail,
            "phone_no" : oldPhoneNo
        }, {
            "admission_number" : admissionNumber,
            "name" : name,
            "email" : email,
            "phone_no" : phoneNo
        }];

        // Replace input fields with text
        row.cells[0].textContent = admissionNumber;
        row.cells[1].textContent = name;
        row.cells[2].textContent = email;
        row.cells[3].textContent = phoneNo;

        console.log(updateData);

        // Toggle button visibility
        toggleButtons(testId, false, false);
    }
}

function cancelCell() {
    let testId = this.getAttribute("data-testId");
    let row = this.closest("tr");

    if (row.classList.contains('pending-delete')) {
        // If the row is pending deletion, just reset the buttons
        row.classList.remove('pending-delete');
        toggleButtons(testId, false, false);
    } else {
        // Get the original values from workingData (assuming workingData is an array of original data)
        let originalData = workingData[testId];
        row.cells[0].textContent = originalData.admission_number;
        row.cells[1].textContent = originalData.name;
        row.cells[2].textContent = originalData.email;
        row.cells[3].textContent = originalData.phone_no;

        // Toggle button visibility
        toggleButtons(testId, false, false);
    }
}

function toggleButtons(testId, isEditing, isDeleting) {
    let editBtn = document.getElementById(`cellEdit${testId}`);
    let deleteBtn = document.getElementById(`cellDelete${testId}`);
    let confirmBtn = document.getElementById(`cellConfirm${testId}`);
    let cancelBtn = document.getElementById(`cellCancel${testId}`);

    if (isEditing || isDeleting) {
        editBtn.classList.add('hidden');
        deleteBtn.classList.add('hidden');
        confirmBtn.classList.remove('hidden');
        cancelBtn.classList.remove('hidden');
    } else {
        editBtn.classList.remove('hidden');
        deleteBtn.classList.remove('hidden');
        confirmBtn.classList.add('hidden');
        cancelBtn.classList.add('hidden');
    }

    if (isDeleting) {
        document.getElementById(`options${testId}`).closest('tr').classList.add('pending-delete');
    } else {
        document.getElementById(`options${testId}`).closest('tr').classList.remove('pending-delete');
    }
}

// Search functionality
function searchTable(tableBodyId, query) {
    const tableBody = document.getElementById(tableBodyId);
    if (!tableBody) {
        console.error(`Table with id "${tableBodyId}" not found.`);
        return;
    }

    const rows = tableBody.getElementsByTagName("tr");
    query = query.toLowerCase();

    Array.from(rows).forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const email = row.cells[2].textContent.toLowerCase();
        if (name.includes(query) || email.includes(query)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

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
    createTable("studentTable", ["Adm.No", "Name", "email", "phone"], "studentTableBody", "studentTableHead");
    initializeTable('http://localhost:8080/dummy.json', "studentTableBody");

    // Search functionality
    const searchInput = document.getElementById('stSearchInput');
    const searchBtn = document.getElementById('st-searchBtn');
    searchInput.addEventListener('keyup', () => {
        searchTable('studentTableBody', searchInput.value);
    });
    searchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchTable('studentTableBody', searchInput.value);
    });
    window.addEventListener('keydown', function(e) {
        if (e.key === "Escape") {
            searchInput.value = '';
            searchTable('studentTableBody', searchInput.value);
        }
    });
}

function teacher() {
    console.log("In Admin Teacher Page");
    createTable("teacherTable", ["Adm.No", "Name", "email", "phone"], "teacherTableBody", "teacherTableHead");
    initializeTable('http://localhost:8080/dummy.json', "teacherTableBody");

    // Search functionality
    const searchInput = document.getElementById('teSearchInput');
    const searchBtn = document.getElementById('te-searchBtn');
    searchInput.addEventListener('keyup', () => {
        searchTable('teacherTableBody', searchInput.value);
    });
    searchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchTable('teacherTableBody', searchInput.value);
    });
    window.addEventListener('keydown', function(e) {
        if (e.key === "Escape") {
            searchInput.value = '';
            searchTable('teacherTableBody', searchInput.value);
        }
    });
}
