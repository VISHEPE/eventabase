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
  secret: 'your_secret_key', // Choose a secret key for your session
  resave: false,
  saveUninitialized: true
}));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Routes
app.use('/', authRoutes); // Use authRoutes at the root
app.use('/dashboard', dashboardRoutes); // Use dashboardRoutes for dashboard
app.use('/events', eventRoutes); // Use eventRoutes for events

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
