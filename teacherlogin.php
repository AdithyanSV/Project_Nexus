<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Replace with your database connection code
    $servername = "localhost";
    $username = "root"; // Replace with your DB username if different
    $password = ""; // Replace with your DB password if different
    $dbname = "project1";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Retrieve JSON data
    $data = json_decode(file_get_contents('php://input'), true);

    // Debugging: Check if $data is null
    if ($data === null) {
        echo json_encode(array("success" => false, "message" => "Invalid JSON received"));
        exit;
    }

    // Extract email and password
    $email = $data['email'] ?? null;
    $password = $data['password'] ?? null;

    // Check if email and password are provided
    if ($email === null || $password === null) {
        echo json_encode(array("success" => false, "message" => "Email or password not provided"));
        exit;
    }

    // Use prepared statement to prevent SQL injection
    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(array("success" => false, "message" => "Prepare statement failed: " . $conn->error));
        exit;
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            // Password is correct, set session variables
            $_SESSION["email"] = $email;
            $_SESSION["loggedin"] = true;
            echo json_encode(array("success" => true));
        } else {
            echo json_encode(array("success" => false, "message" => "Invalid password"));
        }
    } else {
        echo json_encode(array("success" => false, "message" => "Email not found"));
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
}
?>
