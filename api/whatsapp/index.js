require('dotenv').config()

const quokkaTest = require('../quokka-test').customVision,
quokkaBot = require('../quokkabot').message

const whatsappReply = (outcome) => {
    let message,
    quokka = `${(outcome.quokka * 100).toFixed(2)}%`,
    notQuokka = `${(outcome.negative * 100).toFixed(2)}%`

    if(outcome.quokka > outcome.negative) {
        message = `Yep, that looks like a quokka!
            \nQuokka: ${quokka}, Not Quokka: ${notQuokka}`
    }
    else {
        message = `Sorry, doesn't look like that's a quokka 😢
            \nQuokka: ${quokka}, Not Quokka: ${notQuokka}`
    }

    return message
}

module.exports = async function (context, req) {
    const qs = require('querystring'),
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    client = require('twilio')(
        process.env.TWILIO_API_KEY,
        process.env.TWILIO_API_SECRET,
        {accountSid: process.env.ACCOUNT_SID}
    ),
    twiml = new MessagingResponse(),
    message = twiml.message(),
    body = qs.parse(context.req.body),
    text = body.Body,
    image = body.NumMedia && body.MediaUrl0,
    service = client.sync.services(process.env.TWILIO_SYNC_SERVICE_SID)

    if(image) {
        const results = await quokkaTest(image),
        reply = whatsappReply(results)

        message.body(reply)

        service.syncLists('pastResults').syncListItems.create({
            data: {
                image: image,
                results: results
            }
        }).catch(console.error)
    }
    else {
        const results = quokkaBot(text)

        message.body(results.body)
        message.media(results.media)

        if(results.error) {
            client.messages.create({
                from: 'whatsapp:+61488845130',
                body: `A new error has been lodged ⚠\n${text}`,
                to: `whatsapp:${process.env.MOBILE}`
            })
        }

        service.documents('image').update({
            data: {
                image: results.media
            }
        }).catch(console.error)
    
    }


    context.done(null, {
        status: 200,
        body: message.toString(),
        headers: {
            'Content-Type': 'text/xml'
        },
    })
};