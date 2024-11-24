const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./db'); 

const dashboardRoutes = require('./routes/dashboard');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events'); 

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(session({
  secret: '12345678@#',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // Prevents JavaScript from accessing cookies
    secure: false, // Ensures cookies are sent only over HTTPS
    sameSite: 'Lax' // Helps prevent third-party cookie tracking
  }
}));



// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 


app.get('/', (req, res) => {
  console.log("Root route accessed");

  const searchQuery = req.query.search || ''; 
  const currentPage = parseInt(req.query.page) || 1; 
  const itemsPerPage = 6; 
  const offset = (currentPage - 1) * itemsPerPage; 

  console.log(`Search Query: ${searchQuery}, Page: ${currentPage}`);

  
  db.query(
    `SELECT COUNT(*) AS total FROM events WHERE title LIKE ? OR description LIKE ?`,
    [`%${searchQuery}%`, `%${searchQuery}%`],
    (err, countResults) => {
      if (err) {
        console.error("Error counting events:", err);
        return res.status(500).send("Error fetching events");
      }

      const totalItems = countResults[0].total; 
      const totalPages = Math.ceil(totalItems / itemsPerPage); 

      console.log(`Total Events: ${totalItems}, Total Pages: ${totalPages}`);

      
      db.query(
        `SELECT title, description, date, location, category FROM events WHERE title LIKE ? OR description LIKE ? LIMIT ? OFFSET ?`,
        [`%${searchQuery}%`, `%${searchQuery}%`, itemsPerPage, offset],
        (err, events) => {
          if (err) {
            console.error("Error fetching events:", err);
            return res.status(500).send("Error fetching events");
          }

          console.log(`Fetched Events: ${events.length}`);

          
          res.render('index', {
            events: events,
            searchQuery: searchQuery,
            currentPage: currentPage,
            totalPages: totalPages
          });
        }
      );
    }
  );
});

// Routes
app.use('/', authRoutes); 
app.use('/dashboard', dashboardRoutes); 
app.use('/events', eventRoutes); 

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
