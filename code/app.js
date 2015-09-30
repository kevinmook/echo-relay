var request = require('request');
var express = require('express');
var app = express();

function sendCommand(command) {
  request.post("http://192.168.0.101:8060/keypress/Play")
}

app.get('/', function (req, res) {
  var response = "No params";
  if(command = req.query.command) {
    response = command;
    sendCommand(command);
  }
  res.send('Hello World! ' + response);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
