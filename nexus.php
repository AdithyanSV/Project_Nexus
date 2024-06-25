<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    exit(0);
}

// Database configuration
$servername = "localhost";
$username = "root";
$password = "";  // Update this with your MySQL password
$dbname = "test_db";  // Update this with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

function log_with_timestamp($data) {
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = "[$timestamp] " . $data . PHP_EOL;
    file_put_contents('php_debug.log', $log_entry, FILE_APPEND);
}

$inputJSON = file_get_contents('php://input');
log_with_timestamp("Raw Input: " . $inputJSON);

$input = json_decode($inputJSON, TRUE);

if (json_last_error() !== JSON_ERROR_NONE) {
    $response = [
        'status' => 'error',
        'message' => 'Invalid JSON data received',
        'inputJSON' => $inputJSON,
        'error' => json_last_error_msg()
    ];
    log_with_timestamp("Error: " . json_last_error_msg());
} else {
    if (isset($input['type'])) {
        switch ($input['type']) {
            case 'greet':
                // Example database query
                $name = isset($input['name']) ? $conn->real_escape_string($input['name']) : 'Guest';
                $sql = "SELECT * FROM users WHERE name = '$name'";
                $result = $conn->query($sql);

                if ($result && $result->num_rows > 0) {
                    $user = $result->fetch_assoc();
                    $response = [
                        'status' => 'success',
                        'message' => 'Hello, ' . $user['name'] . '!',
                        'data' => $user
                    ];
                } else {
                    $response = [
                        'status' => 'success',
                        'message' => 'Hello, ' . $name . '!',
                        'data' => []
                    ];
                }

                echo json_encode($response);
                log_with_timestamp("Response: " . json_encode($response));
                exit(0);

            case 'farewell':
                $response = [
                    'status' => 'success',
                    'message' => 'Goodbye, ' . (isset($input['name']) ? $input['name'] : 'Friend') . '!',
                ];
                echo json_encode($response);
                log_with_timestamp("Response: " . json_encode($response));
                exit(0);

            case 'info':
                $response = [
                    'status' => 'success',
                    'info' => [
                        'server_time' => date('Y-m-d H:i:s'),
                        'server_name' => gethostname()
                    ],
                ];
                echo json_encode($response);
                log_with_timestamp("Response: " . json_encode($response));
                exit(0);

            default:
                $response = [
                    'status' => 'error',
                    'message' => 'Unknown type: ' . $input['type']
                ];
                echo json_encode($response);
                log_with_timestamp("Response: " . json_encode($response));
                exit(0);
        }
    } else {
        $input['received'] = true;
        $response = [
            'status' => 'success',
            'data' => $input
        ];
        log_with_timestamp("Response: " . json_encode($response));
    }
}

echo json_encode($response);

// Close the database connection
$conn->close();
?>
