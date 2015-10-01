/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * For additional samples, visit the Alexa Skills Kit developer documentation at
 * https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit/getting-started-guide
 */

var request = require('request');

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
  try {
    console.log("event.session.application.applicationId=" + event.session.application.applicationId);

    if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.bacef1fa-7bb6-47b3-9358-d94905956121") {
       context.fail("Invalid Application ID");
     }

    if (event.request.type === "LaunchRequest") {
      // nothing to do
      context.succeed();
    }  else if (event.request.type === "IntentRequest") {
      onIntent(event.request,
           event.session,
           function callback(sessionAttributes, speechletResponse) {
             context.succeed(buildResponse(sessionAttributes, speechletResponse));
           });
    } else if (event.request.type === "SessionEndedRequest") {
      onSessionEnded(event.request, event.session);
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

  var intent = intentRequest.intent,
    intentName = intentRequest.intent.name;

  // Dispatch to your skill's intent handlers
  if (intentName === "play" || intentName === "pause" || intentName === "resume") {
    sendRokuCommand(intentName, intent, session, callback);
  } else {
    throw "Invalid intent";
  }
}

// --------------- Functions that control the skill's behavior -----------------------

function sendRokuCommand(commandName, intent, session, callback) {
  var sessionAttributes = {};

  var cardTitle = commandName;
  var speechOutput = commandName;
  var repromptText = null;
  var shouldEndSession = true;

  request("http://home.kevinmook.com:7200?command=" + commandName, function (error, response, body) {
    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
  });
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
  return {
    outputSpeech: {
      type: "PlainText",
      text: output
    },
    card: {
      type: "Simple",
      title: "SessionSpeechlet - " + title,
      content: "SessionSpeechlet - " + output
    },
    reprompt: {
      outputSpeech: {
        type: "PlainText",
        text: repromptText
      }
    },
    shouldEndSession: shouldEndSession
  }
}

function buildResponse(sessionAttributes, speechletResponse) {
  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }
}
