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

import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import { Button, Form, FormGroup, Label, Input, FormText, Table } from 'reactstrap';

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
  }

  handleChange(event) {
    this.setState({vLCE: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({vLCR: ''});
    this.setState({vSQL: ''});
    this.setState({vQR: {
      headers: [],
      rows: []
    }});
    axios.post('/api/chat', {
      chatStyle: this.state.vCS,
      chatEntry: this.state.vLCE
    })
    .then(res => {
      this.setState({vLCR: res.data.chatResponse});
      this.setState({vSQL: res.data.sqlText});
      this.setState({vCH: [...this.state.vCH, {agent: 'You', message: this.state.vLCE, timestamp: Date.now()}]});
      this.setState({vCH: [...this.state.vCH, {agent: this.state.vCS, message: this.state.vLCR, timestamp: Date.now()}]});
    })
    .catch(err => {
      console.log(err);
    });
  }

  handleClick(event) {
    event.preventDefault();
    if (event.target.id === 'tr_reg') {
      this.setState({vCS: 'T Rusty'});
    } else if (event.target.id === 'tr_vul') {
      this.setState({vCS: 'Vulgar T Rusty'});
    } else if (event.target.id === 'hh_gary') {
      this.setState({vCS: 'Hip Hop Gary'});
    } else if (event.target.id === 'sd_drew') {
      this.setState({vCS: 'Surfer Dude Drew'});
    } else if (event.target.id === 'view-sql') {
      axios.post('/api/sql', {
        sqlText: this.state.vSQL
      })
      .then(res => {
        this.setState({vQR: res.data});
      })
      .catch(err => {
        console.log(err);
      });
    } else if (event.target.id === 'approve') {
      this.setState({vSQL: ''});
      this.setState({vQR: {
        headers: [],
        rows: []
      }});
    } else if (event.target.id === 'reject') {
      this.setState({vCS: ''});
      this.setState({vLCE: ''});
      this.setState({vLCR: ''});
      this.setState({vSQL: ''});
      this.setState({vQR: {
        headers: [],
        rows: []
      }});
      this.setState({vCH: []});
    } else if (event.target.id === 'retry') {
      this.setState({vLCR: ''});
      this.setState({vSQL: ''});
      this.setState({vQR: {
        headers: [],
        rows: []
      }});
    } else if (event.target.id === 'start-over') {
      this.setState({vCS: ''});
      this.setState({vLCE: ''});
      this.setState({vLCR: ''});
      this.setState({vSQL: ''});
      this.setState({vQR: {
        headers: [],
        rows: []
      }});
      this.setState({vCH: []});
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Chat Bot</h1>
        </header>
        <div className="App-intro">
          <div className="chat-style-buttons">
            <Button id="tr_reg" onClick={this.handleClick} color="primary" hidden={this.state.vCS !== ''}>T Rusty</Button>{' '}
            <Button id="gm_dot" onClick={this.handleClick} color="primary" hidden={this.state.vCS !== ''}>Grandma Dorothy</Button>{' '}
            <Button id="hh_gary" onClick={this.handleClick} color="primary" hidden={this.state.vCS !== ''}>Hip Hop Gary</Button>{' '}
            <Button id="sd_drew" onClick={this.handleClick} color="primary" hidden={this.state.vCS !== ''}>Surfer Dude Drew</Button>
          </div>
          <div className="chat-history">
            <ul>
              {this.state.vCH.map((item, index) => {
                return <li key={index} className={item.agent === 'You' ? 'user' : 'bot'}>{item.agent}: {item.message}</li>
              })}
            </ul>
          </div>
          <div className="chat-entry">
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Label for="chat-entry">Chat Entry</Label>
                <Input type="text" name="chat-entry" id="chat-entry" value={this.state.vLCE} onChange={this.handleChange} />
              </FormGroup>
              <Button color="primary">Send</Button>
            </Form>
          </div>
          <div className="chat-response">
            <p>{this.state.vLCR}</p>
          </div>
          <div className="view-sql">
            <Button id="view-sql" onClick={this.handleClick} color="primary" hidden={this.state.vSQL === ''}>View SQL</Button>
          </div>
          <div className="sql-text">
            <p>{this.state.vSQL}</p>
          </div>
          <div className="approve-reject-retry">
            <Button id="approve" onClick={this.handleClick} color="primary" hidden={this.state.vSQL === ''}>Approve</Button>{' '}
            <Button id="reject" onClick={this.handleClick} color="primary" hidden={this.state.vSQL === ''}>Reject</Button>{' '}
            <Button id="retry" onClick={this.handleClick} color="primary" hidden={this.state.vSQL === ''}>Retry</Button>
          </div>
          <div className="query-results">
            <Table>
              <thead>
                <tr>
                  {this.state.vQR.headers.map((item, index) => {
                    return <th key={index}>{item}</th>
                  })}
                </tr>
              </thead>
              <tbody>
                {this.state.vQR.rows.map((item, index) => {
                  return <tr key={index}>
                    {item.map((item2, index2) => {
                      return <td key={index2}>{item2}</td>
                    })}
                  </tr>
                })}
              </tbody>
            </Table>
          </div>
          <div className="download-csv">
            <CSVLink data={this.state.vQR.rows} headers={this.state.vQR.headers} filename="query-results.csv" hidden={this.state.vQR.rows.length === 0}>Download CSV</CSVLink>
          </div>
          <div className="start-over">
            <Button id="start-over" onClick={this.handleClick} color="primary" hidden={this.state.vQR.rows.length === 0}>Start Over</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;