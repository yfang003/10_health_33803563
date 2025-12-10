// Import express and ejs
var express = require ('express')
var ejs = require('ejs')
const path = require('path')
var mysql = require('mysql2')
var session = require ('express-session')
const expressSanitizer = require('express-sanitizer');
const request = require('request')

// Create the express application object
const app = express()
const port = 8000

require('dotenv').config();

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

// Create an input sanitizer
app.use(expressSanitizer());

// Set up the body parser 
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

// Set up public folder (for css and static js)
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: 'somerandomstuff',
  resave: false,
  saveUninitialized: false,
  cookie: {
     expires: 600000
  }
}))
// Define our application-specific data
app.locals.fitnessData = {appName: "FitTrack"}


const db = mysql.createPool({
  host: process.env.HEALTH_HOST || 'localhost',
  user: process.env.HEALTH_USER || 'health_app',
  password: process.env.HEALTH_PASSWORD || 'qwertyuiop',
  database: process.env.HEALTH_DATABASE || 'health',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONN_LIMIT || '10', 10),
  queueLimit: 0,
});
    global.db = db;


// Load the route handlers
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)

const authRoutes = require('./routes/auth')
app.use('/auth', authRoutes)

const workoutRoutes = require('./routes/workouts')
app.use('/workouts', workoutRoutes)

const weatherRoutes = require('./routes/weather')
app.use('/weather', weatherRoutes)

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

