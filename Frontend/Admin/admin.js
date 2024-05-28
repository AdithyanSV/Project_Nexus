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
    const headerRow = document.createElement("tr");
    tHead.classList.add('tableHead');
    headerRow.classList.add('tableHeadRow');

    // Iterate over the column titles array and create <th> elements
    columnTitles.forEach((title, index=0) => {
        const th = document.createElement("th");
        th.classList.add('tableHeadRow');
        th.id = `header${index + 1}`;
        th.textContent = title;
        headerRow.appendChild(th);
    });

    tHead.appendChild(headerRow);
    table.appendChild(tHead);

    // Create the table body (empty initially)
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    // Append the table to the container
    container.appendChild(table);
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
    console.log("In Admin Attendance Page");
    createTable("studentTable", ["Admission Number", "Name", "email", "phone"]);
}

function teacher() {
    console.log("In Admin Curriculum Page");
}







// tr:nth-child(even) {
//     background-color: #D6EEEE;
//   }
//CSS for adding seperate color to even rows

// tr {
//     border-bottom: 1px solid #ddd;
//   }
//Css for adding bottom border to rows

//tr:hover {background-color: #D6EEEE;}
//CSS for hover effect