require('dotenv').config()

const express = require('express');
const app = express();



const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const mongo_uri = process.env.MONGO_URI;

const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require('method-override')


mongoose.connect(mongo_uri).then(() => console.log('DB Connected!'));

const router = require('./routes/new-post')

app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'))
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

var session = require('express-session');
app.use(session({ secret: 'mySecret', resave: false, saveUninitialized: false }));

var flash = require('connect-flash');
app.use(flash()); // flash messages
app.use(function (req, res, next) {
  res.locals.error = req.flash('error');
  next();
});

app.use(express.urlencoded({ extended: true }));

app.use('/', router)


app.use((err, req, res, next) => {
  backURL = req.header('Referer') || '/';

  console.log(err)

  res.render('error')
});



app.listen(port, () => {
  console.log(`listening on port ${port}`);
})