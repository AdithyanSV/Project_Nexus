<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    exit(0);
}

function log_with_timestamp($data) {
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = "[$timestamp] " . $data . PHP_EOL;
    file_put_contents('php_debug.log', $log_entry, FILE_APPEND);
}

function generate_student_data() {
    return [
        [
            "name" => "Alice Smith",
            "email" => "alice.smith@example.com",
            "phone_no" => "1234567890",
            "address" => [
                "city" => "London",
                "country" => "United Kingdom",
                "Pin" => "123456"
            ],
            "date_of_birth" => "2008-01-01",
            "admission_number" => "20240001",
            "roll_number" => "1",
            "class" => "IT",
            "division" => "A",
            "age" => "20",
            "marks" => [
                "sub1" => 85,
                "sub2" => 90,
                "sub3" => 88,
                "sub4" => 78,
                "sub5" => 82
            ],
            "attendance" => [
                "240101" => ["sub1" => 1, "sub2" => 0, "sub3" => 1, "sub4" => 1, "sub5" => 1],
                "240102" => ["sub1" => 1, "sub2" => 0, "sub3" => 1, "sub4" => 1, "sub5" => 0],
                "240103" => ["sub1" => 1, "sub2" => 0, "sub3" => 1, "sub4" => 1, "sub5" => 1],
                "240104" => ["sub1" => 0, "sub2" => 1, "sub3" => 1, "sub4" => 0, "sub5" => 0],
                "240105" => ["sub1" => 1, "sub2" => 1, "sub3" => 1, "sub4" => 1, "sub5" => 1]
            ]
        ],
        // Add other students similarly
    ];
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
    echo json_encode($response);
    exit(0);
}

$response = [
    'status' => 'error',
    'message' => 'Unknown request type.'
];

if (isset($input['type'])) {
    switch ($input['type']) {
        case 'stAdmin':
            $response = [
                'status' => 'success',
                'message' => 'Data retrieved successfully!',
                'data' => generate_student_data()
            ];
            break;

        case 'stSync':
            // Here you should handle the actual synchronization, e.g., updating your database
            // Currently, just log and return success for the sake of this example
            log_with_timestamp("Sync Data: " . json_encode($input));
            $response = [
                'status' => 'success',
                'message' => 'Data synchronized successfully!'
            ];
            break;

        case 'farewell':
            $response = [
                'status' => 'success',
                'message' => 'Goodbye, ' . (isset($input['name']) ? htmlspecialchars($input['name'], ENT_QUOTES, 'UTF-8') : 'Friend') . '!',
            ];
            break;

        case 'info':
            $response = [
                'status' => 'success',
                'info' => [
                    'server_time' => date('Y-m-d H:i:s'),
                    'server_name' => gethostname()
                ],
            ];
            break;

        default:
            $response = [
                'status' => 'error',
                'message' => 'Unknown type: ' . htmlspecialchars($input['type'], ENT_QUOTES, 'UTF-8')
            ];
            break;
    }
} else {
    $response = [
        'status' => 'error',
        'message' => 'Type not provided in the request.'
    ];
}

log_with_timestamp("Response: " . json_encode($response));
echo json_encode($response);
?>
