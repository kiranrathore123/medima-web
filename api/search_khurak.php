<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new PDO("mysql:host=localhost;dbname=medicine_db", "root", "");

$query = $_GET['query'] ?? '';
$stmt = $conn->prepare("SELECT * FROM khurak WHERE disease LIKE ?");
$stmt->execute(["%$query%"]);

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>