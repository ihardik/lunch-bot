// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  const displayName = request.body.originalDetectIntentRequest.payload.event.user.displayName;
  const email = request.body.originalDetectIntentRequest.payload.event.user.email;
  const timeZone = 'America/Los_Angeles';

  function welcome(agent) {
    agent.add(`Hi ${displayName},  Welcome to Lunch bot! Would you like to order lunch?`);
    // let card = new Card();
    // card.setTitle('sample card title');
    // card.setText('This is sample text.');
    // card.setButton({ text: 'button text', url: 'https://assistant.google.com/' });
    let card = new Card({
          title: `Title: this is a card title`,
          imageUrl: 'https://goo.gl/aeDtrS',
          text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
          buttonText: 'This is a button',
          buttonUrl: 'https://assistant.google.com/'
        });
    const message_card =
        {
          "hangouts": {
            "header": {
              "title": "Pizza Bot Customer Support",
              "subtitle": "pizzabot@example.com",
              "imageUrl": "https://goo.gl/aeDtrS",
              "imageStyle": "IMAGE"
            },
            "sections": [
              {
                "widgets": [
                  {
                    "textParagraph": {
                      "text": "Whatever"
                    }
                  }
                ]
              }
            ]
          }
        };
          // {
          //   "header": {
          //     "title": "Pizza Bot Customer Support",
          //     "subtitle": "pizzabot@example.com",
          //     "imageUrl": "https://goo.gl/aeDtrS"
          //   },
          //   "sections": [
          //     {
          //       "widgets": [
          //           {
          //             "keyValue": {
          //               "topLabel": "Order No.",
          //               "content": "12345"
          //               }
          //           },
          //           {
          //             "keyValue": {
          //               "topLabel": "Status",
          //               "content": "In Delivery"
          //             }
          //           }
          //       ]
          //     },
          //     {
          //       "header": "Location",
          //       "widgets": [
          //         {
          //           "image": {
          //             "imageUrl": "https://maps.googleapis.com/..."
          //           }
          //         }
          //       ]
          //     },
          //     {
          //       "widgets": [
          //           {
          //               "buttons": [
          //                 {
          //                   "textButton": {
          //                     "text": "OPEN ORDER",
          //                     "onClick": {
          //                       "openLink": {
          //                         "url": "https://example.com/orders/..."
          //                       }
          //                     }
          //                   }
          //                 }
          //               ]
          //           }
          //       ]
          //     }
          //   ]
          // };
    agent.add(card);
    agent.setContext({ name: 'order', lifespan: 2, parameters: { city: 'Rome' }});
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  // Uncomment and edit to make your own intent handler
  // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // below to get this function to be run when a Dialogflow intent is matched
  function test(agent) {
    console.log(agent.parameters);
    const appointmentTimeString = new Date(agent.parameters.date).toLocaleString(
        'en-US',
        { month: 'long', day: 'numeric', hour: 'numeric', timeZone: timeZone }
    );
    agent.add(`I confirm order of ${agent.parameters.sandwitch} for ${appointmentTimeString}`);
    // agent.add(new Card({
    //     title: `Title: this is a card title`,
    //     imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
    //     text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
    //     buttonText: 'This is a button',
    //     buttonUrl: 'https://assistant.google.com/'
    //   })
    // );
    // agent.add(new Suggestion(`Quick Reply`));
    // agent.add(new Suggestion(`Suggestion`));
    // agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('test', test);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
