const twilio = require('twilio')

const { randomImage, quokkas, notQuokkas } = require('../_data/photos')

module.exports = async function (context) {
    const MessagingResponse = twilio.twiml.MessagingResponse
    const twiml = new MessagingResponse()
    const message = twiml.message()
    const msgParams = new URLSearchParams(context.req.body)
    const msgText = msgParams.get('Body')

    if(RegExp('quokka', 'i').test(msgText)) {
        message.body('This is a quokka')
        message.media(`https://quokkas.amyskapers.dev/img/quokkas/${randomImage(quokkas).slug}`)
    }
    else {
        message.body('This is not a quokka')
        message.media(`https://quokkas.amyskapers.dev/img/not_quokkas/${randomImage(notQuokkas).slug}`)
    }

    context.done(null, {
        status: 200,
        body: message.toString(),
        headers: {
            'Content-Type': 'text/xml'
        },
    })
};