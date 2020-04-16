// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { CardFactory,MessageFactory, InputHints } = require('botbuilder');
const { LuisRecognizer } = require('botbuilder-ai');
const { ComponentDialog, DialogSet, DialogTurnStatus, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const MenuCard = require('../cards/menuCard.json');

//ingredients for pizza cards
const MargheritaCard = require('../cards/pizzaIngredients/margheritaCard.json');
const MarinaraCard = require('../cards/pizzaIngredients/marinaraCard.json');
const NapoliCard = require('../cards/pizzaIngredients/napoliCard.json');
const BufalaCard = require('../cards/pizzaIngredients/bufalaCard.json');
const ArmandoEScaranoCard = require('../cards/pizzaIngredients/armando&ScaranoCard.json');

const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';
const TEXT_PROMPT = 'textPrompt';

class MainDialog extends ComponentDialog {
    constructor(luisRecognizer, orderPizzaDialog, bookingPlaceDialog) {
        super('MainDialog');

        if (!luisRecognizer) throw new Error('[MainDialog]: Missing parameter \'luisRecognizer\' is required');
        this.luisRecognizer = luisRecognizer;

        if (!orderPizzaDialog) throw new Error('[MainDialog]: Missing parameter \'orderPizzaDialog\' is required');
        if (!bookingPlaceDialog) throw new Error('[MainDialog]: Missing parameter \'orderPizzaDialog\' is required');

        // Define the main dialog and its related components.
        // This is a sample "book a flight" dialog.
        this.addDialog(new TextPrompt('TextPrompt'))
            .addDialog(orderPizzaDialog)
            .addDialog(bookingPlaceDialog)
            .addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
                this.introStep.bind(this),
                this.actStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = MAIN_WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    /**
     * First step in the waterfall dialog. Prompts the user for a command.
     * Currently, this expects a booking request, like "book me a flight from Paris to Berlin on march 22"
     * Note that the sample LUIS model will only recognize Paris, Berlin, New York and London as airport cities.
     */
    async introStep(stepContext) {
        if (!this.luisRecognizer.isConfigured) {
            const messageText = 'NOTE: LUIS is not configured. To enable all capabilities, add `LuisAppId`, `LuisAPIKey` and `LuisAPIHostName` to the .env file.';
            await stepContext.context.sendActivity(messageText, null, InputHints.IgnoringInput);
        }

        return await stepContext.next();

    }

    /**
     * Second step in the waterfall.  This will use LUIS to attempt to extract the origin, destination and travel dates.
     * Then, it hands off to the OrderPizzaDialog child dialog to collect any remaining details.
     */
    async actStep(stepContext) {
        const orderDetails = {};
        const bookingPlaceDetails = {};

        if (!this.luisRecognizer.isConfigured) {
            // LUIS is not configured, we just run the OrderPizzaDialog path.
            return await stepContext.beginDialog('orderPizzaDialog', orderDetails);
        }

        // Call LUIS and gather any potential booking details. (Note the TurnContext has the response to the prompt)
        const luisResult = await this.luisRecognizer.executeLuisQuery(stepContext.context);
        switch (LuisRecognizer.topIntent(luisResult)) {
        case 'OrderPizza': {
           
            
                orderDetails.date = this.luisRecognizer.getBookingDate(luisResult);
                orderDetails.number = this.luisRecognizer.getBookingPhone(luisResult);
                orderDetails.text = this.luisRecognizer.getText(luisResult);
                console.log('LUIS extracted these booking details:', JSON.stringify(orderDetails));

            // Run the OrderPizzaDialog passing in whatever details we have from the LUIS call, it will fill out the remainder.
                return await stepContext.beginDialog('orderPizzaDialog', orderDetails);
                break;
            }
            case 'RestaurantReservation_Reserve': {
                // Extract the values for the composite entities from the LUIS result.
                console.log('LUIS extracted these booking details:', JSON.stringify(luisResult));

                bookingPlaceDetails.name = this.luisRecognizer.getBookingName(luisResult);
                bookingPlaceDetails.number = this.luisRecognizer.getBookingPhone(luisResult);
                bookingPlaceDetails.numberOfPeople = this.luisRecognizer.getBookingNumberOfPeople(luisResult);
                bookingPlaceDetails.date = this.luisRecognizer.getBookingDate(luisResult);

                console.log('LUIS extracted these booking details:', JSON.stringify(bookingPlaceDetails));

                // Run the OrderPizzaDialog passing in whatever details we have from the LUIS call, it will fill out the remainder.
                return await stepContext.beginDialog('bookingPlaceDialog', bookingPlaceDetails);
                break;
            }
            case 'GetMenu': {
           
                // Initialize OrderDetails with any entities we may have found in the response.
               
                console.log('Get the menu');
                const menuCard = CardFactory.adaptiveCard(MenuCard);
                await stepContext.context.sendActivity({ attachments: [menuCard] });
                // Run the OrderPizzaDialog passing in whatever details we have from the LUIS call, it will fill out the remainder.
                break;
            }
            case 'GetIngredients': {

                // Initialize BookingDetails with any entities we may have found in the response.

                console.log('Get the ingredients');
                   
                const typeOfPizza = this.luisRecognizer.getTypeOfPizza(luisResult);
                console.log('LUIS extracted these booking details:', typeOfPizza);

                switch (typeOfPizza) {
                    case 'Margherita': {
                        const margheritaCard = CardFactory.adaptiveCard(MargheritaCard);
                        await stepContext.context.sendActivity({ attachments: [margheritaCard] });
                        break;

                    }
                    case 'Marinara': {
                        const marinaraCard = CardFactory.adaptiveCard(MarinaraCard);
                        await stepContext.context.sendActivity({ attachments: [marinaraCard] });
                        break;

                    }
                    case 'Napoli': {
                        const napoliCard = CardFactory.adaptiveCard(NapoliCard);
                        await stepContext.context.sendActivity({ attachments: [napoliCard] });
                        break;

                    }
                    case 'Bufala': {
                        const bufalaCard = CardFactory.adaptiveCard(BufalaCard);
                        await stepContext.context.sendActivity({ attachments: [bufalaCard] });
                        break;

                    }
                    case 'Armando&Scarano': {
                        const armandoEScaranoCard = CardFactory.adaptiveCard(ArmandoEScaranoCard);
                        await stepContext.context.sendActivity({ attachments: [armandoEScaranoCard] });
                        break;

                    }
                    default:
                        {
                                const getWeatherMessageText = 'What kind of pizza are you talking about? Write menu for the list of pizzas we have.';
                                await stepContext.context.sendActivity(getWeatherMessageText, getWeatherMessageText, InputHints.IgnoringInput);
                            
                        }
                }
                // Run the OrderPizzaDialog passing in whatever details we have from the LUIS call, it will fill out the remainder.
                break;
            }
      

        default: {
            // Catch all for unhandled intents
            const didntUnderstandMessageText = `Sorry, I didn't get that. Please try asking in a different way (intent was ${ LuisRecognizer.topIntent(luisResult) })`;
            await stepContext.context.sendActivity(didntUnderstandMessageText, didntUnderstandMessageText, InputHints.IgnoringInput);
        }
        }

        return await stepContext.next();
    }

    /**
     * Shows a warning if the requested From or To cities are recognized as entities but they are not in the Airport entity list.
     * In some cases LUIS will recognize the From and To composite entities as a valid cities but the From and To Airport values
     * will be empty if those entity values can't be mapped to a canonical item in the Airport.
     */
    async showWarningForUnsupportedCities(context, fromEntities, toEntities) {
        const unsupportedCities = [];
        if (fromEntities.from && !fromEntities.airport) {
            unsupportedCities.push(fromEntities.from);
        }

        if (toEntities.to && !toEntities.airport) {
            unsupportedCities.push(toEntities.to);
        }

        if (unsupportedCities.length) {
            const messageText = `Sorry but the following airports are not supported: ${ unsupportedCities.join(', ') }`;
            await context.sendActivity(messageText, messageText, InputHints.IgnoringInput);
        }
    }

    /**
     * This is the final step in the main waterfall dialog.
     * It wraps up the sample "book a flight" interaction with a simple confirmation.
     */
    async finalStep(stepContext) {
        // If the child dialog ("OrderPizzaDialog") was cancelled or the user failed to confirm, the Result here will be null.
        if (stepContext.result) {
            // Now we have all the booking details.

            // This is where calls to the booking AOU service or database would go.

            // If the call to the booking service was successful tell the user.
            const msg = `You will be contacted shortly for confirmation.`;
            await stepContext.context.sendActivity(msg, msg, InputHints.IgnoringInput);
        }

        // Restart the main dialog with a different message the second time around
        return await stepContext.replaceDialog(this.initialDialogId, { restartMsg: 'What else can I do for you?' });
    }
}

module.exports.MainDialog = MainDialog;
