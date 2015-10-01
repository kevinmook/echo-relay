var request = require('request');
var express = require('express');
var underscore = require('underscore');

var app = express();

function sendCommand(command, arg) {
  if(command == "play") {
    sendKeypress("Play");
  } else if(command == "reverse") {
    sendKeypress("Rev");
  } else if(command == "forward") {
    sendKeypress("Fwd");
  } else if(command == "select") {
    sendKeypress("Select");
  } else if(command == "left") {
    sendKeypress("Left");
  } else if(command == "right") {
    sendKeypress("Right");
  } else if(command == "down") {
    sendKeypress("Down");
  } else if(command == "up") {
    sendKeypress("Up");
  } else if(command == "back") {
    sendKeypress("Back");
  } else if(command == "instant_replay") {
    sendKeypress("InstantReplay");
  } else if(command == "info") {
    sendKeypress("Info");
  } else if(command == "backspace") {
    sendKeypress("Backspace");
  } else if(command == "search") {
    sendKeypress("Search");
  } else if(command == "enter") {
    sendKeypress("Enter");
  } else if(command == "up") {
    sendKeypress("Up");
  } else if(command == "type") {
    command_list = underscore.map(arg, function(character) {
      return "Lit_"+character;
    });
    sendArray(command_list);
  } else if (command == "skip_ahead" || command == "skip_back") {
    skip(command, parseInt(arg));
  }
}

function skip(command, amount) {
  if(amount < 1) {
    amount = 1;
  }
  amount = Math.ceil(amount / 10) * 10;

  command_list = [];
  underscore.times(amount, function(count) {
    if(command == "skip_ahead") {
      command_list.push("Right");
    } else {
      command_list.push("Left");
    }
  });
  command_list.push("Select");

  sendArray(command_list);
}

function sendArray(array) {
  var fun = function(index) {
    var command = array[index];
    sendKeypress(command, function() {
      if(index < array.length - 1) {
        fun(index + 1);
      }
    });
  };

  fun(0);
}

function sendKeypress(key, callback) {
  request.post("http://192.168.0.101:8060/keypress/"+key, function (error, response, body) {
    if(callback) {
      callback();
    }
  });
}

app.get('/', function (req, res) {
  var command = "";
  if(command = req.query.command) {
    sendCommand(command, req.query.arg);
  }
  res.send('Hello World!');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
