async function loadSports() {
    try {
        const response = await fetch('http://localhost:3000/courts/byType', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const sports = await response.json();

        const sportSelect = document.getElementById('sport');

        for (let sport of sports) {
            let option = document.createElement('option');
            option.value = sport.court_type;
            option.text = sport.court_type;
            sportSelect.appendChild(option);
        }
    } catch (error) {
        console.log('Error:', error);
    }
}

loadSports();
