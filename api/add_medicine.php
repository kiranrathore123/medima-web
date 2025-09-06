<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$rawInput = file_get_contents("php://input");
file_put_contents("log.txt", $rawInput);  // for debugging

$data = json_decode($rawInput, true);

if ($data === null) {
    echo json_encode(["success" => false, "message" => "Invalid JSON.", "raw" => $rawInput]);
    exit;
}


if (
    isset(
    $data['name'],
    $data['expiry'],
    $data['mfg'],
    $data['rate'],
    $data['mrp'],
    $data['quantity']
)
) {
    $conn = new mysqli("localhost", "root", "", "medicine_db");

    if ($conn->connect_error) {
        echo json_encode(["success" => false, "message" => "DB Connection failed"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO medicines (name, expiry, mfg, rate, mrp, quantity) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "sssddi",
        $data['name'],
        $data['expiry'],
        $data['mfg'],
        $data['rate'],
        $data['mrp'],
        $data['quantity']
    );

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Medicine added successfully!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to insert."]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Incomplete data."]);
}
?>