document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.querySelector('.form.signIn .loginBtn');

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Login button clicked");
        handleLogin();
    });
});

function isEmailValid(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\@\"]+\.)+[^<>()[\]\\.,;:\@\"]{2,})$/i;
    return regex.test(email);
}

function handleLogin() {
    console.log("Handle Login Called");
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!isEmailValid(email)) {
        alert("Invalid email format.");
        return;
    }

    if (password.trim() === "") {
        alert("Password cannot be empty.");
        return;
    }

    const loginData = { email, password };
    console.log("Sending login data:", loginData);

    sendDataToDatabase('teacherlogin.php', loginData)
        .then(response => {
            console.log("Response received:", response); // Log the response for debugging
            if (response.success) {
                alert("Login successful!");
                window.location.href = 'teDash.html'; // Redirect to the next page after successful login
            } else {
                alert("Login failed: " + response.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred. Please try again later.");
        });
}

function sendDataToDatabase(url, data) {
    console.log("Sending data to:", url);
    console.log("Data:", data);

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    });
}
