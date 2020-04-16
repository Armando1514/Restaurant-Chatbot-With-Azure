// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { LuisRecognizer } = require('botbuilder-ai');

class FlightBookingRecognizer {
    constructor(config) {
        const luisIsConfigured = config && config.applicationId && config.endpointKey && config.endpoint;
        if (luisIsConfigured) {
            this.recognizer = new LuisRecognizer(config, {}, true);
        }
    }

    get isConfigured() {
        return (this.recognizer !== undefined);
    }

    /**
     * Returns an object with preformatted LUIS results for the bot's dialogs to consume.
     * @param {TurnContext} context
     */
    async executeLuisQuery(context) {
        return await this.recognizer.recognize(context);
    }

    getText(result) {
        return result.text;
    }

    getTypeOfPizza(result) {
        let TypePizzaValue;
        if (result.entities.Pizza) {
            TypePizzaValue = result.entities.Pizza[0][0];

        }
      
        return TypePizzaValue;
    }
    getBookingName(result) {
        let personNameValue;
        if (result.entities.personName) {
            personNameValue = result.entities.personName[0];

        }

        return personNameValue;
    }

    getBookingPhone(result) {
        let phoneValue;
        if (result.entities.phonenumber) {
            phoneValue = result.entities.phonenumber[0];

        }

        return phoneValue;
    }
    getBookingNumberOfPeople(result) {
       let numberOfPeopleValue = result.entities.$instance.RestaurantReservation_NumberPeople;

        if (numberOfPeopleValue) {
            numberOfPeopleValue = numberOfPeopleValue[0].text;

        }

        return numberOfPeopleValue;
    }
    getFromEntities(result) {
        let fromValue, fromAirportValue;
        if (result.entities.$instance.From) {
            fromValue = result.entities.$instance.From[0].text;
        }
        if (fromValue && result.entities.From[0].Airport) {
            fromAirportValue = result.entities.From[0].Airport[0][0];
        }

        return { from: fromValue, airport: fromAirportValue };
    }

    getToEntities(result) {
        let toValue, toAirportValue;
        if (result.entities.$instance.To) {
            toValue = result.entities.$instance.To[0].text;
        }
        if (toValue && result.entities.To[0].Airport) {
            toAirportValue = result.entities.To[0].Airport[0][0];
        }

        return { to: toValue, airport: toAirportValue };
    }

    /**
     * This value will be a TIMEX. And we are only interested in a Date so grab the first result and drop the Time part.
     * TIMEX is a format that represents DateTime expressions that include some ambiguity. e.g. missing a Year.
     */
    getBookingDate(result) {
        let entites = result.luisResult.entities;
        console.log(entites.length + "number");

        for (let index = 0; index < entites.length; index++) {
            console.log(entites[index].type + "type");

            if (entites[index].type == 'builtin.datetimeV2.date' || entites[index].type == 'builtin.datetimeV2.datetime') {
                const datetimeEntity = result.luisResult.entities[index].resolution.values;
                console.log(datetimeEntity.length - 1 + "comsdspare")

                return datetimeEntity[datetimeEntity.length-1].value;
            }
        }

        return undefined;

    }
        
    
    getTravelDate(result) {
        const datetimeEntity = result.entities.datetime;
        if (!datetimeEntity || !datetimeEntity[0]) return undefined;

        const timex = datetimeEntity[0].timex;
        if (!timex || !timex[0]) return undefined;

        const datetime = timex[0].split('T')[0];
        return datetime;
    }
}

module.exports.FlightBookingRecognizer = FlightBookingRecognizer;
