<?php
include "data.php";

$data = json_decode(file_get_contents("php://input"), true);
$conn = new mysqli($host, $user, $psw, $db);

if ($conn->connect_error) {
  echo json_encode([ "success" => false]);
  exit;
}

$stmt = $conn->prepare( "SELECT * FROM Users WHERE username = ?");
$stmt->bind_param("s", $data["username"]);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
  $row = $result->fetch_assoc();
  if (password_verify($data["password"], $row["password"])) {
    $id = $row["id"]; 
    $token = bin2hex(random_bytes(32));

    $stmt2 = $conn->prepare( "INSERT INTO User_sessions (user_id, token) VALUES (?, ?)");
    $stmt2->bind_param("is", $id, $token);
    $stmt2->execute();

    echo json_encode(["success" => true, "token" => $token]);
  } else {
    echo json_encode(["success" => false, "message" => "Nesprávné heslo"]);
  }
} else {
  echo json_encode(["success" => false, "message" => "Uživatel neexistuje"]);
}

