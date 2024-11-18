
const express = require('express');
const db = require('../db');
const router = express.Router(); 

router.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const userId = req.session.user.id;
  db.query('SELECT * FROM events WHERE user_id = ?', [userId], (err, userEvents) => {
    if (err) throw err;
    
    db.query(
      'SELECT bookings.*, events.title FROM bookings JOIN events ON bookings.event_id = events.id WHERE bookings.user_id = ?',
      [userId],
      (err, userBookings) => {
        if (err) throw err;
        
        // Pass the user object, userEvents, and userBookings to the template
        res.render('dashboard', { 
          user: req.session.user,  // Pass the user object
          userEvents, 
          userBookings 
        });
      }
    );
  });
});
