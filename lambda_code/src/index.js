/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * For additional samples, visit the Alexa Skills Kit developer documentation at
 * https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit/getting-started-guide
 */

var request = require('request');

var SERVER_LOCATION = "http://home.kevinmook.com:7200";
var APPLICATION_ID = "amzn1.echo-sdk-ams.app.bacef1fa-7bb6-47b3-9358-d94905956121";

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
  try {
    console.log("event.session.application.applicationId=" + event.session.application.applicationId);

    if (event.session.application.applicationId !== APPLICATION_ID) {
       context.fail("Invalid Application ID");
     }

    if (event.request.type === "LaunchRequest") {
      // nothing to do
      context.succeed();
    }  else if (event.request.type === "IntentRequest") {
      onIntent(event.request,
           event.session,
           function callback(sessionAttributes, speechletResponse) {
              if(speechletResponse) {
                context.succeed(buildResponse(sessionAttributes, speechletResponse));
              } else {
                context.succeed();
              }
           });
    } else if (event.request.type === "SessionEndedRequest") {
      context.succeed();
    }
  } catch (e) {
    context.fail("Exception: " + e);
  }
};

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
  console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

  var intent = intentRequest.intent;
  var intentName = intentRequest.intent.name;

  // Dispatch to your skill's intent handlers
  if (intentName === "PlayIntent") {
    handlePlayIntent(intent, session, callback);
  } else if (intentName === "TypeIntent") {
    handleTypeIntent(intent, session, callback);
  } else if (intentName === "SkipIntent") {
    handleSkipIntent(intent, session, callback);
  } else if (intentName === "PressIntent") {
    handlePressIntent(intent, session, callback);
  } else {
    throw "Invalid intent";
  }
}

function handlePlayIntent(intent, session, callback) {
  sendRokuCommand("play", null, intent, session, callback);
}

function handleTypeIntent(intent, session, callback) {
  sendRokuCommand("type", intent.slots.TypeText, intent, session, callback);
}

function handleSkipIntent(intent, session, callback) {
  var direction = intent.slots.SkipDirection.value;
  var command;
  if(direction == "ahead" || direction == "forward" || direction == "forwards") {
    command = "skip_forward";
  } else if(direction == "back" || direction == "backward" || direction == "backwards") {
    command = "skip_back";
  } else {
    callback({}, buildSpeechletResponse("Error: Unknown direction, "+direction));
    return;
  }
  sendRokuCommand(command, parseInt(intent.slots.SkipAmount.value || 1), intent, session, callback);
}

function handlePressIntent(intent, session, callback) {
  var button = intent.slots.Button.value;
  sendRokuCommand(button, null, intent, session, callback);
}

// --------------- Functions that control the skill's behavior -----------------------

function sendRokuCommand(commandName, arg, intent, session, callback) {
  var sessionAttributes = {};

  var cardContent = commandName;

  var argParam = "";
  if(arg) {
    argParam = "&arg="+arg;
    cardContent = cardContent + " " + arg;
  }

  request(SERVER_LOCATION + "?command=" + commandName + argParam, function (error, response, body) {
    callback(sessionAttributes, buildSpeechletResponse(cardContent));
  });
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(cardContent) {
  return {
    card: {
      type: "Simple",
      title: "Roku",
      content: cardContent
    },
    shouldEndSession: true
  }
}

function buildResponse(sessionAttributes, speechletResponse) {
  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }
}
