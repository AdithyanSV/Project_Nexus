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

    $data = json_decode(file_get_contents('php://input'), true);

    // Debugging: Check if $data is null
    if ($data === null) {
        echo json_encode(array("success" => false, "message" => "Invalid JSON received"));
        exit;
    }

    $email = $data['email'];
    $password = $data['password'];

    // Use prepared statement to prevent SQL injection
    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            // Password is correct, set session variables
            $_SESSION["email"] = $email;
            $_SESSION["loggedin"] = true;

            // Set cookie with expiration time (example: 1 hour)
            $cookie_name = "user_email";
            $cookie_value = $email;
            $cookie_expire = time() + (3600); // 1 hour
            setcookie($cookie_name, $cookie_value, $cookie_expire, "/"); // "/" means the cookie is available across the entire domain
        

            // Print message
            echo json_encode(array("success" => true, "message" => "Cookie set successfully"));
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
