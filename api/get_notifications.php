<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
include "db.php";
$low = $conn->query("SELECT * FROM medicines WHERE quantity < 10");
$soon = $conn->query("SELECT * FROM medicines WHERE expiry <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) AND quantity > 0");

$resp = ["lowStock" => [], "expiringSoon" => []];
while ($row = $low->fetch_assoc())
    $resp["lowStock"][] = $row;
while ($row = $soon->fetch_assoc())
    $resp["expiringSoon"][] = $row;
header('Content-Type: application/json');
echo json_encode($resp);
