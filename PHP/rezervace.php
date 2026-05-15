<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 1. Získání a očištění dat z formuláře (prevence proti vložení škodlivého kódu)
    $jmeno = htmlspecialchars($_POST['jmeno'] ?? 'Nezadáno');
    $email = htmlspecialchars($_POST['email'] ?? 'Nezadáno');
    $datum = htmlspecialchars($_POST['datum'] ?? 'Nezadáno');
    $cas   = htmlspecialchars($_POST['cas'] ?? 'Nezadáno');
    $typ   = htmlspecialchars($_POST['typ'] ?? 'Nezadáno');
    $pocet = htmlspecialchars($_POST['pocet'] ?? '1');

    // 2. Vytvoření úhledného záznamu
    $zaznam  = "=== NOVÁ REZERVACE (" . date("d.m.Y H:i:s") . ") ===\n";
    $zaznam .= "Jméno a příjmení: $jmeno\n";
    $zaznam .= "E-mail: $email\n";
    $zaznam .= "Termín návštěvy: $datum v $cas\n";
    $zaznam .= "Vstupenky: $pocet x $typ\n";
    $zaznam .= "------------------------------------------------\n\n";

    // 3. Uložení dat do souboru na serveru
    // Parametr FILE_APPEND zajistí, že se soubor nepřepíše, ale nová rezervace se přidá nakonec.
    file_put_contents('ulozene_rezervace.txt', $zaznam, FILE_APPEND);

    // 4. Odeslání potvrzení zpět do JavaScriptu
    $odpoved = [
        "status" => "success",
        "zprava" => "Rezervace pro $jmeno byla úspěšně uložena na server."
    ];
    
    echo json_encode($odpoved);

} else {
    // Pokud někdo zkusí otevřít tento soubor napřímo přes prohlížeč
    echo json_encode(["status" => "error", "zprava" => "Tento skript přijímá pouze POST data."]);
}
?>
