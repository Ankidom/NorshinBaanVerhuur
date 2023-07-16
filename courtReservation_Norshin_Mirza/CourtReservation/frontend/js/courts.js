const courtsTable = document.getElementById('courts-table');
const addCourtButton = document.getElementById('add-court-btn');

addCourtButton.addEventListener('click', () => {
    window.location.href = './courtsCreate.html';
});

// Haal de banen op en voeg ze toe aan de tabel
fetch('http://localhost:3000/courts')
    .then(response => response.json())
    .then(courts => {
        courts.forEach(court => {
            const row = document.createElement('tr');

            const typeCell = document.createElement('td');
            typeCell.textContent = court.court_type;
            row.appendChild(typeCell);

            const locationCell = document.createElement('td');
            locationCell.textContent = court.location;
            row.appendChild(locationCell);

            const deleteCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Verwijderen';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', () => {
                const confirmDelete = confirm("Weet je zeker dat je deze reservering wilt verwijderen?");
                if (confirmDelete) {
                    // Verwijder de baan
                    deleteCourt(court.id);
                }
            });
            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell);

            const editCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.textContent = 'Wijzigen';
            editButton.className = 'edit-button';
            editButton.addEventListener('click', () => {
                window.location.href = `./courtsEdit.html?id=${court.id}`;
            });
            editCell.appendChild(editButton);
            row.appendChild(editCell);

            courtsTable.appendChild(row);
        });
    })
    .catch(error => console.error('Fout bij het ophalen van de banen:', error));

function deleteCourt(id) {
    fetch(`http://localhost:3000/courts/${id}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Fout bij het verwijderen van de baan');
            }
            location.reload();
        })
        .catch(error => console.error(error));
}

function updateCourt(id, type, location) {
    fetch(`http://localhost:3000/courts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, location }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Fout bij het wijzigen van de baan');
            }
            location.reload();
        })
        .catch(error => console.error(error));
}
