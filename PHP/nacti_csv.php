<?php
// rezervace.php
// Tento soubor tiše zpracovává požadavky z JavaScriptu (AJAX)

// Povolíme přijímání dat
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Zde PHP simuluje úspěšné přijetí dat
    $odpoved = [
        "status" => "success",
        "zprava" => "Data z formuláře byla úspěšně zachycena PHP skriptem na serveru."
    ];
    
    // Pošleme odpověď zpět do JavaScriptu
    echo json_encode($odpoved);

} else {
    // Pokud někdo zkusí otevřít tento soubor napřímo
    echo json_encode(["status" => "error", "zprava" => "Tento skript přijímá pouze POST data."]);
}
?>