// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { InputHints, MessageFactory } = require('botbuilder');
const { ConfirmPrompt, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');
const { DateResolverDialog } = require('./dateResolverDialog');

const CONFIRM_PROMPT = 'confirmPrompt';
const DATE_RESOLVER_DIALOG = 'dateResolverDialog';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class BookingPlaceDialog extends CancelAndHelpDialog {
    constructor(id) {
        super(id || 'BookingPlaceDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new DateResolverDialog(DATE_RESOLVER_DIALOG))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.BookingDateStep.bind(this),
                this.nameStep.bind(this),
                this.numberOfPeopleStep.bind(this),
                this.numberStep.bind(this),
                this.confirmStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

   
    /**
     * If a travel date has not been provided, prompt for one.
     * This will use the DATE_RESOLVER_DIALOG.
     */
    async BookingDateStep(stepContext) {

        console.log('date step in bookingPlace.');

        const bookingPlaceDetails = stepContext.options;

        // Capture the results of the previous step
        if (!bookingPlaceDetails.date || this.isAmbiguous(bookingPlaceDetails.date)) {
            return await stepContext.beginDialog(DATE_RESOLVER_DIALOG, { date: bookingPlaceDetails.date });
        }
        return await stepContext.next(bookingPlaceDetails.date);
    }

    //name step
    async nameStep(stepContext) {
        console.log('name step in bookingPlace.');

        const bookingPlaceDetails = stepContext.options;

        // Capture the response to the previous step's prompt
        bookingPlaceDetails.date = stepContext.result;

        if (!bookingPlaceDetails.name) {
            const messageText = 'What is your name?';
            const msg = MessageFactory.text(messageText, 'What is your name?', InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }

        return await stepContext.next(bookingPlaceDetails.name);
    }

    //number of people step
    async numberOfPeopleStep(stepContext) {
        console.log('people number in bookingPlace.');

        const bookingPlaceDetails = stepContext.options;

        // Capture the response to the previous step's prompt
        bookingPlaceDetails.name = stepContext.result;

        if (!bookingPlaceDetails.numberOfPeople ) {
            const messageText = 'how many people are there?';
            const msg = MessageFactory.text(messageText, 'how many people are there?', InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }

        return await stepContext.next(bookingPlaceDetails.numberOfPeople);
    }


    //number step
    async numberStep(stepContext) {
        console.log('number step in bookingPlace.');

        const bookingPlaceDetails = stepContext.options;

        // Capture the response to the previous step's prompt
        bookingPlaceDetails.numberOfPeople = stepContext.result;

        if (!bookingPlaceDetails.number ) {
            const messageText = 'What is your phone number?';
            const msg = MessageFactory.text(messageText, 'What is your phone number?', InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }
        return await stepContext.next(bookingPlaceDetails.number);
    }


    /**
     * Confirm the information the user has provided.
     */
    async confirmStep(stepContext) {
        console.log('confirm step in bookingPlace.');

        const bookingPlaceDetails = stepContext.options;

        // Capture the results of the previous step
        bookingPlaceDetails.number = stepContext.result;
        const messageText = `Please confirm, You want  reserve a table on: ${bookingPlaceDetails.date}, for: ${bookingPlaceDetails.numberOfPeople}.  Your name is: ${bookingPlaceDetails.name}, and your phone: ${bookingPlaceDetails.number }  Is this correct?`;
        const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);

        // Offer a YES/NO prompt.
        return await stepContext.prompt(CONFIRM_PROMPT, { prompt: msg });
    }

    /**
     * Complete the interaction and end the dialog.
     */
    async finalStep(stepContext) {
        console.log('final step in bookingPlace.');

        if (stepContext.result === true) {
            const bookingPlaceDetails = stepContext.options;
            return await stepContext.endDialog(bookingPlaceDetails);
        }
        return await stepContext.endDialog();
    }

    isAmbiguous(timex) {
        const timexPropery = new TimexProperty(timex);
        return !timexPropery.types.has('definite');
    }
}

module.exports.BookingPlaceDialog = BookingPlaceDialog;
