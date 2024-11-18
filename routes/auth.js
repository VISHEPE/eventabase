const express = require('express');
const db = require('../db');
const router = express.Router();
const bcrypt = require('bcrypt');


// GET route to serve the registration page
router.get('/register', (req, res) => {
  res.render('registration'); // Make sure 'registration.ejs' is in your 'views' folder
});
router.get('/login', (req, res) => {
  res.render('login'); // Make sure 'login.ejs' is in your 'views' folder
})

 
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err) => {
      if (err) throw err;
      res.redirect('/login');
    });
  });
  
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) throw err;
      if (results.length > 0 && await bcrypt.compare(password, results[0].password)) {
        req.session.user = results[0];
        console.log('Logged in user:', req.session.user);
        res.redirect('/dashboard');
      } else {
        res.send('Invalid email or password');
      }
    });
  });
  
  
  router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });









router.get('/', (req, res) => {
  const searchQuery = req.query.search || '';
  const currentPage = parseInt(req.query.page) || 1;
  const itemsPerPage = 6;
  const offset = (currentPage - 1) * itemsPerPage;

  // Query to count total events
  db.query(`SELECT COUNT(*) AS total FROM events WHERE title LIKE ?`, [`%${searchQuery}%`], (err, countResults) => {
    if (err) throw err;

    const totalItems = countResults[0].total;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Query to get events with search and pagination
    db.query(
      `SELECT * FROM events WHERE title LIKE ? LIMIT ? OFFSET ?`,
      [`%${searchQuery}%`, itemsPerPage, offset],
      (err, results) => {
        if (err) throw err;
        res.render('index', {
          events: results,
          searchQuery: searchQuery,
          currentPage: currentPage,
          totalPages: totalPages
        });
      }
    );
  });
});

module.exports = router;
