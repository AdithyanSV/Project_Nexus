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

async function initializeTable(url, tableBodyId) {
    const dataUrl = url;
    const data = await fetchData(dataUrl);
    if (data) {
        buildTable(tableBodyId, data);
    }
}

function createTable(containerId, columnTitles, tableBodyId, tableHeadId) {
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

    columnTitles.forEach((title, index = 0) => {
        const th = document.createElement("th");
        th.classList.add('tableHeadCell', 'tableCell');
        th.id = `header${index + 1}`;
        th.textContent = title;
        headerRow.appendChild(th);
    });

    tHead.appendChild(headerRow);
    table.appendChild(tHead);

    const tbody = document.createElement("tbody");
    tbody.classList.add('tableBody');
    tbody.id = tableBodyId;
    table.appendChild(tbody);

    container.appendChild(table);
}

function buildTable(tableBodyId, data) {
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

        document.getElementById(`cellEdit${i}`).addEventListener('click', editCell);
        document.getElementById(`cellDelete${i}`).addEventListener('click', deleteCell);
        document.getElementById(`cellConfirm${i}`).addEventListener('click', confirmCell);
        document.getElementById(`cellCancel${i}`).addEventListener('click', cancelCell);
    }
}

function addRow() {
    const tableBody = document.getElementById('studentTableBody') || document.getElementById('teacherTableBody');
    const newRow = document.createElement('tr');
    newRow.classList.add('tableDataRow', 'tableRow');

    let rowdata = `
    <td><input type="text" placeholder="Adm.No" /></td>
    <td><input type="text" placeholder="Name" /></td>
    <td><input type="text" placeholder="Email" /></td>
    <td><input type="text" placeholder="Phone" /></td>
    <td class="options" id="optionsNew">
        <button id="cellConfirmNew" class="controlBtn cellControl secondaryCtrl positiveControl">Confirm</button>
        <button id="cellCancelNew" class="controlBtn cellControl secondaryCtrl negativeControl">Cancel</button>
    </td>`;
    newRow.innerHTML = rowdata;
    tableBody.insertBefore(newRow, tableBody.firstChild);

    document.getElementById('cellConfirmNew').addEventListener('click', confirmNewRow);
    document.getElementById('cellCancelNew').addEventListener('click', () => newRow.remove());
}

function confirmNewRow() {
    const newRow = this.closest('tr');
    const inputs = newRow.querySelectorAll('input');

    const admissionNumber = inputs[0].value.trim();
    const name = inputs[1].value.trim();
    const email = inputs[2].value.trim();
    const phoneNo = inputs[3].value.trim();

    if (!admissionNumber || !name || !email || !phoneNo) {
        alert('All fields are required.');
        return;
    }

    const isDuplicate = workingData.some(item => item.admission_number === admissionNumber || item.name === name);
    if (isDuplicate) {
        alert('Admission number and Name must be unique.');
        return;
    }

    const newData = {
        admission_number: admissionNumber,
        name: name,
        email: email,
        phone_no: phoneNo
    };

    workingData.push(newData);
    addedData.push(newData);

    newRow.cells[0].textContent = admissionNumber;
    newRow.cells[1].textContent = name;
    newRow.cells[2].textContent = email;
    newRow.cells[3].textContent = phoneNo;

    const optionsCell = newRow.cells[4];
    optionsCell.innerHTML = `
    <button data-testId=${workingData.length - 1} id="cellEdit${workingData.length - 1}" class="controlBtn cellControl primaryCtrl">Edit</button>
    <button data-testId=${workingData.length - 1} id="cellDelete${workingData.length - 1}" class="controlBtn cellControl primaryCtrl negativeControl">Delete</button>
    <button data-testId=${workingData.length - 1} id="cellConfirm${workingData.length - 1}" class="controlBtn cellControl secondaryCtrl positiveControl hidden">Confirm</button>
    <button data-testId=${workingData.length - 1} id="cellCancel${workingData.length - 1}" class="controlBtn cellControl secondaryCtrl negativeControl hidden">Cancel</button>
    `;

    document.getElementById(`cellEdit${workingData.length - 1}`).addEventListener('click', editCell);
    document.getElementById(`cellDelete${workingData.length - 1}`).addEventListener('click', deleteCell);
    document.getElementById(`cellConfirm${workingData.length - 1}`).addEventListener('click', confirmCell);
    document.getElementById(`cellCancel${workingData.length - 1}`).addEventListener('click', cancelCell);

    console.log('Added Data:', addedData);
}

function editCell() {
    let testId = this.getAttribute("data-testId");
    let row = this.closest("tr");

    let admissionNumber = row.cells[0].textContent.trim();
    let name = row.cells[1].textContent.trim();
    let email = row.cells[2].textContent.trim();
    let phoneNo = row.cells[3].textContent.trim();

    row.cells[0].innerHTML = `<input type="text" value="${admissionNumber}" placeholder="${admissionNumber}" />`;
    row.cells[1].innerHTML = `<input type="text" value="${name}" placeholder="${name}"/>`;
    row.cells[2].innerHTML = `<input type="text" value="${email}" placeholder="${email}"/>`;
    row.cells[3].innerHTML = `<input type="text" value="${phoneNo}" placeholder="${phoneNo}"/>`;

    toggleButtons(testId, true, false);
}

function deleteCell() {
    let testId = this.getAttribute("data-testId");
    let row = this.closest("tr");

    let admissionNumber = row.cells[0].textContent.trim();
    let name = row.cells[1].textContent.trim();
    let email = row.cells[2].textContent.trim();
    let phoneNo = row.cells[3].textContent.trim();

    let deleteData = {
        admission_number: admissionNumber,
        name: name,
        email: email,
        phone_no: phoneNo
    };

    deletedData.push(deleteData);
    workingData = workingData.filter(item => item.admission_number !== admissionNumber);

    row.remove();

    console.log('Deleted Data:', deletedData);
}

function confirmCell() {
    let testId = this.getAttribute("data-testId");
    let row = this.closest("tr");

    if (row.classList.contains('pending-delete')) {
        row.remove();
    } else {
        let oldAdmissionNumber = row.cells[0].querySelector("input").placeholder.trim();
        let oldName = row.cells[1].querySelector("input").placeholder.trim();
        let oldEmail = row.cells[2].querySelector("input").placeholder.trim();
        let oldPhoneNo = row.cells[3].querySelector("input").placeholder.trim();

        let admissionNumber = row.cells[0].querySelector("input").value.trim();
        let name = row.cells[1].querySelector("input").value.trim();
        let email = row.cells[2].querySelector("input").value.trim();
        let phoneNo = row.cells[3].querySelector("input").value.trim();

        const isDuplicate = workingData.some(item => item.admission_number === admissionNumber && item.name === name);
        if ((admissionNumber !== oldAdmissionNumber || name !== oldName) && isDuplicate) {
            alert('Admission number and Name must be unique.');
            return;
        }

        let oldData = {
            admission_number: oldAdmissionNumber,
            name: oldName,
            email: oldEmail,
            phone_no: oldPhoneNo
        };

        let newData = {
            admission_number: admissionNumber,
            name: name,
            email: email,
            phone_no: phoneNo
        };

        updatedData.push({ oldData, newData });

        row.cells[0].textContent = admissionNumber;
        row.cells[1].textContent = name;
        row.cells[2].textContent = email;
        row.cells[3].textContent = phoneNo;

        toggleButtons(testId, false, false);

        console.log('Updated Data:', updatedData);
    }
}

function cancelCell() {
    let testId = this.getAttribute("data-testId");
    let row = this.closest("tr");

    if (row.classList.contains('pending-delete')) {
        row.classList.remove('pending-delete');
        toggleButtons(testId, false, false);
    } else {
        let originalData = workingData[testId];
        row.cells[0].textContent = originalData.admission_number;
        row.cells[1].textContent = originalData.name;
        row.cells[2].textContent = originalData.email;
        row.cells[3].textContent = originalData.phone_no;

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

function searchTable(tableBodyId, query) {
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
        const name = row.cells[1].textContent.toLowerCase();
        const email = row.cells[2].textContent.toLowerCase();
        if (name.includes(query) || email.includes(query)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
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

    // Send syncPayload to the server
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
            // Clear the arrays after successful sync
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
    createTable("studentTable", ["Adm.No", "Name", "email", "phone"], "studentTableBody", "studentTableHead");
    initializeTable('http://localhost:8080/dummy.json', "studentTableBody");

    const searchInput = document.getElementById('stSearchInput');
    const searchBtn = document.getElementById('searchBtn');
    searchInput.addEventListener('keyup', () => {
        searchTable('studentTableBody', searchInput.value);
    });
    searchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchTable('studentTableBody', searchInput.value);
    });
    window.addEventListener('keydown', function (e) {
        if (e.key === "Escape") {
            searchInput.value = '';
            searchTable('studentTableBody', searchInput.value);
        }
    });

    const addButton = document.getElementById('table-add');
    if (addButton) {
        addButton.addEventListener('click', addRow);
    }

    const syncButton = document.getElementById('table-sync');
    if (syncButton) {
        syncButton.addEventListener('click', syncData);
    }
}

function teacher() {
    console.log("In Admin Teacher Page");
    createTable("teacherTable", ["Adm.No", "Name", "email", "phone"], "teacherTableBody", "teacherTableHead");
    initializeTable('http://localhost:8080/dummy.json', "teacherTableBody");

    const searchInput = document.getElementById('teSearchInput');
    const searchBtn = document.getElementById('searchBtn');
    searchInput.addEventListener('keyup', () => {
        searchTable('teacherTableBody', searchInput.value);
    });
    searchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchTable('teacherTableBody', searchInput.value);
    });
    window.addEventListener('keydown', function (e) {
        if (e.key === "Escape") {
            searchInput.value = '';
            searchTable('teacherTableBody', searchInput.value);
        }
    });

    const addButton = document.getElementById('table-add');
    if (addButton) {
        addButton.addEventListener('click', addRow);
    }

    const syncButton = document.getElementById('table-sync');
    if (syncButton) {
        syncButton.addEventListener('click', syncData);
    }
}
