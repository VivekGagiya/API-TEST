const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const validator = require('validator');
const cors = require('cors'); 

const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON requests
app.use(bodyParser.json());
app.use(cors());

let corsOptions = {
  origin: ['http://localhost:3000']
};

// Function to create a MySQL connection
function createDBConnection() {
  return mysql.createConnection({
    host: '68.178.145.87', // Replace with the IP address of your MySQL server
    user: 'schbangnftdbuser',
    password: 'schbangnftdbuserpassword',
    database: 'schbangnftdb',
  });
}

// Function to read all data from a table
function readAllDataFromTable(tableName, callback) {
  const db = createDBConnection();

  const sql = `SELECT * FROM ${tableName}`;

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return callback(err, null);
    }

    db.query(sql, (err, results) => {
      db.end(); // Close the database connection
      if (err) {
        console.error('SQL error:', err);
        return callback(err, null);
      }

      return callback(null, results);
    });
  });
}

// API endpoint for checking email existence
app.post('/check-email', cors(corsOptions), (req, res) => {
  const { email } = req.body;

  // Validation: Check if email is not empty and is in the proper format
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const db = createDBConnection();

  // SQL injection prevention using parameterized queries
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    db.query(sql, [email], (err, results) => {
      db.end(); // Close the database connection
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
});

// API endpoint for getting all data from a table
app.get('/get-all-data',cors(corsOptions), (req, res) => {
  const tableName = 'nft_json_records'; // Replace with the actual table name

  readAllDataFromTable(tableName, (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }

    return res.json({ message: 'Data retrieved successfully', data });
  });
});

// API endpoint for user registration
app.post('/register-user',cors(corsOptions), (req, res) => {
  const { name, email, department } = req.body;

  // Validation: Check if any of the fields are null or empty
  if (!name || !email || !department) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validation: Check if the name contains only alphabets
  if (!/^[a-zA-Z]+$/.test(name)) {
    return res.status(400).json({ message: 'Name should contain only alphabets' });
  }

  // Validation: Check if email is in the proper format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const db = createDBConnection();

  // SQL injection prevention using parameterized queries
  const sql = 'INSERT INTO users (name, email, department) VALUES (?, ?, ?)';
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    db.query(sql, [name, email, department], (err, results) => {
      db.end(); // Close the database connection
      if (err) {
        console.error('SQL error:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      return res.json({ message: 'User registered successfully' });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
