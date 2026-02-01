<?php
include "data.php";


$data = json_decode(file_get_contents("php://input"), true);
$conn = new mysqli($host, $user, $psw, $db);

if ($conn->connect_error) {
  echo json_encode([ "success" => false]);
  exit;
}

$apps = $data["apps"];
$apps_exe = $data["apps_exe"];
for ($i = 0; $i < count($apps); $i++) {
  $stmt = $conn->prepare("SELECT COUNT(*) FROM Apps WHERE name = ? AND exe_name = ?");
  $stmt->bind_param("ss", $apps[$i], $apps_exe[$i]);
  $stmt->execute();
  $stmt->bind_result($count);
  $stmt->fetch();

  if ($count == 0) {
    $stmt->close();
    $stmt = $conn->prepare( "INSERT INTO Apps (name, exe_name) VALUES (?, ?)");
    $stmt->bind_param("ss", $apps[$i], $apps_exe[$i]);
    $stmt->execute();
  } 
  $stmt->close();
}
echo json_encode(["success" => true]);
/*$stmt = $conn->prepare("SELECT COUNT(*) FROM App_usage_log WHERE name = ? AND exe_name = ?");
$stmt->bind_param("ss", $data["name"], $data["exe_name"]);
$stmt->execute();
$stmt->bind_result($count);
$stmt->fetch();*/



