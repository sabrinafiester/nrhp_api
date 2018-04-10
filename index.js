require('dotenv').load();
var app = require('express')();
var fileUpload = require('express-fileupload');
var mongoose = require('mongoose');
 
var server = require('http').Server(app);
 
app.use(fileUpload());
 
server.listen(3000);
 
mongoose.connect('mongodb://localhost/csvimport');
 
// var singlePlace = require('./singlePlace.js');
// app.get('/:id([0-9]+)', singlePlace.get);

var inCity = require('./city.js');
app.get('/city/:cityName([a-zA-Z]+)', inCity.get);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
 
var template = require('./template.js');
app.get('/template', template.get);
 

var upload = require('./upload.js');
app.post('/', upload.post);