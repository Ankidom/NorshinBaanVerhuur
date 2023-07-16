document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("reserveren-form");
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const failedMessage = document.getElementById('failed-message');
    const sportSelect = document.getElementById("sport");
    const baanSelect = document.getElementById("baan");

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessage.textContent = ''; // Wis eerdere foutmelding
        successMessage.style.display = 'none'; // Verberg eerdere succesmelding
        failedMessage.style.display = 'none';

        try {
            const response = await fetch('http://localhost:3000/reserveren', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: document.getElementById('email').value,
                    sport: document.getElementById('sport').value,
                    baan: document.getElementById('baan').value,
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
                const errorData = await response.json(); // Parseer de foutinformatie als JSON
                errorMessage.style.display = 'block'; // Toon errorMessage

                // Als de server een foutbericht stuurt, toon deze, anders toon een generieke foutmelding
                if (errorData.message) {
                    errorMessage.textContent = errorData.message;
                } else {
                    errorMessage.textContent = 'Er is een fout opgetreden bij het verwerken van de reservering.';
                }
            }
        } catch (error) {
            // Toon de foutmelding
            errorMessage.textContent = 'Er is een fout opgetreden bij het verzenden van de reservering.';
        }
    });

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

    function updateBaanOptions(courts) {
        const baanSelect = document.getElementById("baan");

        // Reset baanSelect
        baanSelect.innerHTML = "";

        // Voeg banen toe aan baanSelect
        for (const court of courts) {
            const optionElement = document.createElement("option");
            optionElement.value = court.id;
            optionElement.textContent = court.id + " " + court.court_type + " " + court.location;
            baanSelect.appendChild(optionElement);
        }
    }
    document.getElementById("datum").addEventListener("change", updateTijdslots);
    document.getElementById("datum").valueAsDate = new Date();
    updateTijdslots();

    sportSelect.addEventListener("change", function () {
        // Fetch banen op basis van sporttype
        const selectedSport = sportSelect.value;
        if (selectedSport) {
            fetch(`http://localhost:3000/courts/bySport?sport=${selectedSport}`)
                .then(response => response.json())
                .then(courts => updateBaanOptions(courts))
                .catch(error => console.error('Fout bij het ophalen van banen:', error));
        } else {
            // Reset baanSelect als geen sporttype is geselecteerd
            baanSelect.innerHTML = "";
        }
    });
});
