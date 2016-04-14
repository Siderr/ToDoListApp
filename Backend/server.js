var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var routes = require('./routes');

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/tasks');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE");
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

app.use('/', routes);

app.listen(port);
console.log('RESTAPI listening on port: ' + port);
