const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Maak een express-applicatie
const app = express();

// Pad naar de SQLite-database
const dbPad = 'database/db.sqlite';

// Maak een nieuwe databaseverbinding
const db = new sqlite3.Database(dbPad, (err) => {
    if (err) {
        console.error('Fout bij het maken van de databaseverbinding:', err.message);
    } else {
        console.log('Databaseverbinding tot stand gebracht.');

        // SQL-statement voor het aanmaken van de tabel voor reserveringen
        const createReservationsTable = `
            CREATE TABLE IF NOT EXISTS reservations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                naam TEXT NOT NULL,npm
                sport TEXT NOT NULL,
                baan TEXT NOT NULL,
                extra_ballen INTEGER DEFAULT 0,
                extra_racket INTEGER DEFAULT 0,
                datum DATE NOT NULL,
                tijd TEXT NOT NULL
            );
        `;

        // SQL-statement voor het aanmaken van de tabel voor banen
        const createCourtsTable = `
            CREATE TABLE IF NOT EXISTS courts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                naam TEXT NOT NULL,
                locatie TEXT NOT NULL,
                type TEXT NOT NULL,
                FOREIGN KEY (locatie) REFERENCES locations (naam) ON DELETE CASCADE
            );
        `;

        // SQL-statement voor het aanmaken van de tabel voor locaties
        const createLocationsTable = `
            CREATE TABLE IF NOT EXISTS locations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                naam TEXT NOT NULL,
                adres TEXT NOT NULL,
                stad TEXT NOT NULL,
                postcode TEXT NOT NULL
            );
        `;

        // Voer het SQL-statement uit om de tabel voor reserveringen aan te maken
        db.run(createReservationsTable, (err) => {
            if (err) {
                console.error('Fout bij het aanmaken van de tabel voor reserveringen:', err.message);
            } else {
                console.log('Tabel voor reserveringen aangemaakt.');

                // Voer het SQL-statement uit om de tabel voor banen aan te maken
                db.run(createCourtsTable, (err) => {
                    if (err) {
                        console.error('Fout bij het aanmaken van de tabel voor banen:', err.message);
                    } else {
                        console.log('Tabel voor banen aangemaakt.');

                        // Voer het SQL-statement uit om de tabel voor locaties aan te maken
                        db.run(createLocationsTable, (err) => {
                            if (err) {
                                console.error('Fout bij het aanmaken van de tabel voor locaties:', err.message);
                            } else {
                                console.log('Tabel voor locaties aangemaakt.');

                                // Controleer en voeg de locatie toe aan de database
                                const insertLocationData = `
                                    INSERT INTO locations (naam, adres, stad, postcode)
                                    SELECT 'Oldenzaal', 'Brederostraat 1', 'Oldenzaal', '7574XE'
                                    WHERE NOT EXISTS (
                                        SELECT 1 FROM locations WHERE naam = 'Oldenzaal'
                                    );
                                `;

                                db.run(insertLocationData, (err) => {
                                    if (err) {
                                        console.error('Fout bij het toevoegen van de locatie:', err.message);
                                    } else {
                                        console.log('Locatie succesvol toegevoegd aan de database.');
                                    }
                                });

                                // Controleer en voeg de baan toe aan de database
                                const insertCourtData = `
                                    INSERT INTO courts (naam, locatie, type)
                                    SELECT 'Tennisbaan 1', 'Oldenzaal', 'kunstgras'
                                    WHERE NOT EXISTS (
                                        SELECT 1 FROM courts WHERE naam = 'Tennisbaan 1' AND locatie = 'Oldenzaal'
                                    );
                                `;

                                db.run(insertCourtData, (err) => {
                                    if (err) {
                                        console.error('Fout bij het toevoegen van de baan:', err.message);
                                    } else {
                                        console.log('Baan succesvol toegevoegd aan de database.');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});

// Middleware voor het verwerken van JSON-gegevens
app.use(express.json());

// Middleware voor het verwerken van formuliergegevens
app.use(express.urlencoded({ extended: false }));

// Cors-configuratie
app.use(cors());

// Serveer de frontend-bestanden
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Stuur index.html als standaardbestand
app.get(['/', '/index.html'], (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'index.html'));
});

// Stuur reserveren.html
app.get('/reserveren.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'reserveren.html'));
});

// Stuur about.html
app.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'about.html'));
});

// Stuur navbar.html
app.get('/navbar.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'navbar.html'));
});

// Stuur planning.html
app.get('/planning.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'planning.html'));
});

// Stuur planning.html
app.get('/wijzigreservering.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'wijzigreservering.html'));
});

// Endpoint voor het verwerken van het reserveringsformulier
app.post('/reserveren', (req, res) => {
    const { naam, sport, baan, extra_ballen, extra_racket, datum, tijd } = req.body;

    // Voeg de reservering toe aan de database
    db.run(
        `INSERT INTO reservations (naam, sport, baan, extra_ballen, extra_racket, datum, tijd) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [naam, sport, baan, extra_ballen, extra_racket, datum, tijd],
        (err) => {
            if (err) {
                console.error('Fout bij het toevoegen van de reservering:', err.message);
                res.status(500).send('Er is een interne serverfout opgetreden.');
            } else {
                console.log('Reservering succesvol toegevoegd aan de database.');
                res.status(200).send('Reservering succesvol verwerkt.');
            }
        }
    );
});

// Importeer de reservations-router
const reservationsRouter = require('./routes/reservations');

// Gebruik de reservations-router voor het verwerken van reserveringen
app.use('/reserveringen', reservationsRouter);

// Start de server op de opgegeven poort
const poort = 3000;
app.listen(poort, () => {
    console.log(`Server is gestart op poort ${poort}`);
});
