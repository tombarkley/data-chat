<!-- 
create the text for a github README.md file for a react and node app that creates a chat bot to handle data queries
 details:
  - react app that uses the OpenAI API to do the following:
    - displays a chat experience to ask data questions
    - gives the option of multiple different bots with different personalities to interact with
    - sends chat entries to the node app
    - displays the chatbot response to the user
    - diplays the data response to the user when applicable
  - node app that does the following:
    - using the OpenAI API define an entry from the user semantically as to whether it is a chat or data request
    - if it is a chat request, send it to the OpenAI API and return the response
    - if it is a data request, do the following:
      - send the message to the openai api to get a placeholder response for the chatbot
      - send the message to the openai api to generate a sql query
      - send the sql query to a sql server
      - send the sql server response to the front end to display the data to the user
 methodolgy:
  - create a react app
  - create a node app
  - use the OpenAI playground to generate react and node code to complete the tasks in the details section
 purpose:
  - to learn how to use the OpenAI API
  - to learn how to use the OpenAI playground
  - to learn how to use the OpenAI API to create a chatbot
  - to learn how to use the OpenAI API to create a data query
  - to demonstrate how chaining the functionality of the OpenAI API can enable a platform to complete complex tasks in a generative way
  - to show the speed that the OpenAI API can be used to create a platform
 requirements:
  - text should be formatted for a README.md file for a github repo 
  - no installation instructions are needed
 additional considerations:
  - this is a proof of concept that was meant to be done quickly and not intended to evolve into a production ready application
  - this project does require a subscription to the OpenAI API
-->

# Creation of a GPT enabled data query bot

This project was created to explore and demonstrate the ability of the OpenAI gpt api to create a bot that could both chat with the user and also return data queries back.

## Initial build

For the initial build I relied in large part on the code-davinci models of GPT-3.  These allowed me to put my requirements in text and generate code based on that for a react front end and node back end.  My prompts along with some iteration history are stored in the gpt-prompts folder of this repository.

This generative approach even extended to the writing of this readme document (the initial prompts I used can be seen in the commentary at the top of this document when viewed as a raw file).

All of the code generated needed to be edited manually but the generative approach allowed the majority of the development time to be cut out.

## Front end

The front end is a react app that allows the user to interact with the bot.  It has a chat window that displays the chat history and a text box for the user to enter their text.  The user can also select from different bots to interact with.  The front end sends the text entered by the user to the back end and displays the response from the back end in the chat window.

## Back end

The back end is a node app that uses the OpenAI API to do the following:
- determine if the text entered by the user is a chat or data request
- if it is a chat request, send it to OpenAI and return the response
- if it is a data request, do the following:
  - send the message to openai api to get a placeholder response for the chatbot
  - send the message to openai api to generate a sql query
  - send the sql query to a sql server
  - send the sql server response to front end to display data to user

## Additional considerations

This is a proof of concept that was meant to be done quickly and not intended to evolve into a production ready application.  
This project does require a subscription to the OpenAI API.