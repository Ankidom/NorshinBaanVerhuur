document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("edit-form");
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const sportSelect = document.getElementById("sport");
    const baanSelect = document.getElementById("baan");

    // Ophalen reservering ID uit de URL
    const urlParams = new URLSearchParams(window.location.search);
    const reserveringId = urlParams.get('id');

    // Fetch de reservering data
    fetch(`http://localhost:3000/reserveringen/${reserveringId}`)
        .then(response => response.json())
        .then(reservering => {
            // Vul de velden met de opgehaalde data
            document.getElementById('email').value = reservering.user_email;
            document.getElementById('email-hidden').value = reservering.user_email;
            document.getElementById('extra-ballen').value = reservering.extra_ballen;
            document.getElementById('extra-racket').value = reservering.extra_racket;
            document.getElementById('datum').value = reservering.datum;
            document.getElementById('tijd').value = reservering.tijd;

            // Roep updateTijdslots aan met de gereserveerde tijd
            updateTijdslots(reservering.tijd);

            // Vuur een change event op de sport select om de bijbehorende banen op te halen
            var event = new Event('change');
            sportSelect.dispatchEvent(event);
        })
        .catch(error => console.error('Fout bij het ophalen van de reservering:', error));

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessage.textContent = ''; // Wis eerdere foutmelding
        successMessage.style.display = 'none'; // Verberg eerdere succesmelding

        const data = {
            user_email: document.getElementById('email-hidden').value,
            extra_ballen: parseInt(document.getElementById('extra-ballen').value),
            extra_racket: parseInt(document.getElementById('extra-racket').value),
            datum: document.getElementById('datum').value,
            tijd: document.getElementById('tijd').value
        };

        try {
            const response = await fetch(`http://localhost:3000/reserveringen/${reserveringId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                console.log('Reservering succesvol gewijzigd');
                successMessage.style.display = 'block'; // Toon succesmelding
            } else {
                const errorData = await response.json(); // Parseer de foutinformatie als JSON
                errorMessage.textContent = errorData.message; // Gebruik het berichtveld van de error data
            }
        } catch (error) {
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

    function updateTijdslots(reservedTime) {
        const selectedDate = new Date(document.getElementById("datum").value);
        const currentDate = new Date();

        selectElement.innerHTML = "";
        let availableTijdslots = 0;

        const optionElement = document.createElement("option");
        optionElement.value = reservedTime;
        optionElement.textContent = reservedTime;
        selectElement.appendChild(optionElement);
        availableTijdslots++;

        for (let i = 0; i < tijdslots.length; i++) {
            const [hour, minutes] = tijdslots[i].split(":");
            const slotDate = new Date(selectedDate);
            slotDate.setHours(hour);
            slotDate.setMinutes(minutes);

            if (slotDate > currentDate) {
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

    document.getElementById("datum").addEventListener("change", function () {
        updateTijdslots(document.getElementById('tijd').value);
    });

    sportSelect.addEventListener("change", function () {
        const selectedSport = sportSelect.value;
        if (selectedSport) {
            fetch(`http://localhost:3000/courts/bySport?sport=${selectedSport}`)
                .then(response => response.json())
                .then(courts => updateBaanOptions(courts))
                .catch(error => console.error('Fout bij het ophalen van banen:', error));
        } else {
            baanSelect.innerHTML = "";
        }
    });
});
