////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
//  filename : ChatApp.jsx                                                                                         //
//  author: Prateek Pandey(Digital)                                                                               //
//  language/framework: ReactJs                                                                                   //
//  description: This is the file that renders the Chat App on the webpage of the SPA.                            //
//  input: NA                                                                                                     //
//  output: NA                                                                                                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Importing the required dependencies
import React from 'react';
import request from 'superagent';
import { Input, Grid, Icon, Button, Card, Image, List, Segment, Menu } from 'semantic-ui-react';

/* Initializing the Speech Recognition and Speech Synthesis api */
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
  , SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
  , SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
  , synth = window.speechSynthesis;

// Creating the Chat App component
class ChatApp extends React.Component {
  constructor(props) {
    super(props);

    // Initializing the state variables
    this.state = {
      userInput: '',
      messages: new Array()
    };

    // binding the functions
    this.handleChange = this.handleChange.bind(this);
    this.handleSendClick = this.handleSendClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.speechToText = this.speechToText.bind(this);
    this.textToSpeech = this.textToSpeech.bind(this);
    this.printMessages = this.printMessages.bind(this);
  }

  // function to handle any change in text input
  handleChange(event){
    // setting state with the updated changes in the user input field
		this.setState({userInput:event.target.value});
	}

  // function to handle when user clicks send button. Now that happens on Enter key press too
  handleSendClick(){

    // Creating a temporary variable to store the messages state
    var tempMessages = this.state.messages
      , tempUserMessage = {             // Creating a temporary object to store the message and the sender details
      sender: 'User',
      text: this.state.userInput
    }

    // resetting the userInput state to empty string
    this.setState({userInput: ''});

    // pushing the temporary user message object to temposrary message array
    tempMessages.push(tempUserMessage);

    // setting the message state to the temporary message array
    this.setState({
      messages: tempMessages
    })

    // creating the http request url dynamically
    var requestString = 'http://127.0.0.1:3001/callDialogflow/'+this.state.userInput;

    // sending a http request to server to get the dialogflow response
    request
    .get(requestString)
    .end((error, response)=>{

        // Once response is received convert the text to speech
        this.textToSpeech(response.text);
        var tempMessages = this.state.messages;
          , tempBotMessage = {
          sender: 'Bot',
          text: response.text
        }
        tempMessages.push(tempBotMessage)
        this.setState({
          messages: tempMessages
        })
    })
  }

  // function that handles key press. Once Enter key is pressed it initiates the handleSendClick function
  handleKeyDown(event){
    if(event.key === 'Enter'){
      this.handleSendClick()
    }
  }

  // function to print the messages in message list
  printMessages(item, key){

    // finding the message length to determine card width later
    var messageLength = item.text.length
      , maxWidth;

    // setting up the max card width according the card length
    if(messageLength <= 5){
      maxWidth = '50px'
    }
    else if(messageLength > 5 && messageLength <= 10) {
      maxWidth = '100px'
    }
    else if(messageLength > 10 && messageLength <= 25) {
      maxWidth = '175px'
    }
    else if(messageLength > 25 && messageLength <= 40) {
      maxWidth = '225px'
    }
    else if(messageLength > 40 && messageLength <= 55) {
      maxWidth = '300px'
    }
    else{
      maxWidth = '400px'
    }

    // returning the card with styling specific to user/bot
    if(item.sender === 'User'){
      return (
        <Grid.Row key={key}>
          <Grid.Column>
            <Card style={{float:'right', textAlign: 'right', maxWidth: maxWidth}}>
              <Card.Content>
                {item.text}
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      )
    }
    else{
      return (
        <Grid.Row key={key}>
          <Grid.Column>
            <Card style={{textAlign: 'left', maxWidth: maxWidth}}>
              <Card.Content>
                {item.text}
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      )
    }
  }

  // function to convert speech to text
  speechToText(e) {

    // setting the speech recongnition settings
    var context = this
      , recognition = new SpeechRecognition()
      , speechRecognitionList = new SpeechGrammarList();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // starting speech recognition
    recognition.start();

    // On the event of successful speech recognition
    recognition.onresult = function(event) {

      // storing the speech to text conversion results
      var speechResult = event.results[0][0].transcript;

      // setting the userInput state with the speech conversion results
      context.setState({userInput: speechResult}, () => {
        context.handleSendClick();
      });
    }

    // stopping the recognition function when speech ends
    recognition.onspeechend = function() {
      recognition.stop();
    }

    // handling errors if any while speech recognition
    recognition.onerror = function(event) {
      diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
    }
  }


  // function to convert text to speech
  textToSpeech(botReply){

    // initializing the text to speech settings
    var voices = synth.getVoices()
      , utterThis = new SpeechSynthesisUtterance(botReply);
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }
    utterThis.voice = voices[1];
    utterThis.pitch = 1;
    utterThis.rate = 1;

    // speaking the text
    synth.speak(utterThis);
  }

  // Scroll to bottom of the chat
  componentDidMount() {
    this.scrollToBottom();
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }
  scrollToBottom() {
    document.getElementById('bottomDiv').scrollIntoView({ behavior: 'smooth' });
  }


  render() {

      // setting dynamic top margin and inputbox left margin
      var marginTop
        , inputBoxMarginLeft;
      if(window.innerWidth <= 450){
        marginTop = '16%'
        inputBoxMarginLeft = '10px'
      }
      else if(window.innerWidth > 450 && window.innerWidth < 800){
        marginTop = '8%'
        inputBoxMarginLeft = '4px'
      }
      else{
        marginTop = '4%'
        inputBoxMarginLeft = '0'
      }
      return (
          <div>
            {/* The Chat Area */}
            <div id='chatApp' style={{padding: '1%', marginTop: marginTop, maxHeight: '628px', overflowX: 'hidden', overflowY: 'hidden'}}>
              <Grid>
                {
                   // Displaying the messages in the messages array of state
                  this.state.messages.map((item,key)=>{
                    return(
                      this.printMessages(item, key)
                    )
                  })
                }
              </Grid>
              <div id='bottomDiv' style={{padding: '0', margin:'0'}}>
              </div>
            </div>

            {/* The Input Box area */}
            <div style={{position:'fixed', bottom:'0', zIndex:'99', width:'100%'}}>
              <Input fluid placeholder = 'Say something...'
                     value = {this.state.userInput}
                     onChange = {this.handleChange}
                     icon = {<Icon name='microphone' inverted circular link onClick={this.speechToText} />}
                     onKeyDown = {this.handleKeyDown}
                     autoFocus={true}
                     size='large'
              />
            </div>
          </div>
      );
   }
}
export default ChatApp;
