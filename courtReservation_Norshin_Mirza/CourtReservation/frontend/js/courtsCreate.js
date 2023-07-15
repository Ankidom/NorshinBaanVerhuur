document.addEventListener('DOMContentLoaded', (event) => {
    const createCourtForm = document.getElementById('add-court-form');

    createCourtForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const type = document.getElementById('type').value;
        const location = document.getElementById('location').value;

        fetch('http://localhost:3000/courts', { // voeg 'http://' toe
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({type, location})
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Fout bij het toevoegen van de baan');
                }
                return response.json();
            })
            .then(court => {
                // controleer of het 'success-message' element bestaat voordat je probeert de 'textContent' te wijzigen
                const successMessageElement = document.getElementById('success-message');
                if (successMessageElement) {
                    successMessageElement.textContent = 'Baan succesvol toegevoegd!';
                }
            })
            .catch(error => {
                console.error(error);
                // controleer of het 'failed-message' element bestaat voordat je probeert de 'textContent' te wijzigen
                const failedMessageElement = document.getElementById('failed-message');
                if (failedMessageElement) {
                    failedMessageElement.textContent = 'Er is iets misgegaan bij het toevoegen van de baan.';
                }
            });
    });
});
