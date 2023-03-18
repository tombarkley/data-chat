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
//  2. components will be hidden until their step is reached and after their step is completed
//  3. the chat history will be displayed to the user in a scrolling manner with the following rules:
//    a. each message should have a label of the agent that sent the message and the message itself
//    b. the messages should be arranged by timestamp - from oldest to newest
//    c. the chat history should be just above the chat entry box and just below the chat style buttons
//    d. the chat history should be a fixed height and have a scroll bar if the number of messages exceeds the height

import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class DataChat extends Component {
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
    this.handleChatStyle = this.handleChatStyle.bind(this);
    this.handleChatEntry = this.handleChatEntry.bind(this);
    this.handleChatSend = this.handleChatSend.bind(this);
    this.handleChatResponse = this.handleChatResponse.bind(this);
    this.handleChatTextBlock = this.handleChatTextBlock.bind(this);
    this.handleChatApprove = this.handleChatApprove.bind(this);
    this.handleChatReject = this.handleChatReject.bind(this);
    this.handleChatRetry = this.handleChatRetry.bind(this);
    this.handleChatDownload = this.handleChatDownload.bind(this);
    this.handleChatStartOver = this.handleChatStartOver.bind(this);
  }

  handleChatStyle(event) {
    this.setState({
      vCS: event.target.value
    });
  }

  handleChatEntry(event) {
    this.setState({
      vLCE: event.target.value
    });
  }

  handleChatSend() {
    this.setState({
      vCH: [...this.state.vCH, {
        agent: 'You',
        message: this.state.vLCE,
        timestamp: new Date().toLocaleString()
      }]
    });
    this.handleChatResponse();
    this.handleChatTextBlock();
  }

  handleChatResponse() {
    axios.get('/api/chat/' + this.state.vCS + '/' + this.state.vLCE)
      .then(res => {
        this.setState({
          vLCR: res.data
        });
      });
  }

  handleChatTextBlock() {
    axios.get('/api/chat/' + this.state.vCS + '/' + this.state.vLCE + '/textblock')
      .then(res => {
        this.setState({
          vSQL: res.data
        });
      });
  }

  handleChatApprove() {
    this.handleChatQueryResults();
  }

  handleChatReject() {
    this.setState({
      vCS: '',
      vLCE: '',
      vLCR: '',
      vSQL: '',
      vQR: {
        headers: [],
        rows: []
      },
      vCH: []
    });
  }

  handleChatRetry() {
    this.setState({
      vLCR: '',
      vSQL: ''
    });
    this.handleChatResponse();
    this.handleChatTextBlock();
  }

  handleChatQueryResults() {
    axios.get('/api/chat/' + this.state.vCS + '/' + this.state.vLCE + '/queryresults')
      .then(res => {
        this.setState({
          vQR: res.data
        });
      });
  }

  handleChatDownload() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += this.state.vQR.headers.join(',') + '\n';
    this.state.vQR.rows.forEach(function(rowArray) {
      let row = rowArray.join(',');
      csvContent += row + '\n';
    });
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'queryresults.csv');
    document.body.appendChild(link);
    link.click();
  }

  handleChatStartOver() {
    this.setState({
      vCS: '',
      vLCE: '',
      vLCR: '',
      vSQL: '',
      vQR: {
        headers: [],
        rows: []
      },
      vCH: []
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Data Chat</h2>
        </div>
        <div className="App-intro">
          <div className="App-chat-style">
            <h3>Select a Chat Style</h3>
            <div className="App-chat-style-buttons">
              <button value="tr_reg" onClick={this.handleChatStyle}>T Rusty</button>
              <button value="tr_vul" onClick={this.handleChatStyle}>Vulgar T Rusty</button>
              <button value="hh_gary" onClick={this.handleChatStyle}>Hip Hop Gary</button>
              <button value="sd_drew" onClick={this.handleChatStyle}>Surfer Dude Drew</button>
            </div>
          </div>
          <div className="App-chat-history">
            <h3>Chat History</h3>
            <div className="App-chat-history-messages">
              {this.state.vCH.map((message, index) => {
                return (
                  <div key={index}>
                    <span className="App-chat-history-agent">{message.agent}</span>
                    <span className="App-chat-history-message">{message.message}</span>
                    <span className="App-chat-history-timestamp">{message.timestamp}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="App-chat-entry">
            <h3>Enter a Message</h3>
            <input id="chat-entry" type="text" value={this.state.vLCE} onChange={this.handleChatEntry} />
            <button onClick={this.handleChatSend}>Send</button>
          </div>
          <div className="App-chat-response">
            <h3>Chat Response</h3>
            <div className="App-chat-response-message">
              {this.state.vLCR}
            </div>
          </div>
          <div className="App-chat-text-block">
            <h3>Text Block</h3>
            <div className="App-chat-text-block-message">
              {this.state.vSQL}
            </div>
            <div className="App-chat-text-block-buttons">
              <button onClick={this.handleChatApprove}>Approve</button>
              <button onClick={this.handleChatReject}>Reject</button>
              <button onClick={this.handleChatRetry}>Retry</button>
            </div>
          </div>
          <div className="App-chat-query-results">
            <h3>Query Results</h3>
            <div className="App-chat-query-results-table">
              <table>
                <thead>
                  <tr>
                    {this.state.vQR.headers.map((header, index) => {
                      return (
                        <th key={index}>{header}</th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {this.state.vQR.rows.map((row, index) => {
                    return (
                      <tr key={index}>
                        {row.map((cell, index) => {
                          return (
                            <td key={index}>{cell}</td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="App-chat-query-results-buttons">
              <button onClick={this.handleChatDownload}>Download</button>
              <button onClick={this.handleChatStartOver}>Start Over</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DataChat;