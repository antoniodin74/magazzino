require('dotenv').config();
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
var db = require('./config/database')
var express = require('express');
var app = require('express')();
var path = require('path');
var http = require('http').Server(app);
var validator = require('express-validator');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var i18n = require("i18n-express");

// import controller
var AuthController = require('./controllers/AuthController');
// import Router file
var pageRouter = require('./routers/route');

// Middleware setup
app.use(bodyParser.json());
//var urlencodeParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
  key: 'user_sid',
  secret: 'clikeyart_ant',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  cookie: {
    maxAge: 20 * 60 * 1000 // 20 minutes
  }
}));

// i18n setup
app.use(flash());
app.use(i18n({
  translationsPath: path.join(__dirname, 'i18n'), // <--- use here. Specify translations files path.
  siteLangs: ["es", "en", "de", "ru", "it", "fr"],
  textsVarName: 'translation'
}));

// Static files
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));
app.get('/layouts/', function (req, res) {
  res.render('view');
});

// apply controller
AuthController(app);

//For set layouts of html view
var expressLayouts = require('express-ejs-layouts');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Define All Route 
pageRouter(app);

// Default route
app.get('/', function (req, res) {
  res.redirect('/');
});

// Server startup
const PORT = process.env.PORT || 8000;
const server = http.listen(PORT, function () {
  console.log('listening on *:' + PORT);
})  ;


// Error handling (opzionale ma consigliato)
process.on('uncaughtException', err => {
  console.error('🔥 Errore non gestito:', err);
});
process.on('unhandledRejection', err => {
  console.error('⚠️ Rejection non gestita:', err);
});
