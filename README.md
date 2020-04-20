# Restaurant Chatbot With Azure


<p align="center">
  <img src="http://ferrara.link/img/restaurantChatbotWithAzure/logo.png" width="130" height="161" >
</p>

## Description

Chatbot named "Armando's pizza" that simulates a cashier in a pizzeria, you can ask about the menù, reserve a table, inquire about the ingredients, order a pizza and normally converse with it. 
You can also ask things like age, what it does in life, in short, converse as if it were a person.

This bot has been created using [Bot Framework](https://dev.botframework.com) that:

- Use [LUIS](https://www.luis.ai) to implement core AI capabilities
- Implement a multi-turn conversation using [Dialogs](https://docs.microsoft.com/it-it/azure/bot-service/bot-builder-concept-dialog?view=azure-bot-service-4.0)
- Handle user interruptions for such things as `Help` or `Cancel`
- Prompt for and validate requests for information from the user
- Handle any unexpected errors
- Use [QnA Maker Service](https://www.qnamaker.ai)  service to answer questions based on a FAQ text file used as input. 

## Demo video

[![video button](http://ferrara.link/img/cbisdataintegration/videopresentation.jpg)](http://ferrara.link/img/restaurantChatbotWithAzure/chatbotVIDEO.mp4)


## Prerequisites
- Azure account
- [Node.js](https://nodejs.org) version 10.14 or higher
- QnA knowledge base setup and application configuration steps can be found [here](https://aka.ms/qna-instructions).
- Luis setup and application configuration steps can be found [here](https://www.luis.ai/home)

**Note**: for Qna and Luis services, you need only to import the file that are in the folder called "cognitiveModels". And remember to edit/ create the ".env" file in the root with your keys and parameters if you want test your bot in local.

# To run the bot locally
- Download the bot code from the Build blade in the Azure Portal (make sure you click "Yes" when asked "Include app settings in the downloaded zip file?"). Copy the .env file from the downloaded folder to this project's folder.

- Install modules
    ```bash
    npm install
    ```
- Run the bot
    ```bash
    npm start
    ```

# Testing the bot using Bot Framework Emulator
[Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the Bot Framework Emulator version 4.5.2 or greater from [here](https://github.com/Microsoft/BotFramework-Emulator/releases)

## Connect to the bot using Bot Framework Emulator
- Launch Bot Framework Emulator
- File -> Open Bot
- Enter a Bot URL of `http://localhost:3978/api/messages`

# Deploy the bot to Azure
After creating the bot and testing it locally, you can deploy it to Azure to make it accessible from anywhere.
To learn how, you must understand some basic concept:

- [Deploy your bot to Azure](https://aka.ms/azuredeployment)

- [Bot Framework Documentation](https://docs.botframework.com)

- [Bot Basics](https://docs.microsoft.com/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0)

- [Azure Bot Service Introduction](https://docs.microsoft.com/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0)

- [Azure Bot Service Documentation](https://docs.microsoft.com/azure/bot-service/?view=azure-bot-service-4.0)

- [Azure Portal](https://portal.azure.com)

- [Activity processing](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-activity-processing?view=azure-bot-service-4.0)

- [Dialogs](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-dialog?view=azure-bot-service-4.0)

- [Gathering Input Using Prompts](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-prompts?view=azure-bot-service-4.0&tabs=csharp)

- [Language Understanding using LUIS](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/)

- [QnA Maker Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/overview/overview )

- [Active learning Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/how-to/improve-knowledge-base)

- [Activity Processing](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-activity-processing?view=azure-bot-service-4.0)

- [Channels and Bot Connector Service](https://docs.microsoft.com/en-us/azure/bot-service/bot-concepts?view=azure-bot-service-4.0)

  
