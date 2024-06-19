// Configuration objects for different tables
const studentTableConfig = [
    { title: "Reg.No", key: "register_no", editable: true },
    { title: "Name", key: "name", editable: true },
    { title: "DoB", key: "date_of_birth", editable: true },
    { title: "Age", key: "age", editable: true },
    { title: "Email", key: "email", editable: true },
    { title: "Type", key: "usertype", editable: true }
];

const teacherTableConfig = [
    { title: "ID", key: "teacher_id", editable: true },
    { title: "Name", key: "name", editable: true },
    { title: "Subject", key: "subject", editable: true },
    { title: "Email", key: "email", editable: true },
    { title: "Phone", key: "phone_no", editable: true }
];

let workingData = [];
let addedData = [];
let deletedData = [];
let updatedData = [];

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        workingData = data;
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return null;
    }
}

async function initializeTable(url, tableBodyId, config) {
    const data = await fetchData(url);
    if (data) {
        buildTable(tableBodyId, data, config);
    }
}

function createTable(containerId, config, tableBodyId, tableHeadId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id "${containerId}" not found.`);
        return;
    }

    const table = document.createElement("table");
    table.classList.add('table');

    const tHead = document.createElement("tHead");
    tHead.id = tableHeadId;
    const headerRow = document.createElement("tr");
    tHead.classList.add('tableHead');
    headerRow.classList.add('tableHeadRow', 'tableRow');

    config.forEach((col, index) => {
        const th = document.createElement("th");
        th.classList.add('tableHeadCell', 'tableCell');
        th.id = `header${index + 1}`;
        th.textContent = col.title;
        headerRow.appendChild(th);
    });

    // Add the "Options" column header
    const optionsTh = document.createElement("th");
    optionsTh.classList.add('tableHeadCell', 'tableCell');
    optionsTh.textContent = "Options";
    headerRow.appendChild(optionsTh);

    tHead.appendChild(headerRow);
    table.appendChild(tHead);

    const tbody = document.createElement("tbody");
    tbody.classList.add('tableBody');
    tbody.id = tableBodyId;
    table.appendChild(tbody);

    container.appendChild(table);
}

function buildTable(tableBodyId, data, config) {
    let tableBody = document.getElementById(tableBodyId);
    if (!tableBody) {
        console.error(`Table with id "${tableBodyId}" not found.`);
        return;
    }
    console.log("Build Open");
    for (let i = 0; i < data.length; i++) {
        let row = document.createElement("tr");
        row.classList.add('tableDataRow', 'tableRow');

        config.forEach((col, colIndex) => {
            const cell = document.createElement("td");
            cell.classList.add('tableCell');
            cell.textContent = data[i][col.key];
            row.appendChild(cell);
        });

        const optionsCell = document.createElement("td");
        optionsCell.classList.add("options");
        optionsCell.id = `options${i}`;
        optionsCell.innerHTML = `
            <button data-testId=${i} id="cellEdit${i}" class="controlBtn cellControl primaryCtrl">Edit</button>
            <button data-testId=${i} id="cellDelete${i}" class="controlBtn cellControl primaryCtrl negativeControl">Delete</button>
            <button data-testId=${i} id="cellConfirm${i}" class="controlBtn cellControl secondaryCtrl positiveControl hidden">Confirm</button>
            <button data-testId=${i} id="cellCancel${i}" class="controlBtn cellControl secondaryCtrl negativeControl hidden">Cancel</button>
        `;
        row.appendChild(optionsCell);
        tableBody.appendChild(row);

        document.getElementById(`cellEdit${i}`).addEventListener('click', () => editCell(i, config));
        document.getElementById(`cellDelete${i}`).addEventListener('click', () => deleteCell(i, config));
        document.getElementById(`cellConfirm${i}`).addEventListener('click', () => confirmCell(i, config));
        document.getElementById(`cellCancel${i}`).addEventListener('click', () => cancelCell(i, config));
    }
}

let currentRowIndex = workingData.length; // Keep track of the current row index

function addRow(config) {
    const tableBody = document.getElementById('studentTableBody') || document.getElementById('teacherTableBody');
    const newRow = document.createElement('tr');
    newRow.classList.add('tableDataRow', 'tableRow');

    config.forEach(col => {
        const cell = document.createElement('td');
        cell.innerHTML = `<input type="text" placeholder="${col.title}" class="editInput"/>`;
        newRow.appendChild(cell);
    });

    const optionsCell = document.createElement("td");
    optionsCell.classList.add("options");
    optionsCell.id = `optionsNew${currentRowIndex}`;
    optionsCell.innerHTML = `
        <button id="cellConfirmNew${currentRowIndex}" class="controlBtn cellControl secondaryCtrl positiveControl">Confirm</button>
        <button id="cellCancelNew${currentRowIndex}" class="controlBtn cellControl secondaryCtrl negativeControl">Cancel</button>
    `;
    newRow.appendChild(optionsCell);
    tableBody.insertBefore(newRow, tableBody.firstChild);

    document.getElementById(`cellConfirmNew${currentRowIndex}`).addEventListener('click', () => confirmNewRow(config));
    document.getElementById(`cellCancelNew${currentRowIndex}`).addEventListener('click', () => newRow.remove());

    currentRowIndex++; // Increment the index for the next new row
}

function confirmNewRow(config) {
    const newRow = document.getElementById(`cellConfirmNew${currentRowIndex - 1}`).closest('tr');
    const inputs = newRow.querySelectorAll('input');

    const newData = {};
    let isValid = true;

    config.forEach((col, index) => {
        const value = inputs[index].value.trim();
        if (!value) {
            isValid = false;
            return;
        }
        newData[col.key] = value;
    });

    if (!isValid) {
        alert('All fields are required.');
        return;
    }

    const isDuplicate = workingData.some(item => item.admission_number === newData.admission_number || item.name === newData.name);
    if (isDuplicate) {
        alert('Admission number and Name must be unique.');
        return;
    }

    workingData.push(newData);
    addedData.push(newData);

    config.forEach((col, index) => {
        newRow.cells[index].textContent = newData[col.key];
    });

    const optionsCell = newRow.cells[newRow.cells.length - 1];
    const newRowId = workingData.length - 1;
    optionsCell.innerHTML = `
        <button data-testId=${newRowId} id="cellEdit${newRowId}" class="controlBtn cellControl primaryCtrl">Edit</button>
        <button data-testId=${newRowId} id="cellDelete${newRowId}" class="controlBtn cellControl primaryCtrl negativeControl">Delete</button>
        <button data-testId=${newRowId} id="cellConfirm${newRowId}" class="controlBtn cellControl secondaryCtrl positiveControl hidden">Confirm</button>
        <button data-testId=${newRowId} id="cellCancel${newRowId}" class="controlBtn cellControl secondaryCtrl negativeControl hidden">Cancel</button>
    `;

    document.getElementById(`cellEdit${newRowId}`).addEventListener('click', () => editCell(newRowId, config));
    document.getElementById(`cellDelete${newRowId}`).addEventListener('click', () => deleteCell(newRowId, config));
    document.getElementById(`cellConfirm${newRowId}`).addEventListener('click', () => confirmCell(newRowId, config));
    document.getElementById(`cellCancel${newRowId}`).addEventListener('click', () => cancelCell(newRowId, config));

    console.log('Added Data:', addedData);
}

function editCell(index, config) {
    let row = document.querySelector(`[data-testId="${index}"]`).closest("tr");

    config.forEach((col, i) => {
        const value = row.cells[i].textContent.trim();
        row.cells[i].innerHTML = `<input type="text" value="${value}" placeholder="${col.title}" class="editInput"/>`;
    });

    toggleButtons(index, true, false);
}

function deleteCell(index, config) {
    let row = document.querySelector(`[data-testId="${index}"]`).closest("tr");
    if (row) {
        row.classList.add('pending-delete');
        toggleButtons(index, false, true);
    } else {
        console.error(`Row with index ${index} not found.`);
    }
}


function confirmCell(index, config) {
    let row = document.querySelector(`[data-testId="${index}"]`).closest("tr");
    if (!row) {
        console.error(`Row with index ${index} not found.`);
        return;
    }

    if (row.classList.contains('pending-delete')) {
        row.remove();
        const deletedItem = workingData.splice(index, 1)[0];
        deletedData.push(deletedItem);

        toggleButtons(index, false, false);

        console.log('Deleted Data:', deletedData);
    } else {
        const oldData = {};
        const newData = {};

        config.forEach((col, colIndex) => {
            oldData[col.key] = workingData[index][col.key];
            newData[col.key] = row.cells[colIndex].querySelector("input").value.trim();
        });

        const isDuplicate = workingData.some((item, idx) => (item.admission_number === newData.admission_number && item.name === newData.name) && idx !== index);
        if (isDuplicate) {
            alert('Admission number and Name must be unique.');
            return;
        }

        updatedData.push({ oldData, newData });

        config.forEach((col, colIndex) => {
            row.cells[colIndex].textContent = newData[col.key];
            workingData[index][col.key] = newData[col.key];
        });

        toggleButtons(index, false, false);

        console.log('Updated Data:', updatedData);
    }
}


function cancelCell(index, config) {
    let row = document.querySelector(`[data-testId="${index}"]`).closest("tr");

    if (row.classList.contains('pending-delete')) {
        row.classList.remove('pending-delete');
        toggleButtons(index, false, false);
    } else {
        const originalData = workingData[index];
        config.forEach((col, colIndex) => {
            row.cells[colIndex].textContent = originalData[col.key];
        });

        toggleButtons(index, false, false);
    }
}

function toggleButtons(index, isEditing, isDeleting) {
    let editBtn = document.getElementById(`cellEdit${index}`);
    let deleteBtn = document.getElementById(`cellDelete${index}`);
    let confirmBtn = document.getElementById(`cellConfirm${index}`);
    let cancelBtn = document.getElementById(`cellCancel${index}`);

    if (editBtn && deleteBtn && confirmBtn && cancelBtn) {
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

        let optionsCell = document.getElementById(`options${index}`);
        if (optionsCell) {
            let row = optionsCell.closest('tr');
            if (row) {
                if (isDeleting) {
                    row.classList.add('pending-delete');
                } else {
                    row.classList.remove('pending-delete');
                }
            } else {
                console.error(`Row for options cell with index ${index} not found.`);
            }
        } else {
            console.error(`Options cell with index ${index} not found.`);
        }
    } else {
        console.error(`Buttons for index ${index} not found.`);
    }
}





function searchTable(tableBodyId, query, config) {
    const tableBody = document.getElementById(tableBodyId);
    const escBtn = document.getElementById("searchBtn");
    escBtn.classList.remove('hidden');
    if (!tableBody) {
        console.error(`Table with id "${tableBodyId}" not found.`);
        return;
    }

    const rows = tableBody.getElementsByTagName("tr");
    query = query.toLowerCase();

    Array.from(rows).forEach(row => {
        const isVisible = config.some((col, index) => row.cells[index].textContent.toLowerCase().includes(query));
        row.style.display = isVisible ? "" : "none";
    });

    if (query === "") {
        escBtn.classList.add('hidden');
    }
}

function syncData() {
    const syncPayload = {
        added: addedData,
        deleted: deletedData,
        updated: updatedData
    };

    fetch('http://localhost:8080/sync', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(syncPayload)
    })
    .then(response => {
        if (response.ok) {
            console.log('Data synced successfully');
            addedData = [];
            deletedData = [];
            updatedData = [];
        } else {
            console.error('Failed to sync data');
        }
    })
    .catch(error => {
        console.error('Error syncing data:', error);
    });

    console.log('Sync Payload:', syncPayload);
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
    handlePageLoad();
    window.addEventListener('popstate', handlePageLoad);
});

function dash() {
    console.log("In Admin Dashboard");
}

function student() {
    console.log("In Admin Student Page");
    createTable("studentTable", studentTableConfig, "studentTableBody", "studentTableHead");
    initializeTable('http://localhost:8080/dummy.json', "studentTableBody", studentTableConfig);

    const searchInput = document.getElementById('stSearchInput');
    const searchBtn = document.getElementById('searchBtn');
    searchInput.addEventListener('keyup', () => {
        searchTable('studentTableBody', searchInput.value, studentTableConfig);
    });
    searchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchTable('studentTableBody', searchInput.value, studentTableConfig);
    });
    window.addEventListener('keydown', function (e) {
        if (e.key === "Escape") {
            searchInput.value = '';
            searchTable('studentTableBody', searchInput.value, studentTableConfig);
        }
    });

    const addButton = document.getElementById('table-add');
    if (addButton) {
        addButton.addEventListener('click', () => addRow(studentTableConfig));
    }

    const syncButton = document.getElementById('table-sync');
    if (syncButton) {
        syncButton.addEventListener('click', syncData);
    }
}

function teacher() {
    console.log("In Admin Teacher Page");
    createTable("teacherTable", teacherTableConfig, "teacherTableBody", "teacherTableHead");
    initializeTable('http://localhost:8080/dummy.json', "teacherTableBody", teacherTableConfig);

    const searchInput = document.getElementById('teSearchInput');
    const searchBtn = document.getElementById('searchBtn');
    searchInput.addEventListener('keyup', () => {
        searchTable('teacherTableBody', searchInput.value, teacherTableConfig);
    });
    searchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchTable('teacherTableBody', searchInput.value, teacherTableConfig);
    });
    window.addEventListener('keydown', function (e) {
        if (e.key === "Escape") {
            searchInput.value = '';
            searchTable('teacherTableBody', searchInput.value, teacherTableConfig);
        }
    });

    const addButton = document.getElementById('table-add');
    if (addButton) {
        addButton.addEventListener('click', () => addRow(teacherTableConfig));
    }

    const syncButton = document.getElementById('table-sync');
    if (syncButton) {
        syncButton.addEventListener('click', syncData);
    }
}
