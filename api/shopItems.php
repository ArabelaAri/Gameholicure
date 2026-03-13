<?php
include "data.php";

$data = json_decode(file_get_contents("php://input"), true);
$conn = new mysqli($host, $user, $psw, $db);
if ($conn->connect_error) {
  echo json_encode(["success" => false]);
  exit;
}


$items = [];

$stmt = $conn->prepare("
  SELECT name, type, price
  FROM Items
  WHERE 1
");

$stmt->execute();
$result = $stmt->get_result();
while ($row = $result->fetch_assoc()) {
    $items[] = [
        "name" => $row["name"],
        "type" => $row["type"],
        "price" => $row["price"]
    ];
}
$stmt->close();

echo json_encode([
    "success" => true,
    "items" => $items
]);