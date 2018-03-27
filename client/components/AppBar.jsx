////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
//  filename : AppBar.jsx                                                                                         //
//  author: Prateek Pandey(Digital)                                                                               //
//  language/framework: ReactJs                                                                                   //
//  description: This is the file that renders the AppBar on the webpage of the SPA.                              //
//  input: NA                                                                                                     //
//  output: NA                                                                                                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Importing the required dependencies
import React from 'react';
import { Menu, Segment } from 'semantic-ui-react';

// Exporting the component so that it can be imported in any other component that requires it
export default class AppBar extends React.Component{
  constructor(){
    super();
  }
  render(){
    return(
        /* Return a menu that covers the full width of its container and is elevated from the surface */
        <Menu fluid style={{zIndex: '999', position:'fixed', top:'0', height:'8%'}}>
          <Menu.Item> <h3> DialogFlow ChatBot </h3> </Menu.Item>
        </Menu>
    );
  }
}
