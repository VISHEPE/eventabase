const express = require('express');
const db = require('../db');
const router = express.Router();

// Route to view all events
router.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/');

  const allEventsQuery = db.promise().query('SELECT * FROM events');
  const userEventsQuery = db.promise().query('SELECT * FROM events WHERE user_id = ?', [req.session.user.id]);
  const userBookingsQuery = db.promise().query(`
    SELECT events.id AS event_id, events.title 
    FROM bookings 
    JOIN events ON bookings.event_id = events.id 
    WHERE bookings.user_id = ?
  `, [req.session.user.id]);

  Promise.all([allEventsQuery, userEventsQuery, userBookingsQuery])
    .then(([allEventsResult, userEventsResult, userBookingsResult]) => {
      const allEvents = allEventsResult[0];
      const userEvents = userEventsResult[0];
      const userBookings = userBookingsResult[0]; // User's bookings

      res.render('dashboard', {
        events: allEvents,
        userEvents: userEvents,
        userBookings: userBookings, // Pass bookings to the dashboard
        user: req.session.user,
        successMessage: req.session.successMessage,
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Server error');
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

      req.session.successMessage = 'Event created successfully!';
      res.redirect('/events');
    }
  );
});

module.exports = router;
