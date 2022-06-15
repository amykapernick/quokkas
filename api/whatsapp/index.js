require('dotenv').config()

const twilio = require('twilio')
const { customVision } = require('../utils/quokkaTest')
const { message: quokkaBot } = require('../utils/quokkabot')
const { quokkas, randomImage } = require('../_data/photos')

const whatsappReply = (outcome) => {
    const photo = randomImage(quokkas)

    let message,
        quokka = `${(outcome[1] * 100).toFixed(2)}%`,
        notQuokka = `${(outcome[0] * 100).toFixed(2)}%`

    if (outcome[0] > outcome[1]) {
        message = `Sorry, doesn't look like that's a quokka 😢\nQuokka: ${quokka}, Not Quokka: ${notQuokka}\nThat's pretty sad though, so here's a quokka`
    } else {
        message = `Yep, that looks like a quokka!\nQuokka: ${quokka}, Not Quokka: ${notQuokka}`
    }

    if (photo?.message) {
        message = `${message} (${photo.message})`
    }

    return { message: message, photo: photo?.slug }
}


module.exports = async function (context) {
    const qs = require('querystring')
    const MessagingResponse = twilio.twiml.MessagingResponse
    const client = twilio(
        process.env.TWILIO_API_KEY,
        process.env.TWILIO_API_SECRET,
        {
            accountSid: process.env.ACCOUNT_SID
        }
    )
    const service = client.sync.services(process.env.TWILIO_SYNC_SERVICE_SID)
    const twiml = new MessagingResponse()
    const message = twiml.message()
    const body = qs.parse(context.req.body)
    const text = body.Body
    const image = body.NumMedia && body.MediaUrl0

    console.log({ customVision })

    if (image) {
        const results = await customVision(image)
        const reply = whatsappReply(results)

        message.body(reply.message)

        if (reply.photo) {
            message.media(`https://quokkas.amyskapers.dev/img/quokkas/${photo}`)
        }

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
    }

    context.done(null, {
        status: 200,
        body: message.toString(),
        headers: {
            'Content-Type': 'text/xml'
        },
    })
};