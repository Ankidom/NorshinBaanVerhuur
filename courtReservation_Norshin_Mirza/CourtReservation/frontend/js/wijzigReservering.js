let reservationId; // Declaratie van de variabele op een hoger niveau

// Haal de reservering ID op uit de URL-parameter en vul het reserveringsformulier in
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    reservationId = urlParams.get('id');

    // Functie om de reservering op te halen en in te vullen in het formulier
    function getReservation() {
        // Haal de reserveringsgegevens op via een GET-verzoek naar de backend met de reservering ID
        fetch(`/reserveringen/${reservationId}`)
            .then(response => response.json())
            .then(reservation => {
                // Vul het reserveringsformulier met de huidige reserveringsgegevens
                document.getElementById('naam').value = reservation.naam;
                document.getElementById('sport').value = reservation.sport;
                if (reservation.sport === 'tennis') {
                    document.getElementById('tennisbaanLabel').style.display = 'block';
                    document.getElementById('tennisbaan').style.display = 'block';
                    document.getElementById('tennisbaan').value = reservation.baan;
                } else if (reservation.sport === 'padel') {
                    document.getElementById('padelbaanLabel').style.display = 'block';
                    document.getElementById('padelbaan').style.display = 'block';
                    document.getElementById('padelbaan').value = reservation.baan;
                }
                document.getElementById('extra-ballen').value = reservation.extra_ballen;
                document.getElementById('extra-racket').value = reservation.extra_racket;
                document.getElementById('datum').value = reservation.datum;
                document.getElementById('tijd').value = reservation.tijd;
            })
            .catch(error => {
                console.error('Er is een fout opgetreden bij het ophalen van reserveringsgegevens:', error);
            });
    }

    // Roep de functie aan om de reservering op te halen en in te vullen
    getReservation();
});

// Functie voor het bijwerken van de beschikbare tijdslots op basis van de geselecteerde datum
document.addEventListener("DOMContentLoaded", function () {
    const selectElement = document.getElementById("tijd");
    const availabilityMessage = document.getElementById("availability-message");

    const tijdslots = [
        "08:00", "09:00", "10:00", "11:00",
        "12:00", "13:00", "14:00", "15:00",
        "16:00", "17:00", "18:00", "19:00",
        "20:00", "21:00", "22:00"
    ];

    function updateTijdslots() {
        const selectedDate = new Date(document.getElementById("datum").value);

        selectElement.innerHTML = "";
        let availableTijdslots = 0;

        for (let i = 0; i < tijdslots.length; i++) {
            const [hour, minutes] = tijdslots[i].split(":");
            const slotDate = new Date(selectedDate);
            slotDate.setHours(hour);
            slotDate.setMinutes(minutes);

            if (slotDate >= selectedDate) {
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

    document.getElementById("datum").addEventListener("change", updateTijdslots);

    // Stel de huidige datum in bij het laden van de pagina
    document.getElementById("datum").valueAsDate = new Date();

    updateTijdslots();
});

// Functie voor het tonen van specifieke velden op basis van de geselecteerde sport
document.addEventListener("DOMContentLoaded", function () {
    const sportSelect = document.getElementById("sport");
    const tennisbaanLabel = document.getElementById("tennisbaanLabel");
    const tennisbaanSelect = document.getElementById("tennisbaan");
    const padelbaanLabel = document.getElementById("padelbaanLabel");
    const padelbaanSelect = document.getElementById("padelbaan");

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

    sportSelect.addEventListener("change", handleSportSelection);
});

// Functie voor het verwerken van het formulier bij het wijzigen van een reservering
document.addEventListener("DOMContentLoaded", function () {
    const editForm = document.getElementById('edit-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    editForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessage.textContent = ''; // Wis eerdere foutmelding
        successMessage.style.display = 'none'; // Verberg eerdere succesmelding

        try {
            const response = await fetch(`/reserveringen/${reservationId}`, {
                method: 'PUT',
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
                // Reservering succesvol gewijzigd
                console.log('Reservering succesvol gewijzigd');
                successMessage.style.display = 'block'; // Toon succesmelding
                // Voeg hier eventuele acties toe na een succesvolle wijziging

                // Stuur de gebruiker naar een andere pagina (bijvoorbeeld de reserveringslijst)
                window.location.href = '/planning.html';
            } else {
                // Fout bij het wijzigen van de reservering
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
        } catch (error) {
            // Toon foutmelding
            errorMessage.textContent = error.message;
        }
    });
});
