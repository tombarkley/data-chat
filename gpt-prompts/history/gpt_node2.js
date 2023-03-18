// this is for a node.js file that is called from the server.js file
// this file leverages the openai api to analyze and respond to user input
// this file will have a following data:
//  chat_types - an array of chat bot styles that will contain objects that contain the following data:
//    1. name - the name of the chat bot style that will correspond to the chat_style in the user input object
//    2. prompt - the prompt that will be prepended to the chat_entry in the user input object to get a response from the openai api
//  chat_response - an object that will be returned to the server.js file and will contain the following data:
//    1. semantics - the response from the openai api that is retrieved in the getSemantics function
//    2. bot - the response from the openai api that is retrieved in the getResponse function
//    3. data - the response from the openai api that is retrieved in the getQuery function
//    4. chat_style - the chat bot style that was used to get the response from the openai api
//    5. chat_prompt - the prompt that was used to get the response from the openai api
//  openai_api_key - the api key for the openai api. this is stored in a .env file at the root of the project
// it will receive the user input in an object that contains the following:
//  1. the user input (chat_entry)
//  2. a chat bot style (chat_style)
// there are several main functions that this does:
//  gptIn - receive the input from the server.js file and route it through steps
//  getSemantics - send user input to the openai api to get determine if the user input was a response to a chat bot or a request for data. it should save to the chat_response object under the semantics key
//  getQuery - send the user input to the openai api to get a query that can be used to get data from the database. it should save to the chat_response object under the data key
//  getResponse - send the user input to the openai api to get a chat bot response with a style (the chat_prompt key in the chat_response object) that matches the chat_style in the user input object. thre openai response should save to the chat_response object under the bot key
// when the user input is received through the gptIn function, it will:
//  1. clear out the values in the chat_response object
//  2. loop through the chat_types array to find the chat bot style that matches the chat_style in the user input object and save that to the chat_prompt key in the chat_response object
//  2. be sent to the getSemantics function to determine if the user input is a response to a chat bot or a request for data
//   2.1 if the user input is a response to a chat bot, it will be sent to the getResponse function to get a chat bot response
//   2.2 if the user input is a request for datait will do the following:
//    2.2.1 send the user input to the getResponse function to get a chat bot response
//    2.2.2 send the user input to the getQuery function to get a query that can be used to get data from the database
//  3. send the chat_response object to the server.js file
// I will define the chat_types variable later in the file, for now it can just be declared as an empty array

const fetch = require('node-fetch');
const openai = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const chat_types = [];
const chat_response = {
  semantics: '',
  bot: '',
  data: '',
  chat_style: '',
  chat_prompt: ''
};
const openai_api_key = process.env.OPENAI_API_KEY;

const gptIn = async (user_input) => {
  chat_response.semantics = '';
  chat_response.bot = '';
  chat_response.data = '';
  chat_response.chat_style = '';
  chat_response.chat_prompt = '';
  for (let i = 0; i < chat_types.length; i++) {
    if (chat_types[i].name === user_input.chat_style) {
      chat_response.chat_prompt = chat_types[i].prompt;
      chat_response.chat_style = user_input.chat_style;
      break;
    }
  }
  const semantics = await getSemantics(user_input.chat_entry);
  if (semantics === 'chat') {
    const response = await getResponse(user_input.chat_entry);
    chat_response.bot = response;
  } else if (semantics === 'data') {
    const response = await getResponse(user_input.chat_entry);
    chat_response.bot = response;
    const query = await getQuery(user_input.chat_entry);
    chat_response.data = query;
  }
  return chat_response;
};

const getSemantics = async (user_input) => {
  const response = await fetch(`https://api.openai.com/v1/engines/davinci/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openai_api_key}`
    },
    body: JSON.stringify({
      'prompt': user_input,
      'max_tokens': 1,
      'temperature': 0.9,
      'top_p': 0.9,
      'n': 1,
      'stream': false,
      'logprobs': null,
      'stop': ['\n']
    })
  });
  const json = await response.json();
  const semantics = json.choices[0].text;
  chat_response.semantics = semantics;
  return semantics;
};

const getQuery = async (user_input) => {
  const response = await fetch(`https://api.openai.com/v1/engines/davinci/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openai_api_key}`
    },
    body: JSON.stringify({
      'prompt': user_input,
      'max_tokens': 50,
      'temperature': 0.9,
      'top_p': 0.9,
      'n': 1,
      'stream': false,
      'logprobs': null,
      'stop': ['\n']
    })
  });
  const json = await response.json();
  const query = json.choices[0].text;
  return query;
};

const getResponse = async (user_input) => {
  const response = await fetch(`https://api.openai.com/v1/engines/davinci/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openai_api_key}`
    },
    body: JSON.stringify({
      'prompt': `${chat_response.chat_prompt} ${user_input}`,
      'max_tokens': 50,
      'temperature': 0.9,
      'top_p': 0.9,
      'n': 1,
      'stream': false,
      'logprobs': null,
      'stop': ['\n']
    })
  });
  const json = await response.json();
  const bot_response = json.choices[0].text;
  return bot_response;
};

module.exports = {
  gptIn
};