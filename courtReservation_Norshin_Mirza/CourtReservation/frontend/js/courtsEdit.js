const urlParams = new URLSearchParams(window.location.search);
const courtId = urlParams.get('id');

const typeInput = document.getElementById('type');
const locationInput = document.getElementById('location');

fetch(`http://localhost:3000/courts/${courtId}`)
    .then(response => response.json())
    .then(court => {
        typeInput.value = court.court_type;
        locationInput.value = court.location;
    })
    .catch(error => console.error('Fout bij het ophalen van de baan:', error));

document.getElementById('edit-court-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const type = typeInput.value;
    const location = locationInput.value;

    fetch(`http://localhost:3000/courts/${courtId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({type, location }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Fout bij het wijzigen van de baan');
            }
            window.location.href = './courts.html';
        })
        .catch(error => console.error(error));
});
