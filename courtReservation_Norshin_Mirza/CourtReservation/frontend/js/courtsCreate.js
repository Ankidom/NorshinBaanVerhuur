document.addEventListener('DOMContentLoaded', (event) => {
    fetch('http://localhost:3000/locations')
        .then(response => {
            if (!response.ok) {
                throw new Error('Fout bij het ophalen van de locaties');
            }
            return response.json();
        })
        .then(locations => {
            const locationSelectElement = document.getElementById('location');
            if (locationSelectElement) {
                locations.forEach(location => {
                    const optionElement = document.createElement('option');
                    optionElement.value = location.id;
                    optionElement.textContent = location.location_name;
                    locationSelectElement.appendChild(optionElement);
                });
            }
        })
        .catch(error => {
            console.error(error);
            const failedMessageElement = document.getElementById('failed-message');
            if (failedMessageElement) {
                failedMessageElement.textContent = 'Er is iets misgegaan bij het ophalen van de locaties.';
                failedMessageElement.style.display = 'block'; // maakt het foutbericht zichtbaar
            }
        });

    const createCourtForm = document.getElementById('add-court-form');

    createCourtForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const type = document.getElementById('type').value;
        const location = document.getElementById('location').value;

        fetch('http://localhost:3000/courts', {
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
                const successMessageElement = document.getElementById('success-message');
                if (successMessageElement) {
                    successMessageElement.textContent = 'Baan succesvol toegevoegd!';
                    successMessageElement.style.display = 'block'; // maakt het succesbericht zichtbaar
                }
            })
            .catch(error => {
                console.error(error);
                const failedMessageElement = document.getElementById('failed-message');
                if (failedMessageElement) {
                    failedMessageElement.textContent = 'Er is iets misgegaan bij het toevoegen van de baan.';
                    failedMessageElement.style.display = 'block'; // maakt het foutbericht zichtbaar
                }
            });
    });
});
