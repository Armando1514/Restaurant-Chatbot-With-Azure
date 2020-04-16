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

class OrderPizzaDialog extends CancelAndHelpDialog {
    constructor(id) {
        super(id || 'OrderPizzaDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new DateResolverDialog(DATE_RESOLVER_DIALOG))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.OrderDateStep.bind(this),
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
    async OrderDateStep(stepContext) {
        const orderDetails = stepContext.options;

       
        if (!orderDetails.date || this.isAmbiguous(orderDetails.date)) {
            return await stepContext.beginDialog(DATE_RESOLVER_DIALOG, { date: orderDetails.date });
        }
        return await stepContext.next(orderDetails.date);
    }

    //number step
    async numberStep(stepContext) {
        console.log('number step in OrderPizza.');

        const orderDetails = stepContext.options;

        // Capture the response to the previous step's prompt
        orderDetails.date = stepContext.result;

        if (!orderDetails.number) {
            const messageText = 'What is your phone number?';
            const msg = MessageFactory.text(messageText, 'What is your phone number?', InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }
        return await stepContext.next(orderDetails.number);
    }

    /**
     * Confirm the information the user has provided.
     */
    async confirmStep(stepContext) {
        const orderDetails = stepContext.options;

        // Capture the results of the previous step
        orderDetails.number = stepContext.result;
        const messageText = `Please confirm, Your order message is: "${orderDetails.text}".
                             You would like to receive the order for: ${ orderDetails.date}.
                             Your number is: ${orderDetails.number}. Is this correct?`;

        const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);

        // Offer a YES/NO prompt.
        return await stepContext.prompt(CONFIRM_PROMPT, { prompt: msg });
    }

    /**
     * Complete the interaction and end the dialog.
     */
    async finalStep(stepContext) {
        if (stepContext.result === true) {
            const orderDetails = stepContext.options;
            return await stepContext.endDialog(orderDetails);
        }
        return await stepContext.endDialog();
    }

    isAmbiguous(timex) {
        const timexPropery = new TimexProperty(timex);
        return !timexPropery.types.has('definite');
    }
}

module.exports.OrderPizzaDialog = OrderPizzaDialog;
