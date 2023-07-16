const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const reservationsRouter = require('./routes/reservations');
const usersRouter = require('./routes/usersRouter');
const courtsRouter = require('./routes/courts');
const locationsRouter = require('./routes/locationsRoute');
const db = require('./database/db');

// Maak een express-applicatie
const app = express();

// Pad naar de SQLite-database
const dbPath = path.join(__dirname, 'db.sqlite');

// Middleware voor het verwerken van JSON-gegevens
app.use(express.json());

// Middleware voor het verwerken van formuliergegevens
app.use(express.urlencoded({ extended: false }));

// Cors-configuratie
app.use(cors());

// Serveer de frontend-bestanden
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use('/locations', locationsRouter);

// Gebruik de reservations-router voor het verwerken van reserveringen
app.use('/reserveringen', reservationsRouter);

// Gebruik de users-router voor het verwerken van gebruikers
app.use('/users', usersRouter);

app.use('/courts', courtsRouter);

// Start de server op de opgegeven poort
const port = 3000;
app.listen(port, () => {
    console.log(`Server is gestart op poort ${port}`);
});
