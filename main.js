////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
//  filename : main.js                                                                                            //
//  author: Prateek Pandey(Digital)                                                                               //
//  language/framework: ReactJs                                                                                   //
//  description: This is the main file that renders the ReactUI on the webpage of the SPA.                        //
//  input: NA                                                                                                     //
//  output: NA                                                                                                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Importing the required dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import ChatApp from './client/components/ChatApp.jsx';
import AppBar from './client/components/AppBar.jsx';

// Creating the app with different components inside.
const ReactApp = () => (
  <div>
    <AppBar />
    <ChatApp />
  </div>
);

//  Rendering the app using the element id on the HTML page.
ReactDOM.render(
  <ReactApp />,
  document.getElementById('app')
);
