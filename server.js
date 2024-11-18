const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./db');

const dashboardRoutes = require('./routes/dashboard');
const authRoutes = require('./routes/auth');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

//routes
app.use(authRoutes);
app.use(dashboardRoutes);
app.use('/', require('./routes/auth'));
app.use('/events', require('./routes/events'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
