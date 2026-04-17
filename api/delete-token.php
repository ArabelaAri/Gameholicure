<?php
include "data.php";

$data = json_decode(file_get_contents("php://input"), true);
$conn = new mysqli($host, $user, $psw, $db);

if ($conn->connect_error) {
  echo json_encode([ "success" => false]);
  exit;
}

$stmt = $conn->prepare( "DELETE FROM User_sessions WHERE token = ?");
$stmt->bind_param("s", $data["token"]);
$stmt->execute();

echo json_encode(["success" => true]);
