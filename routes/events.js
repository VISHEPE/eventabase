const express = require('express');
const db = require('../db');
const router = express.Router();

// Route to view all events
router.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  db.query('SELECT * FROM events', (err, results) => {
    if (err) throw err;
    res.render('dashboard', { events: results, successMessage: req.session.successMessage });
  });
});

// Route to show event creation form
router.get('/create', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  res.render('event');
});

// Route to handle event creation
router.post('/create', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const { title, description, date, location, category } = req.body;
  db.query(
    'INSERT INTO events (title, description, date, location, category, user_id) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description, date, location, category, req.session.user.id],
    (err) => {
      if (err) throw err;
      
      // Set success message in session
      req.session.successMessage = 'Event created successfully!';
      
      // Redirect to the dashboard with the success message
      res.redirect('/events');
    }
  );
});

module.exports = router;
