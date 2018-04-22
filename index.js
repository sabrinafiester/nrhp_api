require('dotenv').load();
const app = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use( bodyParser.json() );
const siteRouter = require('./routes/sites.js');
const server = require('http').Server(app);

app.use('/sites', siteRouter);
let port = process.env.PORT || 3000;
server.listen(port);

mongoose.connect(process.env.MONGODB_URI);

// mongoose.connect('mongodb://localhost/csvimport');

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

const upload = require('./ignore/upload.js');
app.post('/', upload.post);