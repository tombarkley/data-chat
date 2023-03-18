// code for react page that does the following:
//  0. creates a state object that contains the following:
//    a. vCS - chat style
//    b. vLCE - last chat entry
//    c. vLCR - last chat response
//    d. vSQL - sql text block
//    e. vQR - an object that will contain the following:
//      i. headers - an array of headers for the table
//      ii. rows - an array of rows for the table
//    f. vCH - an array of chat history
//  1. presents four option buttons for the user to click to select a chat style.  the four styles are:
//    a. T Rusty (tr_reg)
//    b. Vulgar T Rusty (tr_vul)
//    c. Hip Hop Gary (hh_gary)
//    d. Surfer Dude (sd)
//  2. once selected, the chat style is saved to the state of the page as vCS
//  3. presents a text box for the user to enter a message
//  4. presents a button for the user to click to send the message and save to the state of the page as vLCE
//  5. sends the message to the server through two different api calls:
//    a. one to get a chat response for the bot (saved to page state as vLCR)
//    b. one to get a text block to display to the user (saved to page state as vSQL)
//  6. presents the vLCR response to the user once received
//  7. presents a button for the user to click to view the block of text (vSQL)
//  8. once the button is clicked, the text block (vSQL) is displayed to the user
//  9. presents three buttons for the user to click to approve, reject, or retry the request
//     a. if the user clicks approve, move on to next numbered step
//     b. if the user clicks reject, reset page and state and start again at step 1
//     c. if the user clicks retry, reset page and state to where it was at the end of step 4 and start again at step 5
//     after any of the three buttons are clicked the text block and buttons are hidden
//  10. send vSQL back to server which will return an object that will be saved to page state as vQR
//  11. present the table to the user
//  12. present a button for the user to click to download the table as a csv file
//  13. once the button is clicked, download the csv file
//  14. present a button for the user to click to start over
//  15. once the button is clicked, reset page and state and start again at step 1
// additional notes:
//  1. the chat history (vCH) will be saved to the page state and will be displayed in a descending manner from the top of the page
//  2. components will be hidden until their step is reached and after their step is completed

import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vCS: '',
      vLCE: '',
      vLCR: '',
      vSQL: '',
      vQR: {
        headers: [],
        rows: []
      },
      vCH: []
    };
  }

  componentDidMount() {
    // this.getChatResponse();
  }

  getChatResponse = () => {
    axios.get('/api/chat')
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleChatStyle = (event) => {
    this.setState({
      vCS: event.target.value
    });
  }

  handleLastChatEntry = (event) => {
    this.setState({
      vLCE: event.target.value
    });
  }

  handleLastChatResponse = () => {
    this.setState({
      vLCR: 'This is a test'
    });
  }

  handleSQLText = () => {
    this.setState({
      vSQL: 'SELECT * FROM test'
    });
  }

  handleQueryResult = () => {
    this.setState({
      vQR: {
        headers: ['header1', 'header2', 'header3'],
        rows: [
          ['row1col1', 'row1col2', 'row1col3'],
          ['row2col1', 'row2col2', 'row2col3'],
          ['row3col1', 'row3col2', 'row3col3']
        ]
      }
    });
  }

  handleChatHistory = () => {
    this.setState({
      vCH: [{
        entry: 'This is a test entry',
        response: 'This is a test response'
      }]
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <input type="text" onChange={this.handleLastChatEntry} />
        <button onClick={this.handleLastChatResponse}>Test Chat Response</button>
        <br />
        <button onClick={this.handleSQLText}>Test SQL Text</button>
        <br />
        <button onClick={this.handleQueryResult}>Test Query Result</button>
        <br />
        <button onClick={this.handleChatHistory}>Test Chat History</button>
      </div>
    );
  }
}

export default App;