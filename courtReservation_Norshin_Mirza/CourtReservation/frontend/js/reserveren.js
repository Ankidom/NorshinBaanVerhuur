// reserveren.js

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("reserveren-form");
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessage.textContent = ''; // Wis eerdere foutmelding
        successMessage.style.display = 'none'; // Verberg eerdere succesmelding

        try {
            const response = await fetch('/reserveren', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    naam: document.getElementById('naam').value,
                    sport: document.getElementById('sport').value,
                    baan: document.getElementById('sport').value === 'tennis' ? document.getElementById('tennisbaan').value : document.getElementById('padelbaan').value,
                    extra_ballen: parseInt(document.getElementById('extra-ballen').value),
                    extra_racket: parseInt(document.getElementById('extra-racket').value),
                    datum: document.getElementById('datum').value,
                    tijd: document.getElementById('tijd').value
                })
            });

            if (response.ok) {
                // Reservering succesvol verwerkt
                console.log('Reservering succesvol verwerkt');
                successMessage.style.display = 'block'; // Toon succesmelding
                // Voeg hier eventuele acties toe na een succesvolle reservering
            } else {
                // Fout bij het verwerken van de reservering
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
        } catch (error) {
            // Toon foutmelding
            errorMessage.textContent = error.message;
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const selectElement = document.getElementById("tijd");
    const availabilityMessage = document.getElementById("availability-message");

    const tijdslots = [
        "08:00", "09:00", "10:00", "11:00",
        "12:00", "13:00", "14:00", "15:00",
        "16:00", "17:00", "18:00", "19:00",
        "20:00", "21:00", "22:00"
    ];

    /**
     * Functie voor het bijwerken van beschikbare tijdslots op basis van geselecteerde datum
     */
    function updateTijdslots() {
        const selectedDate = new Date(document.getElementById("datum").value);
        const currentDate = new Date();

        selectElement.innerHTML = "";
        let availableTijdslots = 0;

        for (let i = 0; i < tijdslots.length; i++) {
            const [hour, minutes] = tijdslots[i].split(":");
            const slotDate = new Date(selectedDate);
            slotDate.setHours(hour);
            slotDate.setMinutes(minutes);

            if (slotDate >= currentDate || selectedDate > currentDate) {
                const optionElement = document.createElement("option");
                optionElement.value = tijdslots[i];
                optionElement.textContent = tijdslots[i];
                selectElement.appendChild(optionElement);
                availableTijdslots++;
            }
        }

        if (availableTijdslots === 0) {
            availabilityMessage.textContent = "Sorry, op dit moment zijn er geen tijden beschikbaar. Probeer een andere dag.";
        } else {
            availabilityMessage.textContent = "";
        }
    }

    // Luister naar wijzigingen in de datumselectie en update tijdslots dienovereenkomstig
    document.getElementById("datum").addEventListener("change", updateTijdslots);

    // Stel de huidige datum in bij het laden van de pagina
    document.getElementById("datum").valueAsDate = new Date();

    // Voer de functie uit om tijdslots bij te werken
    updateTijdslots();
});

document.addEventListener("DOMContentLoaded", function () {
    const sportSelect = document.getElementById("sport");
    const tennisbaanLabel = document.getElementById("tennisbaanLabel");
    const tennisbaanSelect = document.getElementById("tennisbaan");
    const padelbaanLabel = document.getElementById("padelbaanLabel");
    const padelbaanSelect = document.getElementById("padelbaan");

    /**
     * Functie voor het verwerken van de selectie van sporttype
     */
    function handleSportSelection() {
        const selectedSport = sportSelect.value;

        tennisbaanLabel.style.display = "none";
        tennisbaanSelect.style.display = "none";
        tennisbaanSelect.disabled = true;
        padelbaanLabel.style.display = "none";
        padelbaanSelect.style.display = "none";
        padelbaanSelect.disabled = true;
        tennisbaanSelect.selectedIndex = 0;
        padelbaanSelect.selectedIndex = 0;

        if (selectedSport === "tennis") {
            tennisbaanLabel.style.display = "block";
            tennisbaanSelect.style.display = "block";
            tennisbaanSelect.disabled = false;
        } else if (selectedSport === "padel") {
            padelbaanLabel.style.display = "block";
            padelbaanSelect.style.display = "block";
            padelbaanSelect.disabled = false;
        }
    }

    // Luister naar wijzigingen in de sportselectie en verwerk deze
    sportSelect.addEventListener("change", handleSportSelection);
});
