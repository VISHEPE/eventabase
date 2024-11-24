const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  
  const userId = req.session.user.id;
  
  // Fetch user events and bookings
  db.query('SELECT * FROM events WHERE user_id = ?', [userId], (err, userEvents) => {
    if (err) throw err;
    
    db.query(
      'SELECT bookings.*, events.title FROM bookings JOIN events ON bookings.event_id = events.id WHERE bookings.user_id = ?',
      [userId],
      (err, userBookings) => {
        if (err) throw err;
        
      
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
