const path = require('path');
const express = require('express');
const session = require('express-session');
const expressHandlebars = require('express-handlebars');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const routes = require('./controllers');
const sequelize = require('./config/connection');

// set up app and port
const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
// Path: server.js
// Compare this snippet from utils\auth.js:

// use this create a new Sequelize Store to store the session data
app.use(session({
    secret: 'Secret code you will never guess',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 10 * 60 * 1000 } // 10 minutes
  }));
// middleware to make session info available to all of our Handlebars templates
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// middleware to parse JSON and string data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('We have lift off'));
});