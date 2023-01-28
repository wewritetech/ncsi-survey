// require('dotenv').config();
const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const ejs = require('ejs');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session);


// Route Imports
const adminRouter = require('./routes/admin.routes');
const adminWewriteRouter = require('./routes/adminWewrite.routes');
const surveyRouter = require('./routes/survey.routes');

const app = express();

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}...`);
});



// const DB_HOST = process.env.DB_HOST|| 'localhost'
// const DB_USER = process.env.DB_USER|| 'awinxcxu_ajings'
// const DB_PASS = process.env.DB_PASS ||'@LZ4Q28J_bZ4'
// const MYSQL_DB = process.env.MYSQL_DB|| 'awinxcxu_ncsi'


const SESS_NAME = process.env.SESS_NAME = 'ncsi_session'
const SESS_SECRET = process.env.SESS_SECRET = 'DtNVu7QjT^7Nmbg%4#lk2i!@8&*gH%Li4%JK'

const IN_PROD = process.env.NODE_ENV === 'production'
const TWO_HOURS = 1000 * 60 * 60 * 2



const options ={
  connectionLimit: 10,
  password: 'BqqatZfpRwTi',
  user: 'nigesppx_survey',
  database: 'nigesppx_survey',
  host: 'localhost',
  createDatabaseTable: true
  
}

const  sessionStore = new mysqlStore(options);

// Express Sessions Config
app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  secret: 'XH%nIVFW_j%nM*-Xeb2T@"mAA};i(r!7?H@eE?_5lYr[z=AO2N~.ht>uK;t!Vd.',
  cookie: {
      maxAge: TWO_HOURS,
      sameSite: true,
      secure: IN_PROD
  }
}))


// Static Files
app.use(express.static('public'));

// Template Engine
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Routes
app.use('/admin', adminRouter);
app.use('/wewrite-admin', adminWewriteRouter);
app.use('/survey', surveyRouter);