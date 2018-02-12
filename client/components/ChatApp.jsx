import React from 'react';
import request from 'superagent';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import AvMic from 'material-ui/svg-icons/av/mic';
import ContentSend from 'material-ui/svg-icons/content/send';
import Android from 'material-ui/svg-icons/action/android';
import Avatar from 'material-ui/Avatar';
import { Grid, Row, Col } from 'react-flexbox-grid';
import {red500, yellow500, blue500, orange200, pink400} from 'material-ui/styles/colors';
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
var synth = window.speechSynthesis;


const iconStyles = {
  marginRight: 24,
};

const userCardStyle = {
  height: 40,
  textAlign: 'right'
};

const botCardStyle = {
  height: 40,
  textAlign: 'left'
};

const userPaperStyle = {
  height: 40,
  textAlign: 'right',
  margin:  20,
  padding: 13
};

const botPaperStyle = {
  height: 40,
  textAlign: 'left',
  margin:  20,
  padding: 13
};

class ChatApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: '',
      messages: new Array()
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSendClick = this.handleSendClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.speechToText = this.speechToText.bind(this);
    this.textToSpeech = this.textToSpeech.bind(this);
  }

  handleChange(event){
		this.setState({userInput:event.target.value},function(){
    });
	}

  handleSendClick(){
    var tempMessages = this.state.messages;
    var tempUserMessage = {
      sender: 'User',
      text: this.state.userInput
    }
    tempMessages.push(tempUserMessage)
    this.setState({
      messages: tempMessages
    })
    var requestString = 'http://127.0.0.1:3001/callDialogflow/'+this.state.userInput;
    this.setState({userInput:''});
    request
    .get(requestString)
    .end((error, response)=>{
        console.log('Bot Message: ',response.text);
        this.textToSpeech(response.text);
        var tempMessages = this.state.messages;
        var tempBotMessage = {
          sender: 'Bot',
          text: response.text
        }
        tempMessages.push(tempBotMessage)
        this.setState({
          messages: tempMessages
        })
    })
  }

  handleKeyDown(event){
    if(event.key === 'Enter'){
      this.handleSendClick()
    }
  }

  printMessages(item){
    if(item.sender === 'User'){
      // return (<Card zDepth={3} style={userCardStyle}>
      //           <CardHeader
      //             title="User"
      //             avatarRight="images/bot.png"
      //           />
      //           <CardText>
      //             {item.text}
      //           </CardText>
      //         </Card>)
      return (
        <Grid fluid>
          <Paper zDepth={3} style={userPaperStyle} rounded={true}>
            <Row>
              <Col xs>
                {item.text}
              </Col>
              <Col xs={1}>
                <Avatar
                  icon={<Android />}
                  color={orange200}
                  backgroundColor={blue500}
                  size={30}
                />
              </Col>
            </Row>
          </Paper>
        </Grid>
      )
    }
    else{
      // return (<Card zDepth={3} style={botCardStyle}>
      //           <CardText>
      //             {item.text}
      //           </CardText>>
      //         </Card>)
      return (
        <Grid fluid>
          <Paper zDepth={3} style={botPaperStyle} rounded={true}>
            <Row>
              <Col xs={1}>
                <Avatar
                  icon={<Android />}
                  color={orange200}
                  backgroundColor={blue500}
                  size={30}
                />
              </Col>
              <Col xs>
                {item.text}
              </Col>
            </Row>
          </Paper>
        </Grid>
      )
    }
  }

  speechToText(e) {
    var context = this;
    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function(event) {
      var speechResult = event.results[0][0].transcript;
      console.log('Speech Result: ', speechResult);
      context.setState({userInput: speechResult}, () => {
        context.handleSendClick();
      });
    }

    recognition.onspeechend = function() {
      recognition.stop();
    }

    recognition.onerror = function(event) {
      diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
    }
  }

  textToSpeech(botReply){
    // var inputTxt = 'This is the text to speech test.';
    var voices = synth.getVoices();
    var utterThis = new SpeechSynthesisUtterance(botReply);
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    utterThis.onend = function (event) {
    }
    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }
    utterThis.voice = voices[3];
    utterThis.pitch = 1;
    utterThis.rate = 1;
    synth.speak(utterThis);
  }

  render() {
      return (
           <Card>
              <CardHeader
                title="Barry Allen"
                subtitle="The Flash"
              />
              <CardText>
                {this.state.messages.map((item)=>{
                  return (this.printMessages(item))
                })}

              </CardText>
              <CardActions>
                  <Grid fluid>
                    <Row>
                      <Col xs>
                        <TextField hintText="User Says..."
                                   value={this.state.userInput}
                                   fullWidth={true}
                                   onChange={this.handleChange}
                                   onKeyDown={this.handleKeyDown}
                        />
                      </Col>
                      <Col xs={1} style={{textAlign: 'center'}}>
                        <IconButton tooltip="Speak">
                          <AvMic color={blue500}
                                 onClick={this.speechToText}
                          />
                        </IconButton>
                      </Col>
                    </Row>
                  </Grid>
             </CardActions>
          </Card>
      );
   }
}
export default ChatApp;
