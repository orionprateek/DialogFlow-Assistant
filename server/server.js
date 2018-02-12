'use strict';
const express = require('express')
    , bodyParser = require('body-parser')
    , apiai = require('apiai')
    , app = express()
    , dialogflowApp = apiai("cfbe8610671d44d994e4d939ded5fc37");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/test', function(req, res){
  console.log('Recieved Request');
  res.send('Server Running Healthy!')
})

app.get('/callDialogflow/:utterance', function(req, res){
  console.log(req.params.utterance);
  // var request = dialogflowApp.textRequest(req.params.utterance, {
  //     sessionId: '<unique session id>'
  // });
  // request.on('response', function(response) {
  //     console.log(response.result.fulfillment.speech);
  //     res.send(response.result.fulfillment.speech)
  // });
  // request.on('error', function(error) {
  //     console.log(error);
  // });
  // request.end();
  // res.set('Content-Type', 'text/plain');
  res.send('This is the default response from the bot.')
})



app.listen(3001, function() {
    console.log("Server up and listening on port 3001");
});
