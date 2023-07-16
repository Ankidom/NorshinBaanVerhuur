const urlParams = new URLSearchParams(window.location.search);
const courtId = urlParams.get('id');

const typeInput = document.getElementById('type');
const locationSelect = document.getElementById('location');

fetch(`http://localhost:3000/courts/${courtId}`)
    .then(response => response.json())
    .then(court => {
        typeInput.value = court.court_type;

        // Haal de locaties op en vul de dropdown
        fetch('http://localhost:3000/locations')
            .then(response => response.json())
            .then(locations => {
                locations.forEach(location => {
                    const option = document.createElement('option');
                    option.value = location.id;
                    option.textContent = location.location_name;
                    locationSelect.appendChild(option);

                    // Stel de geselecteerde locatie in
                    if (location.location_name === court.location_name) {
                        locationSelect.value = location.id;
                    }
                });
            })
            .catch(error => console.error('Fout bij het ophalen van de locaties:', error));
    })
    .catch(error => console.error('Fout bij het ophalen van de baan:', error));

document.getElementById('edit-court-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const type = typeInput.value;
    const location = locationSelect.value;

    fetch(`http://localhost:3000/courts/${courtId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({type, location}),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Fout bij het wijzigen van de baan');
            }
            window.location.href = './courts.html';
        })
        .catch(error => console.error(error));
});
