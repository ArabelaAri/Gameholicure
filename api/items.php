<?php
include "data.php";

$data = json_decode(file_get_contents("php://input"), true);
$conn = new mysqli($host, $user, $psw, $db);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Connection failed"]);
    exit;
}

$id = $data["user_id"];
$itemToUpdate = $data["item_to_update"];

$charId = 3;
$bgId = 11;
$isActive = 1; 

if ($itemToUpdate !== 0 ) {
    $itemId = $itemToUpdate["id"];
    $itemType = $itemToUpdate["type"];
    $stmtDeactivate = $conn->prepare("
        UPDATE Bought_items 
        JOIN Items ON Bought_items.item_id = Items.id
        SET Bought_items.is_active = 0
        WHERE Bought_items.user_id = ? AND Items.type = ?
    ");
    $stmtDeactivate->bind_param("is", $id, $itemType);
    $stmtDeactivate->execute();
    $stmtDeactivate->close();

    $stmtCheck = $conn->prepare("SELECT item_id FROM Bought_items WHERE user_id = ? AND item_id = ?");
    $stmtCheck->bind_param("ii", $id, $itemId);
    $stmtCheck->execute();
    $resCheck = $stmtCheck->get_result();

    if ($resCheck->num_rows == 0) {
        $stmtInsert = $conn->prepare("INSERT INTO Bought_items (user_id, item_id, is_active) VALUES (?, ?, ?)");
        $stmtInsert->bind_param("iii", $id, $itemId, $isActive);
        $stmtInsert->execute();
        $stmtInsert->close();
    } else {
        $stmtUpdate = $conn->prepare("UPDATE Bought_items SET is_active = ? WHERE user_id = ? AND item_id = ?");
        $stmtUpdate->bind_param("iii", $isActive, $id, $itemId);
        $stmtUpdate->execute();
        $stmtUpdate->close();
    }
    $stmtCheck->close();
}


$stmt = $conn->prepare("
    SELECT Items.id, Items.name, Items.type, Items.price, Bought_items.is_active 
    FROM Bought_items
    JOIN Items ON Bought_items.item_id = Items.id
    WHERE Bought_items.user_id = ?
");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();


if ($result->num_rows == 0) {
    $stmtDefault = $conn->prepare("INSERT INTO Bought_items (user_id, item_id, is_active) VALUES (?, ?, ?), (?, ?, ?)");
    $stmtDefault->bind_param("iiiiii", $id, $charId, $isActive, $id, $bgId, $isActive);
    $stmtDefault->execute();
    $stmtDefault->close();
    
    $stmt->execute();
    $result = $stmt->get_result();
}

$items = [];
while ($row = $result->fetch_assoc()) {
    $items[] = [
        "id" => $row["id"],
        "name" => $row["name"],
        "type" => $row["type"],
        "price" => $row["price"],
        "is_active" => (bool)$row["is_active"]
    ];
}
$stmt->close();

echo json_encode([
    "success" => true,
    "items" => $items
]);
?>