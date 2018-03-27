////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
//  filename : main.js                                                                                            //
//  author: Prateek Pandey(Digital)                                                                               //
//  language: ReactJs                                                                                             //
//  description: This is the main file that renders the ReactUI on the webpage of the SPA.                        //
//  input: NA                                                                                                     //
//  output: NA                                                                                                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


'use strict'

// Importing required dependencies
const express = require('express')
    , bodyParser = require('body-parser')
    , apiai = require('apiai')
    , app = express()
    , dialogflowApp = apiai("cfbe8610671d44d994e4d939ded5fc37"); /* Using the apiai npm module and initializing it
                                                                    with client secret of the dialogflow agent */

// setting up the required headers for any HTTP request-response
app.use((req, res, next) => {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
});

// setting up the body parser to handle post request
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// test route to check server health
app.get('/test', function(req, res){
  console.log('Recieved Health Request');
  res.send('Server Running Healthy!')
})

// route to call dialogflow api using the client secret with the utterance and get the reponse
app.get('/callDialogflow/:utterance/', function(req, res){

  // storing the query received from the HTTP call
  var query = req.params.utterance.toUpperCase();
  console.log('Sending request to dialogflow!');

  /* creating the request with the utterance and a unique sessionId. The sessionId object is
     required while sending the request */
  var request = dialogflowApp.textRequest(req.params.utterance, {
      sessionId: '<unique session id>'
  });

  // On the event of response received
  request.on('response', function(response) {
      console.log(response.result.fulfillment.speech);

      // send the response received from dialogflow agent back to where the query came from
      res.send(response.result.fulfillment.speech)
  });

  // On the event of error received
  request.on('error', function(error) {
      console.log(error);
  });

  // Once request is comleted it is required to end the request
  request.end();
})


// Creating the server to listen at localhost:3001
app.listen(3001, function() {
    console.log("Server up and listening on port 3001");
});
