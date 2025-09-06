<?php
include "db.php";
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Get search term from GET request
$search = isset($_GET['query']) ? $conn->real_escape_string($_GET['query']) : '';

$result = $conn->query("SELECT * FROM medicines WHERE name LIKE '%$search%'");

$medicines = [];

while ($row = $result->fetch_assoc()) {
    $medicines[] = $row;
}

header('Content-Type: application/json');
echo json_encode($medicines);
?>