<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
include "db.php";
$data = json_decode(file_get_contents("php://input"), true);
$name = $data['name'];
$expiry = $data['expiry'];
$qty = $data['quantity'];
$conn->query("UPDATE medicines SET quantity = quantity - $qty WHERE name='$name' AND expiry='$expiry'");
echo "Medicine sold.";
