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
app.set("views", path.join(__dirname, "src/views"));

var session = require('express-session');
app.use(session({ secret: 'mySecret', resave: false, saveUninitialized: false }));



app.use(express.urlencoded({ extended: true }));
