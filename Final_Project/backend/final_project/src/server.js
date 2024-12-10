const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'AnthonyPeter12',
  database: 'banking_app'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(201).json({ message: 'User registered successfully' });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    req.session.userId = user.id;
    res.json({ message: 'Login successful' });
  });
});

app.get('/api/balance', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  db.query('SELECT amount FROM balance WHERE user_id = ?', [req.session.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ balance: results[0]?.amount || 0 });
  });
});

app.get('/api/transactions', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  db.query('SELECT * FROM transactions WHERE user_id = ?', [req.session.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ transactions: results });
  });
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.post('/api/deposit', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const { amount } = req.body;
  db.query('UPDATE balance SET amount = amount + ? WHERE user_id = ?', [amount, req.session.userId], (err) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    db.query('INSERT INTO transactions (user_id, type, amount) VALUES (?, ?, ?)', [req.session.userId, 'deposit', amount], (err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      db.query('SELECT amount FROM balance WHERE user_id = ?', [req.session.userId], (err, results) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        const balance = results[0]?.amount || 0;
        db.query('SELECT * FROM transactions WHERE user_id = ?', [req.session.userId], (err, results) => {
          if (err) {
            return res.status(500).json({ error: err });
          }
          res.json({ balance, transactions: results });
        });
      });
    });
  });
});

app.post('/api/withdraw', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const { amount } = req.body;
  db.query('UPDATE balance SET amount = amount - ? WHERE user_id = ?', [amount, req.session.userId], (err) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    db.query('INSERT INTO transactions (user_id, type, amount) VALUES (?, ?, ?)', [req.session.userId, 'withdraw', amount], (err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      db.query('SELECT amount FROM balance WHERE user_id = ?', [req.session.userId], (err, results) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        const balance = results[0]?.amount || 0;
        db.query('SELECT * FROM transactions WHERE user_id = ?', [req.session.userId], (err, results) => {
          if (err) {
            return res.status(500).json({ error: err });
          }
          res.json({ balance, transactions: results });
        });
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});