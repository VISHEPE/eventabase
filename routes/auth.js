const express = require('express');
const db = require('../db');
const bcrypt = require('bcrypt');
const router = express.Router();

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');  // Redirect to login if not authenticated
}

// GET route to serve the registration page
router.get('/register', (req, res) => {
  // If user is already logged in, redirect to dashboard
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('registration'); // Make sure 'registration.ejs' is in your 'views' folder
});

// GET route to serve the login page
router.get('/login', (req, res) => {
  // If user is already logged in, redirect to dashboard
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('login'); // Make sure 'login.ejs' is in your 'views' folder
});

// POST route for registration
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Check if the email already exists
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      return res.send('Email already in use. Please choose a different email.');
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err) => {
      if (err) throw err;
      res.redirect('/login'); // Redirect to login after successful registration
    });
  });
});

// POST route for login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) throw err;

    if (results.length > 0 && await bcrypt.compare(password, results[0].password)) {
      req.session.user = results[0];  // Store user data in session

      console.log('User logged in:', req.session.user); // Log the session user for debugging

      res.redirect('/dashboard'); // Redirect to dashboard after successful login
    } else {
      res.send('Invalid email or password'); // Send an error message for invalid credentials
    }
  });
});

// GET route for logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send('Failed to log out');
    }
    res.redirect('/'); // Redirect to the home page after logout
  });
});

module.exports = router;

