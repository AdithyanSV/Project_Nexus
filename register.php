<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

$email = $input['email'];
$register_no = $input['register_no'];
$password = $input['password'];

$servername = "localhost";
$username = "root";
$password_db = ""; // your database password
$dbname = "project1";

// Create connection
$conn = new mysqli($servername, $username, $password_db, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the given data exists in the admin table
$sql = "SELECT id FROM admin WHERE email = ? AND register_no = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email, $register_no);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Admin data exists, insert into the users table
    $row = $result->fetch_assoc();
    $admin_id = $row['id'];

    $sql = "INSERT INTO users (email, register_no, id, password) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);
    $stmt->bind_param("ssis", $email, $register_no, $admin_id, $hashed_password);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Error inserting data into users table."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Admin data not found."]);
}

$conn->close();
?>
