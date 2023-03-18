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
//  5. all the other calls back to the server should use a post request to '/api/gpt' which will operate in the following way:
//   a. send an object with the following keys:
//    chat_entry: vLCE
//    chat_style: vCS
//   b. expect a return object with the following keys:
//    semantics - the semantics of the query, not currently used in this app
//    bot - the response that will be displayed to the user
//    data - the query text that will later be reviewed by the user and potentially sent back through the '/api/sql' post request
//    chat_style - the chat bot style that was used to get the response from the openai api, not used in the app
//    chat_prompt - the prompt that was used to get the response from the openai api, not used in the app
//  6. use fetch to make the api calls to the server

import React, { Component } from 'react';
import './App.css';

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
    this.handleChatStyle = this.handleChatStyle.bind(this);
    this.handleChatEntry = this.handleChatEntry.bind(this);
    this.handleChatSend = this.handleChatSend.bind(this);
    this.handleChatView = this.handleChatView.bind(this);
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
    let vCH = this.state.vCH;
    vCH.push({
      agent: 'You',
      message: this.state.vLCE,
      timestamp: Date.now()
    });
    this.setState({
      vCH: vCH
    });
    fetch('/api/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_entry: this.state.vLCE,
        chat_style: this.state.vCS
      })
    })
      .then(res => res.json())
      .then(res => {
        vCH = this.state.vCH;
        vCH.push({
          agent: this.state.vCS,
          message: res.bot,
          timestamp: Date.now()
        });
        this.setState({
          vLCR: res.bot,
          vSQL: res.data,
          vCH: vCH
        });
      });
  }

  handleChatView() {
    this.setState({
      vLCR: '',
      vSQL: ''
    });
  }

  handleChatApprove() {
    fetch('/api/sql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sql: this.state.vSQL
      })
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          vQR: {
            headers: res.headers,
            rows: res.rows
          }
        });
      });
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
  }

  handleChatDownload() {
    let csv = '';
    let vQR = this.state.vQR;
    for (let i = 0; i < vQR.headers.length; i++) {
      csv += vQR.headers[i];
      if (i < vQR.headers.length - 1) {
        csv += ',';
      }
    }
    csv += '\n';
    for (let i = 0; i < vQR.rows.length; i++) {
      for (let j = 0; j < vQR.rows[i].length; j++) {
        csv += vQR.rows[i][j];
        if (j < vQR.rows[i].length - 1) {
          csv += ',';
        }
      }
      if (i < vQR.rows.length - 1) {
        csv += '\n';
      }
    }
    let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'query_results.csv';
    hiddenElement.click();
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
          <h1>Chat Bot</h1>
        </div>
        <div className="App-body">
          <div className="App-chat-history">
            <div className="App-chat-history-header">Chat History</div>
            <div className="App-chat-history-body">
              {this.state.vCH.map(chat => (
                <div className="App-chat-history-entry">
                  <div className="App-chat-history-entry-agent">
                    {chat.agent}
                  </div>
                  <div className="App-chat-history-entry-message">
                    {chat.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="App-chat-entry">
            <div className="App-chat-entry-header">Chat Entry</div>
            <div className="App-chat-entry-body">
              <input
                id="chat-entry"
                type="text"
                value={this.state.vLCE}
                onChange={this.handleChatEntry}
              />
              <button onClick={this.handleChatSend}>Send</button>
            </div>
          </div>
          <div className="App-chat-style">
            <div className="App-chat-style-header">Chat Style</div>
            <div className="App-chat-style-body">
              <button
                value="tr_reg"
                onClick={this.handleChatStyle}
                disabled={this.state.vCS === 'tr_reg'}
              >
                T Rusty
              </button>
              <button
                value="tr_vul"
                onClick={this.handleChatStyle}
                disabled={this.state.vCS === 'tr_vul'}
              >
                Vulgar T Rusty
              </button>
              <button
                value="hh_gary"
                onClick={this.handleChatStyle}
                disabled={this.state.vCS === 'hh_gary'}
              >
                Hip Hop Gary
              </button>
              <button
                value="sd_drew"
                onClick={this.handleChatStyle}
                disabled={this.state.vCS === 'sd_drew'}
              >
                Surfer Dude Drew
              </button>
            </div>
          </div>
          <div className="App-chat-response">
            <div className="App-chat-response-header">Chat Response</div>
            <div className="App-chat-response-body">
              {this.state.vLCR}
            </div>
          </div>
          <div className="App-chat-view">
            <div className="App-chat-view-header">Chat View</div>
            <div className="App-chat-view-body">
              <button onClick={this.handleChatView}>View</button>
              <div className="App-chat-view-text">
                {this.state.vSQL}
              </div>
              <button onClick={this.handleChatApprove}>Approve</button>
              <button onClick={this.handleChatReject}>Reject</button>
              <button onClick={this.handleChatRetry}>Retry</button>
            </div>
          </div>
          <div className="App-chat-query">
            <div className="App-chat-query-header">Chat Query</div>
            <div className="App-chat-query-body">
              <table>
                <thead>
                  <tr>
                    {this.state.vQR.headers.map(header => (
                      <th>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {this.state.vQR.rows.map(row => (
                    <tr>
                      {row.map(cell => (
                        <td>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={this.handleChatDownload}>Download</button>
              <button onClick={this.handleChatStartOver}>Start Over</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;