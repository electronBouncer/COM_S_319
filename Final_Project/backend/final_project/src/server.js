const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3001; // You can choose any port

app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: 'AnthonyPeter12', // Replace with your MySQL password
  database: 'banking_app'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/balance', (req, res) => {
  db.query('SELECT amount FROM balance WHERE id = 1', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ balance: results[0].amount });
  });
});

app.get('/api/transactions', (req, res) => {
  db.query('SELECT * FROM transactions', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ transactions: results });
  });
});

app.post('/api/deposit', (req, res) => {
  const { amount } = req.body;
  db.query('UPDATE balance SET amount = amount + ? WHERE id = 1', [amount], (err) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    db.query('INSERT INTO transactions (type, amount) VALUES (?, ?)', ['deposit', amount], (err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      db.query('SELECT amount FROM balance WHERE id = 1', (err, results) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        const balance = results[0].amount;
        db.query('SELECT * FROM transactions', (err, results) => {
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
  const { amount } = req.body;
  db.query('UPDATE balance SET amount = amount - ? WHERE id = 1', [amount], (err) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    db.query('INSERT INTO transactions (type, amount) VALUES (?, ?)', ['withdraw', amount], (err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      db.query('SELECT amount FROM balance WHERE id = 1', (err, results) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        const balance = results[0].amount;
        db.query('SELECT * FROM transactions', (err, results) => {
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