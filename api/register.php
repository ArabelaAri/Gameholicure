<?php
include "data.php";

//Získání dat odeslaných pomocí JSON. 
// File_get_contents("php://input") načte surová data z těla požadavku a json_decode je převede na asociativní pole.
$data = json_decode(file_get_contents("php://input"), true);

//Password_default určuje, že se použije nejnovější algoritmus pro hash hesla(aktuálně bcrypt).
$passwordHash = password_hash(  $data["password"],  PASSWORD_DEFAULT);

$conn = new mysqli($host, $user, $psw, $db);

if ($conn->connect_error) {
  echo json_encode([ "success" => false]);
  exit;
}

$stmt = $conn->prepare("SELECT COUNT(*) FROM Users WHERE username = ?");
$stmt->bind_param("s", $data["username"]);
$stmt->execute();
$stmt->bind_result($count);
$stmt->fetch();

if ($count > 0) {
    echo json_encode(["success" => false, "message" => "Uživatel již existuje"]);
    exit;
} 

$stmt->close();
$stmt = $conn->prepare( "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)");

$stmt->bind_param(
"sss",
$data["username"],
$data["email"],
$passwordHash
);

$stmt->execute();

echo json_encode(["success" => true]);

$stmt->close();
$conn->close();



