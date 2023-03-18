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
// it will receive the user input in an object that contains the following:
//  1. the user input (chat_entry)
//  2. a chat bot style (chat_style)
// there are several main functions that this does:
//  getSemantics - send user input to the openai api to get determine if the user input was a response to a chat bot or a request for data. it should save to the chat_response object under the semantics key
//  getQuery - send the user input to the openai api to get a query that can be used to get data from the database. it should save to the chat_response object under the data key
//  getResponse - send the user input to the openai api to get a chat bot response with a style prepended to the request. it should save to the chat_response object under the bot key
// when the user input is received, it will:
// 1. be sent to the getSemantics function to determine if the user input is a response to a chat bot or a request for data
//  if the user input is a response to a chat bot, it will be sent to the getResponse function to get a chat bot response
//  if the user input is a request for datait will do the following:
//   1. send the user input to the getResponse function to get a chat bot response
//   2. send the user input to the getQuery function to get a query that can be used to get data from the database
// 2. send the chat_response object to the server.js file

const fetch = require('node-fetch');
const openai = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const openai_api_key = process.env.OPENAI_API_KEY;

openai.apiKey = openai_api_key;

const chat_types = [
  {
    name: 'gpt2',
    prompt: 'GPT2: '
  },
  {
    name: 'davinci',
    prompt: 'DaVinci: '
  },
  {
    name: 'babbage',
    prompt: 'Babbage: '
  },
  {
    name: 'curie',
    prompt: 'Curie: '
  },
  {
    name: 'einstein',
    prompt: 'Einstein: '
  },
  {
    name: 'newton',
    prompt: 'Newton: '
  },
  {
    name: 'lovelace',
    prompt: 'Lovelace: '
  }
];

const chat_response = {
  semantics: '',
  bot: '',
  data: ''
};

const getSemantics = async (chat_entry) => {
  const response = await openai.engines.completions({
    engine: 'davinci',
    prompt: chat_entry,
    max_tokens: 1,
    temperature: 0.9,
    top_p: 0.9,
    n: 1,
    stream: false,
    logprobs: null,
    stop: ['\n'],
    presence_penalty: 0.0,
    frequency_penalty: 0.0,
    repetition_penalty: 0.0,
    best_of: 1,
    logprobs: 1,
    stop: ['\n'],
    temperature: [0.9],
    top_p: [0.9]
  });
  chat_response.semantics = response.choices[0].text;
};

const getQuery = async (chat_entry) => {
  const response = await openai.engines.completions({
    engine: 'davinci',
    prompt: chat_entry,
    max_tokens: 1,
    temperature: 0.9,
    top_p: 0.9,
    n: 1,
    stream: false,
    logprobs: null,
    stop: ['\n'],
    presence_penalty: 0.0,
    frequency_penalty: 0.0,
    repetition_penalty: 0.0,
    best_of: 1,
    logprobs: 1,
    stop: ['\n'],
    temperature: [0.9],
    top_p: [0.9]
  });
  chat_response.data = response.choices[0].text;
};

const getResponse = async (chat_entry, chat_style) => {
  const response = await openai.engines.completions({
    engine: 'davinci',
    prompt: chat_types.find(chat_type => chat_type.name === chat_style).prompt + chat_entry,
    max_tokens: 1,
    temperature: 0.9,
    top_p: 0.9,
    n: 1,
    stream: false,
    logprobs: null,
    stop: ['\n'],
    presence_penalty: 0.0,
    frequency_penalty: 0.0,
    repetition_penalty: 0.0,
    best_of: 1,
    logprobs: 1,
    stop: ['\n'],
    temperature: [0.9],
    top_p: [0.9]
  });
  chat_response.bot = response.choices[0].text;
};

const chat = async (user_input) => {
  await getSemantics(user_input.chat_entry);
  if (chat_response.semantics === 'response') {
    await getResponse(user_input.chat_entry, user_input.chat_style);
  } else {
    await getResponse(user_input.chat_entry, user_input.chat_style);
    await getQuery(user_input.chat_entry);
  }
  return chat_response;
};

module.exports = {
  chat
};