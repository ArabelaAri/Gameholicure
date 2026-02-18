<?php
include "data.php";

$data = json_decode(file_get_contents("php://input"), true);
$conn = new mysqli($host, $user, $psw, $db);
if ($conn->connect_error) {
  echo json_encode(["success" => false]);
  exit;
}
$coins = $data["coins"];
$id = $data["user_id"];

$stmt = $conn->prepare("SELECT * FROM Users WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
  $row = $result->fetch_assoc();
  if ($coins!= 0) {
    $newCoins = $row["coins"] + $coins;
    $updateStmt = $conn->prepare("UPDATE Users SET coins = ? WHERE id = ?");
    $updateStmt->bind_param("ii", $newCoins, $id);
    $updateStmt->execute();
    $updateStmt->close();
  }
  echo json_encode(["success" => true, "username" => $row["username"], "email" => $row["email"], "coins" => $row["coins"]]);
} else {
  echo json_encode(["success" => false, "message" => "Uživatel neexistuje"]);
}