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
$app_dates = $data["app_dates"];
$user_id = $data["user_id"];

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
  $stmt = $conn->prepare("SELECT id FROM Apps WHERE name = ? AND exe_name = ?");
  $stmt->bind_param("ss", $apps[$i], $apps_exe[$i]);
  $stmt->execute();
  $stmt->store_result();
  $stmt->bind_result($id);
  $stmt->fetch();
  $stmt->close();

  $stmt = $conn->prepare(
    "SELECT id FROM App_usage_log WHERE app_id = ? AND user_id = ?"
  );
  $stmt->bind_param("ii", $id, $user_id);
  $stmt->execute();
  $stmt->store_result();

  if ($stmt->num_rows == 0) {
    $stmt->close();
    $stmt = $conn->prepare("INSERT INTO App_usage_log (user_id, app_id, last_opened) VALUES (?, ?, ?)");
    $stmt->bind_param("iis", $user_id, $id, $app_dates[$apps[$i]]);
    $stmt->execute();
  }
  else {
    $stmt->close();
    $stmt = $conn->prepare("UPDATE App_usage_log SET last_opened = ? WHERE user_id = ? AND app_id = ?");
    $stmt->bind_param("sii", $app_dates[$apps[$i]],$user_id, $id);
    $stmt->execute();
  }
  $stmt->close();
  
}
echo json_encode(["success" => true]);




