const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  // Ensure user is authenticated
  console.log('Session data at dashboard:', req.session.user);
  if (!req.session.user) return res.redirect('/login');
  
  const userId = req.session.user.id;

  // Fetch user events
  db.query('SELECT * FROM events WHERE user_id = ?', [userId], (err, userEvents) => {
    if (err) {
      console.error('Error fetching user events:', err);
      return res.status(500).send('Error fetching user events');
    }
    
    // Fetch user bookings
    db.query(
      'SELECT bookings.*, events.title FROM bookings JOIN events ON bookings.event_id = events.id WHERE bookings.user_id = ?',
      [userId],
      (err, userBookings) => {
        if (err) {
          console.error('Error fetching user bookings:', err);
          return res.status(500).send('Error fetching user bookings');
        }

        res.render('dashboard', { 
          user: req.session.user,  
          userEvents, 
          userBookings,
          successMessage: req.session.successMessage || null  
        });

        // Clear the success message after it's been displayed
        delete req.session.successMessage;
      }
    );
  });
});

module.exports = router;
