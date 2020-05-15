const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const app = express();


/*********************************** SETTINGS **********************************/
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

/********************************* MIDDLEWARES *********************************/
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

/*********************************** ROUTES ***********************************/
app.use(require('./routes/index.js'));

/******************************** STATIC FILES ********************************/
app.use(express.static(path.join(__dirname, '/public')));
//Esto solucionó el error del tipo MIME
app.use(express.static(path.join(__dirname, '/views')));

module.exports = app;