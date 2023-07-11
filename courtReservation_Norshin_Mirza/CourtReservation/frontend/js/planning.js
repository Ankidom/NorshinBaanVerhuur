document.addEventListener("DOMContentLoaded", function () {
    const reservationsTable = document.getElementById("reservations-table");
    const currentDateElement = document.getElementById("current-date");
    const previousDayButton = document.getElementById("previous-day-btn");
    const nextDayButton = document.getElementById("next-day-btn");

    let currentDate = new Date();

    /**
     * Functie voor het maken van een tabelrij met reserveringsgegevens
     */
    function createReservationRow(reservation) {
        const row = document.createElement("tr");

        const naamCell = document.createElement("td");
        naamCell.textContent = reservation.naam;
        row.appendChild(naamCell);

        const sportCell = document.createElement("td");
        sportCell.textContent = reservation.sport;
        row.appendChild(sportCell);

        const baanCell = document.createElement("td");
        baanCell.textContent = reservation.baan;
        row.appendChild(baanCell);

        const extraBallenCell = document.createElement("td");
        extraBallenCell.textContent = reservation.extra_ballen;
        row.appendChild(extraBallenCell);

        const extraRacketsCell = document.createElement("td");
        extraRacketsCell.textContent = reservation.extra_racket;
        row.appendChild(extraRacketsCell);

        const datumCell = document.createElement("td");
        datumCell.textContent = reservation.datum;
        row.appendChild(datumCell);

        const tijdCell = document.createElement("td");
        tijdCell.textContent = reservation.tijd;
        row.appendChild(tijdCell);

        // Knop voor het verwijderen van de reservering
        const deleteButtonCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Verwijderen";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", () => {
            const confirmDelete = confirm("Weet je zeker dat je deze reservering wilt verwijderen?");
            if (confirmDelete) {
                // Verwijder de reservering
                deleteReservation(reservation.id);
            }
        });
        deleteButtonCell.appendChild(deleteButton);
        row.appendChild(deleteButtonCell);

        // Knop voor het wijzigen van de reservering
        const editButtonCell = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.textContent = "Wijzigen";
        editButton.classList.add("edit-button");
        editButton.addEventListener("click", () => {
            // Navigeer naar de pagina wijzigReservering.html met de reservering ID als query parameter
            window.location.href = `wijzigReservering.html?id=${reservation.id}`;
        });
        editButtonCell.appendChild(editButton);
        row.appendChild(editButtonCell);

        return row;
    }

    /**
     * Functie voor het verwijderen van een reservering
     */
    function deleteReservation(reservationId) {
        // Stuur een DELETE-verzoek naar de backend om de reservering te verwijderen
        fetch(`http://localhost:3000/reserveringen/` + reservationId, {method: "DELETE"})
            .then((response) => {
                if (response.ok) {
                    // Reservering is succesvol verwijderd, update de tabel
                    updateReservations();
                } else {
                    console.error("Er is een fout opgetreden bij het verwijderen van de reservering.");
                }
            })
            .catch((error) => {
                console.error("Er is een fout opgetreden bij het verwijderen van de reservering:", error);
            });
    }

    /**
     * Functie voor het weergeven van de reserveringen in de tabel
     */
    function displayReservations(reservations) {
        // Verwijder alle bestaande rijen uit de tabel, behalve de koppen
        while (reservationsTable.rows.length > 1) {
            reservationsTable.deleteRow(1);
        }

        // Maak een tabelrij voor elke reservering en voeg deze toe aan de tabel
        reservations.forEach(function (reservation) {
            const row = createReservationRow(reservation);
            reservationsTable.appendChild(row);
        });
    }

    /**
     * Functie voor het bijwerken van de huidige datum en het ophalen van reserveringen voor die datum
     */
    function updateReservations() {
        const formattedDate = currentDate.toISOString().split('T')[0];

        // Haal de reserveringen op voor de geselecteerde datum via een GET-verzoek naar de juiste endpoint
        fetch(`http://localhost:3000/reserveringen/byDate?datum=${formattedDate}`)
            .then(response => response.json())
            .then(data => {
                displayReservations(data);
            })
            .catch(error => {
                console.error("Er is een fout opgetreden bij het ophalen van reserveringen:", error);
            });

        // Werk de weergave van de huidige datum bij
        currentDateElement.textContent = currentDate.toLocaleDateString("nl-NL", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }

    /**
     * Functie voor het bijwerken van de datum en het ophalen van reserveringen voor de vorige dag
     */
    function goToPreviousDay() {
        currentDate.setDate(currentDate.getDate() - 1);
        updateReservations();
    }

    /**
     * Functie voor het bijwerken van de datum en het ophalen van reserveringen voor de volgende dag
     */
    function goToNextDay() {
        currentDate.setDate(currentDate.getDate() + 1);
        updateReservations();
    }

    // Voeg event listeners toe aan de knoppen voor vorige dag en volgende dag
    previousDayButton.addEventListener("click", goToPreviousDay);
    nextDayButton.addEventListener("click", goToNextDay);

    // Initialisatie: Haal reserveringen op voor de huidige datum
    updateReservations();
});
