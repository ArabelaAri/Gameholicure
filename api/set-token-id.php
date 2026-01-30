<?php
include "data.php";

$data = json_decode(file_get_contents("php://input"), true);
$conn = new mysqli($host, $user, $psw, $db);

if ($conn->connect_error) {
  echo json_encode([ "success" => false]);
  exit;
}

$stmt = $conn->prepare( "SELECT * FROM User_sessions WHERE token = ?");
$stmt->bind_param("s", $data["token"]);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
  $row = $result->fetch_assoc();
    echo json_encode(["success" => true, "user_id" => $row["user_id"]]);
  } else {
    echo json_encode(["success" => false, "message" => "Neplatný token"]);
  }

