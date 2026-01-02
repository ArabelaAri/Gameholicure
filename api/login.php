<?php
include "data.php";

$data = json_decode(file_get_contents("php://input"), true);

$passwordHash = password_hash(  $data["password"],  PASSWORD_DEFAULT);

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
    echo json_encode(["success" => true]);
  } else {
    echo json_encode(["success" => false, "message" => "Nesprávné heslo"]);
  }
} else {
  echo json_encode(["success" => false, "message" => "Uživatel neexistuje"]);
}