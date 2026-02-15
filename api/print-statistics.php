<?php
include "data.php";

$data = json_decode(file_get_contents("php://input"), true);
$conn = new mysqli($host, $user, $psw, $db);

if ($conn->connect_error) {
  echo json_encode(["success" => false]);
  exit;
}

$user_id = $data["user_id"];

$appsUser = array();
$timesToPrint = array();

function getTimeSince(DateTime $date) {
    $now = new DateTime();
    $diff = $now->diff($date);

    return array(
        "years" => $diff->y,
        "months" => $diff->m,
        "days" => $diff->d,
        "hours" => $diff->h,
        "minutes" => $diff->i
    );
}


$stmt = $conn->prepare("
  SELECT Apps.name, Apps.exe_name, App_usage_log.last_opened
  FROM App_usage_log
  JOIN Apps ON Apps.id = App_usage_log.app_id
  WHERE App_usage_log.user_id = ?
");

$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->bind_result($name, $exe_name, $last_opened);

while ($stmt->fetch()) {
    $appsUser[] = array(
        "name" => $name,
        "exe_name" => $exe_name,
        "last_opened" => $last_opened,
        "time_since" => getTimeSince(new DateTime($last_opened))
    );
}

$stmt->close();

echo json_encode([
    "success" => true,
    "appsUser" => $appsUser,
]);
