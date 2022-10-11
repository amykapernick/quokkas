require('dotenv').config()

const twilio = require('twilio')

module.exports = async function (context) {
    const MessagingResponse = twilio.twiml.MessagingResponse
    const twiml = new MessagingResponse()
    const message = twiml.message()

    message.body("Welcome to Quokkabot")

    context.done(null, {
        status: 200,
        body: message.toString(),
        headers: {
            'Content-Type': 'text/xml'
        },
    })
};