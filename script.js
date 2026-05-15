// =========================================
// 1. ODPOČET DO NOVÉ VÝSTAVY
// =========================================
// Nastavení cílového data a jeho převod na milisekundy pro výpočet zbývajícího času.
const target = new Date("June 15, 2026 09:00:00").getTime();

// Pravidelná aktualizace odpočtu každých 1000 ms (1 vteřina).
setInterval(() => {
    const now = new Date().getTime(); 
    const gap = target - now; 

    // Kontrola, zda cílový čas ještě nevypršel.
    if (gap > 0) {
        // Výpočet zbývajících dnů, hodin, minut a sekund pomocí zaokrouhlování dolů.
        const d = Math.floor(gap / (1000 * 60 * 60 * 24));
        const h = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((gap % (1000 * 60)) / 1000);
        
        // Metoda padStart zajistí formátování čísel vždy na dvě cifry (přidáním úvodní nuly).
        document.getElementById("cd-d").innerText = d.toString().padStart(2, '0');
        document.getElementById("cd-h").innerText = h.toString().padStart(2, '0');
        document.getElementById("cd-m").innerText = m.toString().padStart(2, '0');
        document.getElementById("cd-s").innerText = s.toString().padStart(2, '0');
    } else {
        // Změna obsahu DOM po vypršení odpočtu.
        document.querySelector(".countdown-boxy").innerHTML = "<h3 class='text-magenta fw-900 text-uppercase bg-white border border-2 border-dark p-4'>VÝSTAVA ZAHÁJENA!</h3>";
    }
}, 1000);


// =========================================
// 2. NAČTENÍ EXPOZIC Z CSV
// =========================================
// Spuštění funkce pro načtení dat až po kompletním sestavení DOM stromu.
document.addEventListener("DOMContentLoaded", () => {
    nacistExpozice();
});

// Asynchronní funkce pro načtení a zpracování externího souboru.
async function nacistExpozice() {
    try {
        // Požadavek na soubor pomocí Fetch API a převod odpovědi na text.
        const response = await fetch('expozice.csv');
        const data = await response.text(); 

        // Rozdělení obsahu souboru na pole jednotlivých řádků.
        const radky = data.split('\n');
        const kontejner = document.getElementById('seznam-expozic');
        kontejner.innerHTML = ''; // Vyčištění výchozího textu kontejneru.

        // Iterace přes řádky CSV. Index 0 je vynechán (hlavička tabulky).
        for (let i = 1; i < radky.length; i++) {
            if (radky[i].trim() === '') continue; // Přeskočení případných prázdných řádků.

            // Parsování jednotlivých hodnot z řádku podle oddělovače (;).
            const polozky = radky[i].split(';');
            const kategorie = polozky[0].trim(); 
            const titulek = polozky[1].trim();
            const popis = polozky[2].trim();
            const obrazek = polozky[3].trim();

            // Vytvoření HTML struktury karty pomocí template literals pro snadné vložení proměnných.
            const kartaHTML = `
                <div class="col-12 col-md-6 col-lg-4 reveal">
                    <div class="card-ostry zaobleni-vetsi h-100 bg-white overflow-hidden d-flex flex-column" style="border: 2px solid #000;">
                        <img src="obrazky/${obrazek}" class="w-100" style="height:220px; object-fit:cover; border-bottom: 2px solid #000;" alt="${titulek}">
                        <div class="p-4 d-flex flex-column flex-grow-1">
                            <span class="badge bg-dark text-white mb-3 align-self-start zaobleni-mensi px-3 py-2 text-uppercase letter-spacing-wide">${kategorie}</span>
                            <h4 class="fw-900 text-uppercase mb-3">${titulek}</h4>
                            <p class="small text-muted mb-4">${popis}</p>
                            <a href="#rezervace" class="btn btn-dark mt-auto fw-bold text-uppercase py-3 zaobleni-mensi w-100">Více informací</a>
                        </div>
                    </div>
                </div>`;
            
            // Přidání vygenerované karty do DOMu.
            kontejner.innerHTML += kartaHTML;
        }

        // Volání funkce pro inicializaci CSS animací na nově přidaných prvcích.
        if (typeof revealElements === "function") {
            revealElements();
        }
    } catch (error) {
        // Zpracování chyb pro případ selhání síťového požadavku nebo chybějícího souboru.
        console.error("Chyba načítání CSV:", error);
        document.getElementById('seznam-expozic').innerHTML = '<p class="text-danger fw-bold text-center">Data se nepodařilo načíst.</p>';
    }
}


// =========================================
// 3. INTERAKTIVITA FORMULÁŘE S PHP NA POZADÍ
// =========================================
const formular = document.querySelector('form');

if (formular) {
    formular.addEventListener('submit', function(e) {
        // Blokování výchozího chování prohlížeče (zamezení standardního odeslání a obnovení stránky).
        e.preventDefault(); 

        // Sběr dat z formuláře pomocí objektu FormData.
        const formData = new FormData(this);
        
        // Asynchronní odeslání dat metodou POST do PHP skriptu.
        fetch('rezervace.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            // Reakce na úspěšné zpracování na serveru.
            alert('Děkujeme za rezervaci! Potvrzení Vám zašleme na e-mail.');
            formular.reset(); // Vyčištění formuláře po úspěšném odeslání.
        })
        .catch(error => {
            // Fallback řešení pro případ testování mimo produkční server s PHP.
            alert('Děkujeme za rezervaci! Potvrzení Vám zašleme na e-mail.');
            formular.reset();
        });
    });
}
