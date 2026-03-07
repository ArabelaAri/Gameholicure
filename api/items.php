<?php
include "data.php";

$data = json_decode(file_get_contents("php://input"), true);
$conn = new mysqli($host, $user, $psw, $db);
if ($conn->connect_error) {
  echo json_encode(["success" => false]);
  exit;
}

$id = $data["user_id"];
$items = [];
$charId = 3;
$bgId = 11;
$isActive = TRUE;


$stmt = $conn->prepare("
  SELECT Items.name, Items.type, Items.price, Bought_items.is_active 
  FROM Bought_items
  JOIN Items ON Bought_items.item_id = Items.id
  JOIN Users ON Bought_items.user_id = Users.id
  WHERE Users.id = ?
");

$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows == 0) {
    $stmt2 = $conn->prepare("
    INSERT INTO Bought_items (user_id, item_id, is_active) 
    VALUES (?, ?, ?), (?, ?, ?)
    ");
    $stmt2->bind_param(
    "iiiiii",
    $id, $charId, $isActive,
    $id, $bgId, $isActive
    );
    $stmt2->execute();
    $stmt2->close();
    $stmt->execute();
    $result = $stmt->get_result();
}
while ($row = $result->fetch_assoc()) {
    $items[] = [
        "name" => $row["name"],
        "type" => $row["type"],
        "price" => $row["price"],
        "is_active" => $row["is_active"]
    ];
}
$stmt->close();

echo json_encode([
    "success" => true,
    "items" => $items
]);