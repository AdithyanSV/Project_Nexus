document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var formData = {
        email: document.getElementById('email').value,
        register_no: document.getElementById('register_no').value,
        password: document.getElementById('password').value
    };

    fetch('register.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registration successful!');
        } else {
            alert('Registration failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
