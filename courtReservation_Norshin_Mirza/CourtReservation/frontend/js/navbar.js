const navbarPlaceholder = document.getElementById("navbar-placeholder");

// Haal de inhoud van navbar.html op met behulp van fetch
fetch("navbar.html")
    .then(response => response.text())
    .then(data => {
        navbarPlaceholder.innerHTML = data;
    })
    .catch(error => {
        console.error("Er is een fout opgetreden bij het ophalen van de navbar:", error);
    });

const reserverenBtn = document.getElementById("reserveren-btn");

reserverenBtn.addEventListener("click", function () {
    window.location.href = "reserveren.html";
});
