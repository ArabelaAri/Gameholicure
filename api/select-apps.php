<?php
include "data.php";


$data = json_decode(file_get_contents("php://input"), true);
$conn = new mysqli($host, $user, $psw, $db);

if ($conn->connect_error) {
  echo json_encode([ "success" => false]);
  exit;
}

$apps = $data["apps"];
$user_id = $data["user_id"];

foreach ($apps as $appUser) {
    $name = $appUser["name"];
    $exe_name = $appUser["exe_name"];
    $last_opened = $appUser["last_opened"];

    $stmt = $conn->prepare("SELECT id FROM Apps WHERE name = ? AND exe_name = ?");
    $stmt->bind_param("ss", $name, $exe_name);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($app_id);
        $stmt->fetch();
    } else {
        $stmt_insert = $conn->prepare("INSERT INTO Apps (name, exe_name) VALUES (?, ?)");
        $stmt_insert->bind_param("ss", $name, $exe_name);
        $stmt_insert->execute();
        $app_id = $stmt_insert->insert_id;
        $stmt_insert->close();
    }
    $stmt->close();

    $stmt_log = $conn->prepare("SELECT id FROM App_usage_log WHERE user_id = ? AND app_id = ?");
    $stmt_log->bind_param("ii", $user_id, $app_id);
    $stmt_log->execute();
    $stmt_log->store_result();

    if ($stmt_log->num_rows > 0) {
        $stmt_log_update = $conn->prepare("UPDATE App_usage_log SET last_opened = ? WHERE user_id = ? AND app_id = ?");
        $stmt_log_update->bind_param("sii", $last_opened, $user_id, $app_id);
        $stmt_log_update->execute();
        $stmt_log_update->close();
    } else {
        $stmt_log_insert = $conn->prepare("INSERT INTO App_usage_log (user_id, app_id, last_opened) VALUES (?, ?, ?)");
        $stmt_log_insert->bind_param("iis", $user_id, $app_id, $last_opened);
        $stmt_log_insert->execute();
        $stmt_log_insert->close();
    }
    $stmt_log->close();
}




