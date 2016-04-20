/**
 * Created by tadas on 2016-04-20.
 */
var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

app.use('/',express.static('public/'));

app.listen(port, function () {
    console.log('ToDoListApp is listening on port ' + port);
});