document.addEventListener('DOMContentLoaded', () => {
    // Functie om het formulier te verzenden
    const registerUser = async (event) => {
        event.preventDefault();

        // Haal de waarden uit het formulier
        const username = document.querySelector('#username').value;
        const email = document.querySelector('#email').value;

        // Maak een object met de gebruikersgegevens
        const user = { username, email };

        try {
            // Verzend het gebruikersobject naar de backend
            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                // Registratie succesvol
                const successMessage = document.querySelector('.success-message');
                successMessage.textContent = 'Registratie succesvol!';
                successMessage.style.display = 'block';
            } else {
                // Er is een fout opgetreden
                throw new Error('Registratie mislukt.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Eventlistener voor het indienen van het formulier
    const registerForm = document.querySelector('#register-form');
    registerForm.addEventListener('submit', registerUser);
});
