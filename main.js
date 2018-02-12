import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ChatApp from './client/components/ChatApp.jsx';

const ReactApp = () => (
  <MuiThemeProvider>
    <ChatApp />
  </MuiThemeProvider>
);

ReactDOM.render(
  <ReactApp />,
  document.getElementById('app')
);
