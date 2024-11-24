const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./db'); // Ensure this is correctly set up

const dashboardRoutes = require('./routes/dashboard');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events'); // Make sure this is defined

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // Prevents JavaScript from accessing cookies
    secure: true, // Ensures cookies are sent only over HTTPS
    sameSite: 'Lax' // Helps prevent third-party cookie tracking
  }
}));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

// Home route with search functionality and pagination
app.get('/', (req, res) => {
  console.log("Root route accessed");

  const searchQuery = req.query.search || ''; // Get search query from URL or default to empty string
  const currentPage = parseInt(req.query.page) || 1; // Get current page from URL or default to 1
  const itemsPerPage = 6; // Number of items per page
  const offset = (currentPage - 1) * itemsPerPage; // Calculate offset for pagination

  console.log(`Search Query: ${searchQuery}, Page: ${currentPage}`);

  // Count the total number of events (without filtering by search query)
  db.query(
    `SELECT COUNT(*) AS total FROM events WHERE title LIKE ? OR description LIKE ?`,
    [`%${searchQuery}%`, `%${searchQuery}%`],
    (err, countResults) => {
      if (err) {
        console.error("Error counting events:", err);
        return res.status(500).send("Error fetching events");
      }

      const totalItems = countResults[0].total; // Get the total number of events
      const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages

      console.log(`Total Events: ${totalItems}, Total Pages: ${totalPages}`);

      // Fetch events with the specified fields (title, description, date, location, category)
      db.query(
        `SELECT title, description, date, location, category FROM events WHERE title LIKE ? OR description LIKE ? LIMIT ? OFFSET ?`,
        [`%${searchQuery}%`, `%${searchQuery}%`, itemsPerPage, offset],
        (err, events) => {
          if (err) {
            console.error("Error fetching events:", err);
            return res.status(500).send("Error fetching events");
          }

          console.log(`Fetched Events: ${events.length}`);

          // Render the 'index' page with events, search query, and pagination data
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
app.use('/', authRoutes); // Use authRoutes at the root
app.use('/dashboard', dashboardRoutes); // Use dashboardRoutes for dashboard
app.use('/events', eventRoutes); // Use eventRoutes for events

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
