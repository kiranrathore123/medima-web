// header("Access-Control-Allow-Origin: *");
// header("Content-Type: application/json");

// $pdo = new PDO("mysql:host=localhost;dbname=medicine_db", "root", "");
// $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// $data = json_decode(file_get_contents("php://input"), true);
// $disease = $data["disease"] ?? "";
// $description = $data["description"] ?? "";

// try {
// $stmt = $pdo->prepare("INSERT INTO khurak (disease, description) VALUES (?, ?)");
// $stmt->execute([$disease, $description]);
// echo json_encode(["status" => "success", "message" => "Khurak saved successfully"]);
// } catch (Exception $e) {
// echo json_encode(["status" => "error", "message" => $e->getMessage()]);
// }

<?php
file_put_contents("debug.txt", file_get_contents("php://input")); // log raw JSON

$pdo = new PDO("mysql:host=localhost;dbname=medicine_db", "root", "");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$data = json_decode(file_get_contents("php://input"), true);
$disease = $data["disease"] ?? "";
$description = $data["description"] ?? "";

$stmt = $pdo->prepare("INSERT INTO khurak (disease, description) VALUES (?, ?)");
$stmt->execute([$disease, $description]);

echo "<div class='text-success'>Khurak saved successfully!</div>";
