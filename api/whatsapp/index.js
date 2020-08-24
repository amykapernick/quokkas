require('dotenv').config()

const quokkaTest = require('../quokka-test'),
customVision = quokkaTest.customVision,
quokkaBot = require('../quokkabot')

const whatsappReply = (outcome) => {
    let message,
    photo = Math.floor(Math.random() * 12),
    quokka = `${(outcome[1] * 100).toFixed(2)}%`,
        notQuokka = `${(outcome[0] * 100).toFixed(2)}%`
        
    if (outcome[0] > outcome[1]) {
        message = `Sorry, doesn't look like that's a quokka 😢
        \nQuokka: ${quokka}, Not Quokka: ${notQuokka}
        \nThat's pretty sad though, so here's a quokka`
    } else {
        message = `Yep, that looks like a quokka!
        \nQuokka: ${quokka}, Not Quokka: ${notQuokka}`
    }

    return {message: message, photo: photo}
}


module.exports = async function (context) {
    const qs = require('querystring'),
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    twiml = new MessagingResponse(),
    message = twiml.message(),
    body = qs.parse(context.req.body),
    text = body.Body,
    image = body.NumMedia && body.MediaUrl0

    if(image) {
        const results = await customVision(image),
        reply = whatsappReply(results)
        
        message.body(reply.message)

        if(reply.photo) {
            message.media(`https://quokkas.amyskapers.dev/img/quokka_(${reply.photo}).jpg`)
        }
    }
    else {
        const results = quokkaBot.message(text)

        message.body(results.body)
        message.media(results.media)
    }

    context.done(null, {
        status: 200,
        body: message.toString(),
        headers: {
            'Content-Type': 'text/xml'
        },
    })
};