<?php
header('Content-Type: application/json');

if (isset($_GET['register_no'])) {
    $register_no = $_GET['register_no'];

    $conn = new mysqli('localhost', 'root', '', 'project1');

    if ($conn->connect_error) {
        echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
        exit();
    }

    $stmt = $conn->prepare('SELECT * FROM admin WHERE email = ?');
    $stmt->bind_param('s', $register_no);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode($row);
    } else {
        echo json_encode(['error' => 'No records found for register_no: ' . $register_no]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'No register_no provided']);
}
?>