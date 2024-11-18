const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  db.query('SELECT * FROM events', (err, results) => {
    if (err) throw err;
    res.render('dashboard', { events: results });
  });
});

router.get('/create', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  res.render('event');
});

router.post('/create', (req, res) => {
  const { title, description, date } = req.body;
  db.query('INSERT INTO events (title, description, date) VALUES (?, ?, ?)', [title, description, date], (err) => {
    if (err) throw err;
    res.redirect('/events');
  });
});



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
        res.redirect('/');
      }
    );
  });
  

module.exports = router;
