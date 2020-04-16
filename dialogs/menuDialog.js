// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { CardFactory, MessageFactory, InputHints} = require('botbuilder');
const { TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');
const WelcomeCard = require('../cards/menuCard.json');


const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class MenuDialog extends CancelAndHelpDialog{
    constructor(id) {
        super(id || 'menuDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.showMenuStep.bind(this);
           

        this.initialDialogId = TEXT_PROMPT;
    }

    /**
     * If a destination city has not been provided, prompt for one.
     */
    async showMenuStep(stepContext) {
        console.log('show Menu');

        const menuDetail = stepContext.context.Text;

          
        const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
        return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        console.log(stepcontext.result);

    }

   

    /**
     * Complete the interaction and end the dialog.
     */
    async showIngredientsStep(stepContext) {
        console.log('ingredients ' + stepContext.TextPrompt);

            const bookingDetails = stepContext.options;
            return await stepContext.endDialog(bookingDetails);
        
        return await stepContext.endDialog();
    }

    isAmbiguous(timex) {
        const timexPropery = new TimexProperty(timex);
        return !timexPropery.types.has('definite');
    }
}

module.exports.MenuDialog = MenuDialog;
