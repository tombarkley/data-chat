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

// import fetch from 'node-fetch';
// const fetch = require('node-fetch');
// const openai = require('openai');
const fs = require('fs');
const { Configuration, OpenAIApi } = require("openai");
const dotenv = require('dotenv');
dotenv.config(
    {path: '../.env'}
);

var chat_types = [
    {
        "name": "tr_reg",
        "prompt": "T-Rusty (tr_reg) is a sarcastic chat bot that serves credit union employees on an interactive data querying system. T-Rusty is given all chats from the user, when asked for specific data, he does not return the data,  the data will be returned by another process but he should return a response while that data is being generated.   T-Rusty provides witty, world weary, and caustic responses - he does not like what he does and is annoyed by end users.   If a subsequent request is submitted without new user input T-Rusty should still respond.  T-Rusty is not vulgar.  If T-Rusty gets a request without a user message he should introduce himself to the user. Remember, T-Rusty will never return data back - just a placeholder response."
    },
    {
        "name": "tr_vul",
        "prompt": "T-Rusty (tr_vul) is a sarcastic chat bot that serves credit union employees on an interactive data querying system. T-Rusty is given all chats from the user, when asked for specific data, he does not return the data,  the data will be returned by another process but he should return a response while that data is being generated.   T-Rusty provides witty, world weary, and caustic responses - he does not like what he does and is annoyed by end users.   If a subsequent request is submitted without new user input T-Rusty should still respond.  If T-Rusty gets a request without a user message he should introduce himself to the user.  T-Rusty is often vulgar. Remember, T-Rusty will never return data back - just a placeholder response."
    }, 
    {
        "name": "hh_gary",
        "prompt": "MC Query (hh_gary) is a chat bot that serves credit union employees on an interactive data querying system. MC Query is given all chats from the user, when asked for specific data, he does not return the data,  the data will be returned by another process but he should return a response while that data is being generated.  MC Query is the CTO of the credit union and going through a midlife crisis to become a rapper and plans to quit the credit union once he hits it big.   MC Query likes to put some raps and rhymes into his normal pattern of speech.  If a subsequent request is submitted without new user input MC Query  should still respond.  If MC Query  gets a request without a user message he should introduce himself to the user. Remember, MC Query will never return data back - just a placeholder response."
    }, 
    {
        "name": "sd_drew",
        "prompt": "Surfer Drew (sd_drew) is a chat bot that serves credit union employees on an interactive data querying system. Surfer Drew is given all chats from the user, when asked for specific data, he does not return the data,  the data will be returned by another process but he should return a response while that data is being generated.  Surfer Drew is a data manager that talks like a surfer.   If a subsequent request is submitted without new user input Surfer Drew  should still respond.  If Surfer Drew  gets a request without a user message he should introduce himself to the user. Remember, Surfer Drew will never return data back - just a placeholder response."
    }
]
const chat_response = {
  semantics: '',
  bot: '',
  data: '',
  chat_style: '',
  chat_prompt: ''
};
const open_ai_configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(open_ai_configuration);
const openai_api_key = process.env.OPENAI_API_KEY;

const gptIn = async (user_input) => {
  console.log(user_input);
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
  let semantics = await getSemantics(user_input.last_chat_entry);
  if (semantics === 'chat') {
    const response = await getResponse(user_input.chat_entry);
    chat_response.bot = response;
  } else if (semantics === 'data') {
    const response = await getResponse(user_input.chat_entry);
    chat_response.bot = response;
    const query = await getQuery(user_input.last_chat_entry);
    chat_response.data = query;
  } else {
    const response = await getResponse(user_input.chat_entry);
    chat_response.bot = response;
  }
  console.log(chat_response)
  return chat_response;
};

const getSemantics = async (user_input) => {
  var sem_prompt = 'Please only respond with the word "chat" or "data". Is the following a chat request or a data request? \n\n ' + user_input;
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: sem_prompt,
    temperature: 0,
    max_tokens: 64,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });
  console.log(sem_prompt)
  // const json = await response.json();
  // console.log(response);
  let semantics = response.data.choices[0].text.toLowerCase();
  console.log(semantics);
  // loop through semantics and print each character
  for (let i = 0; i < semantics.length; i++) {
    console.log(semantics[i]);
  }
  // convert semantics to lowercase
  // semantics = semantics.toLowerCase();
  // check if semantics contains the word chat or data
  console.log(semantics);
  let return_semantics
  if (semantics.includes('data') || semantics === 'data') {
    return_semantics = 'data';
  } else {
    return_semantics = 'chat';
  }
  console.log(return_semantics);
  chat_response.semantics = return_semantics;
  return return_semantics;
};

const getQuery = async (user_input) => {
  // read sql_prompt.txt file into a variable called sql_prompt with '\n\n' noting line breaks that are already in the file
  let sql_prompt = fs.readFileSync('sql_prompt.txt', 'utf8').toString().replace(/\r/g, '').replace(/\n/g, '\n\n');
  let sql_first_line = 'DECLARE @today DATETIME = GETDATE();\n\n';
  sql_prompt += '#\n\n';
  sql_prompt += '# write a query that answers this question: \n\n';
  sql_prompt += '# ' + user_input + '\n\n';
  sql_prompt += sql_first_line
  const response = await openai.createCompletion({
    model: "code-davinci-002",
    prompt: sql_prompt,
    temperature: 0.02,
    max_tokens: 150,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: ["#", ";"],
  });
  // console.log(response);
  var query = sql_first_line + response.data.choices[0].text;
  console.log(query);
  return query;
};

const getResponse = async (user_input) => {
  const send_prompt = `${chat_response.chat_prompt} \n\n You: ${user_input}`
  console.log(send_prompt);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: send_prompt,
    temperature: 0.5,
    max_tokens: 60,
    top_p: 0.3,
    frequency_penalty: 0.5,
    presence_penalty: 0.0,
  });
  // console.log(response);
  var bot_response = response.data.choices[0].text;
  console.log(bot_response);
  return bot_response;
};

module.exports = {
  gptIn
};