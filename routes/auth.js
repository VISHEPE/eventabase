const express = require('express');
const db = require('../db');
const bcrypt = require('bcrypt');
const router = express.Router();

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');  
}


router.get('/register', (req, res) => {
 
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('registration'); 
});

// GET route to serve the login page
router.get('/login', (req, res) => {
  
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('login'); 
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
      res.redirect('/login'); 
    });
  });
});

// POST route for login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) throw err;

    if (results.length > 0 && await bcrypt.compare(password, results[0].password)) {
      req.session.user = results[0];  

      console.log('User logged in:', req.session.user);

      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
          return res.send('An error occurred. Please try again.');
        }
        res.redirect('/dashboard'); // Redirect after session is saved
      });
    } else {
      res.send('Invalid email or password'); 
    }
  });
});


// GET route for logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send('Failed to log out');
    }
    res.redirect('/'); 
  });
});

module.exports = router;

