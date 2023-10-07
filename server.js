const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const validator = require('validator');
// const path = require('path'); // Import 'path' module

const app = express();
const port = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS)
// app.use(express.static(path.join(__dirname, 'public')));

// MySQL database connection setup
const db = mysql.createConnection({
  host: '68.178.145.87', // Replace with the IP address of your PHPMyAdmin-hosted MySQL server
  user: 'schbangnftdbuser',
  password: 'schbangnftdbuserpassword',
  database: 'schbangnftdb',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Function to read all data from a table
function readAllDataFromTable(tableName, callback) {
  const sql = `SELECT * FROM ${tableName}`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('SQL error:', err);
      return callback(err, null);
    }

    return callback(null, results);
  });
}

// API endpoint for checking email existence
app.post('/check-email', (req, res) => {
  const { email } = req.body;

  // Validation: Check if email is not empty and is in the proper format
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // SQL injection prevention using parameterized queries
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('SQL error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length > 0) {
      return res.json({ message: 'Email exists', emailExists: true });
    } else {
      return res.json({ message: 'Email does not exist', emailExists: false });
    }
  });
});

// API endpoint for getting all data from a table
app.get('/get-all-data', (req, res) => {
  const tableName = 'nft_json_records'; // Replace with the actual table name

  readAllDataFromTable(tableName, (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }

    return res.json({ message: 'Data retrieved successfully', data });
  });
});

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
