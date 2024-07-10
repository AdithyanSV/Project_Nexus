document.addEventListener("DOMContentLoaded", () => {
    // Define all the elements
    const signup = document.getElementById("signup");
    const login = document.getElementById("login");
    const forgot = document.getElementById("forgot");
    const goBack = document.getElementById("goBack");
    const goBackBtn = document.getElementById("goBackBtn");
    const loginButton = document.querySelector('.form.signIn .loginBtn');
    const registerButton = document.querySelector('.form.register .loginBtn');
    const verifyMailBtn = document.getElementById('verifyMailBtn');

    // Check if elements exist before adding event listeners
    if (loginButton) {
        loginButton.addEventListener("click", (e) => {
            e.preventDefault();
            handleLogin();
        });
    } else {
        console.error("Login button not found");
    }

    if (registerButton) {
        registerButton.addEventListener("click", (e) => {
            e.preventDefault();
            handleRegister();
        });
    } else {
        console.error("Register button not found");
    }

    if (signup) {
        signup.addEventListener("click", () => {
            showForm("register");
        });
    } else {
        console.error("Signup element not found");
    }

    if (forgot) {
        forgot.addEventListener("click", () => {
            showForm("forgot");
        });
    } else {
        console.error("Forgot element not found");
    }

    if (login) {
        login.addEventListener("click", () => {
            showForm("signIn");
        });
    } else {
        console.error("Login element not found");
    }

    if (goBack) {
        goBack.addEventListener("click", () => {
            showForm("signIn");
        });
    } else {
        console.error("GoBack element not found");
    }

    if (goBackBtn) {
        goBackBtn.addEventListener("click", () => {
            showForm("signIn");
        });
    } else {
        console.error("GoBackBtn element not found");
    }

    if (verifyMailBtn) {
        verifyMailBtn.addEventListener("click", () => {
            validateEmail();
        });
    } else {
        console.error("VerifyMailBtn element not found");
    }
});

function isEmailValid(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return regex.test(email);
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
    console.log('cookie Set');
}

function handleLogin() {
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

    sendDataToDatabase('login.php', loginData)
        .then(response => {
            if (response.success) {
                setCookie('username', 'response.username', 30);
                setCookie('userid', 'response.register_no', 30);
                alert("Login successful!");
                window.location.href = 'stDash.html'; // Redirect to the next page after successful login
            } else {
                alert("Invalid credentials. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred. Please try again later.");
        });
}

function handleRegister() {
    const email = document.getElementById("registerEmail").value;
    const registerNumber = document.getElementById("registerNumber").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!isEmailValid(email)) {
        alert("Invalid email format.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    const registerData = { email, register_no: registerNumber, password };

    sendDataToDatabase('register.php', registerData)
        .then(response => {
            if (response.success) {
                alert("Registration successful! Please log in.");
                showForm("signIn"); // Show login form after successful registration
            } else {
                alert("Registration failed. " + response.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred. Please try again later.");
        });
}

function sendDataToDatabase(url, data) {
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

function validateEmail() {
    const email = document.getElementById("verifyMail").value;

    if (!isEmailValid(email)) {
        alert("Invalid email format.");
        return;
    }

    // Add logic to send a password reset email or handle the validation
    // This function is a placeholder and should be implemented according to your backend logic
}

function showForm(formClass) {
    const forms = document.querySelectorAll(".form");
    forms.forEach(form => {
        form.style.display = form.classList.contains(formClass) ? "block" : "none";
    });
}
