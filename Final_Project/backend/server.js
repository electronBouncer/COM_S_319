const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const app = express();

app.use(express.json());
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors({origin: 'http://localhost:5000'})); // Allow all origins (you can restrict it if needed)


// Serve static files from the 'public' directory
app.use(express.static('frontend/public'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MSskunk1!',   //'Cyclone2025!',
    database: 'banking_app'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('MySQL Connected...');
});

app.post('/register', (req, res) => {
    console.log('Received registration request:', req.body);
    const { username, password, email } = req.body;

    // Validate request body
    if (!username || !password || !email) {
        res.status(400).send('Missing required fields');
        return;
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    const sql = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    db.query(sql, [username, hashedPassword, email], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            res.status(500).send('Error registering user');
            return;
        }
        console.log('User registered successfully:', result);
        res.send('User registered');
    });
});

app.post('/login', (req, res) => {
    console.log('Received login request:', req.body);
    const { username, password } = req.body;

    // Validate request body
    if (!username || !password) {
        res.status(400).send('Missing required fields');
        return;
    }

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).send('Error logging in');
            return;
        }

        if (results.length === 0) {
            res.status(400).send('User not found');
            return;
        }

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
            res.status(401).send('Invalid password');
            return;
        }

        res.send('Login successful');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});