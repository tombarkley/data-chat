// code for react page that does the following:
//  0. creates a state object that contains the following:
//    a. vCS - chat style
//    b. vLCE - last chat entry
//    c. vLCR - last chat response
//    d. vSQL - sql text block
//    e. vQR - an object that will contain the following:
//      i. headers - an array of headers for the table
//      ii. rows - an array of rows for the table
//      the headers and rows will be used to create a table and there will be a variable number of columns and rows
//    f. vCH - an array of chat history that will contain objects with the following:
//      i. agent - the agent that sent the message ('You' for the user and the chat style name for the bot)
//      ii. message - the message that was sent
//      iii. timestamp - the time that the message was added to the chat history
//  1. presents four option buttons for the user to click to select a chat style.  the four styles are:
//    a. T Rusty (tr_reg)
//    b. Vulgar T Rusty (tr_vul)
//    c. Hip Hop Gary (hh_gary)
//    d. Surfer Dude Drew (sd_drew)
//  2. once selected, the chat style is saved to the state of the page as vCS
//  3. presents a text box (html id of 'chat-entry') for the user to enter a message
//  4. presents a button ('Send') for the user to click and save the entry from chat-entry to the state of the page as vLCE
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
//  1. each entry by the user or response from the bot will be saved to the chat history (vCH)
//  2. the chat history will be displayed to the user in a scrolling manner with the following rules:
//    a. each message should have a label of the agent that sent the message and the message itself
//    b. the messages should be arranged by timestamp - from oldest to newest
//    c. the chat history should be just above the chat entry box and just below the chat style buttons
//    d. the chat history should be a fixed height and have a scroll bar if the number of messages exceeds the height
//    e. the bots reponses will be shown in a different color than the users responses
//  3. components (buttons, input boxes, tables, and headers) will be hidden until their step is reached and after their step is completed.  the only components that will be visible at all times are the chat style buttons, the chat entry box, and chat history
//  4. the approve button should send the sql text to the '/api/sql' post and expect back a json that conforms to the following:
//   a. send an object with the following keys:
//    sql: vSQL
//   b. expect a return object with the following keys:
//    headers - map to vQR.headers
//    rows - map to vQR.rows
//  5. all the other calls back to the server should use a post request to '/api/chat' which will operate in the following way:
//   a. send an object with the following keys:
//    chat_entry: vLCE
//    chat_style: vCS
//   b. expect a return object with the following keys:
//    semantics - the semantics of the query, not currently used in this app
//    bot - the response that will be displayed to the user
//    data - the query text that will later be reviewed by the user and potentially sent back through the '/api/sql' post request
//    chat_style - the chat bot style that was used to get the response from the openai api, not used in the app
//    chat_prompt - the prompt that was used to get the response from the openai api, not used in the app

import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import moment from 'moment';

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
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClick2 = this.handleClick2.bind(this);
    this.handleClick3 = this.handleClick3.bind(this);
    this.handleClick4 = this.handleClick4.bind(this);
    this.handleClick5 = this.handleClick5.bind(this);
    this.handleClick6 = this.handleClick6.bind(this);
    this.handleClick7 = this.handleClick7.bind(this);
  }

  handleChange(event) {
    this.setState({vLCE: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    axios.post('/api/chat', {
      chat_entry: this.state.vLCE,
      chat_style: this.state.vCS
    })
    .then(response => {
      this.setState({
        vLCR: response.data.bot,
        vSQL: response.data.data
      });
      this.setState({
        vCH: [...this.state.vCH, {
          agent: 'You',
          message: this.state.vLCE,
          timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')
        }]
      });
      this.setState({
        vCH: [...this.state.vCH, {
          agent: this.state.vCS,
          message: this.state.vLCR,
          timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')
        }]
      });
      this.setState({vLCE: ''});
    })
    .catch(error => {
      console.log(error);
    });
  }

  handleClick(event) {
    this.setState({vCS: event.target.value});
  }

  handleClick2(event) {
    event.preventDefault();
    this.setState({
      vCH: [...this.state.vCH, {
        agent: 'You',
        message: this.state.vLCE,
        timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')
      }]
    });
    this.setState({vLCE: ''});
  }

  handleClick3(event) {
    event.preventDefault();
    this.setState({
      vCH: [...this.state.vCH, {
        agent: this.state.vCS,
        message: this.state.vLCR,
        timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')
      }]
    });
  }

  handleClick4(event) {
    event.preventDefault();
    this.setState({
      vCH: [...this.state.vCH, {
        agent: 'You',
        message: this.state.vSQL,
        timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')
      }]
    });
  }

  handleClick5(event) {
    event.preventDefault();
    axios.post('/api/sql', {
      sql: this.state.vSQL
    })
    .then(response => {
      this.setState({
        vQR: {
          headers: response.data.headers,
          rows: response.data.rows
        }
      });
    })
    .catch(error => {
      console.log(error);
    });
  }

  handleClick6(event) {
    event.preventDefault();
    this.setState({
      vCH: [...this.state.vCH, {
        agent: this.state.vCS,
        message: this.state.vLCR,
        timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')
      }]
    });
  }

  handleClick7(event) {
    event.preventDefault();
    this.setState({
      vCH: [...this.state.vCH, {
        agent: 'You',
        message: this.state.vSQL,
        timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')
      }]
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Chatbot</h1>
        </header>
        <div className="App-intro">
          <div className="chat-style-buttons">
            <button value="tr_reg" onClick={this.handleClick}>T Rusty</button>
            <button value="tr_vul" onClick={this.handleClick}>Vulgar T Rusty</button>
            <button value="hh_gary" onClick={this.handleClick}>Hip Hop Gary</button>
            <button value="sd_drew" onClick={this.handleClick}>Surfer Dude Drew</button>
          </div>
          <div className="chat-history">
            <ul>
              {this.state.vCH.map((item, index) => {
                return (
                  <li key={index}>
                    <span className="agent">{item.agent}:</span>
                    <span className="message">{item.message}</span>
                    <span className="timestamp">{item.timestamp}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="chat-entry">
            <form onSubmit={this.handleSubmit}>
              <label>
                <input type="text" value={this.state.vLCE} onChange={this.handleChange} />
              </label>
              <input type="submit" value="Send" />
            </form>
          </div>
          <div className="chat-response">
            <button onClick={this.handleClick2}>Send</button>
            <button onClick={this.handleClick3}>Get Response</button>
            <p>{this.state.vLCR}</p>
          </div>
          <div className="sql-text">
            <button onClick={this.handleClick4}>Send</button>
            <p>{this.state.vSQL}</p>
          </div>
          <div className="approve-reject-retry">
            <button onClick={this.handleClick5}>Approve</button>
            <button>Reject</button>
            <button>Retry</button>
          </div>
          <div className="query-results">
            <button onClick={this.handleClick6}>Get Response</button>
            <p>{this.state.vLCR}</p>
            <button onClick={this.handleClick7}>Send</button>
            <p>{this.state.vSQL}</p>
            <CSVLink data={this.state.vQR.rows} headers={this.state.vQR.headers}>Download</CSVLink>
            <button>Start Over</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;