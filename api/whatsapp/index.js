require('dotenv').config()

const twilio = require('twilio')
const customVision = require('../utils/quokkaTest')
const quokkaBot = require('../utils/quokkabot')
const quokkaResults = require('../utils/quokkaResults')
const { updateResults, updateImage } = require('../utils/sync')


module.exports = async function (context) {
    const qs = require('querystring')
    const MessagingResponse = twilio.twiml.MessagingResponse
    const twiml = new MessagingResponse()
    const message = twiml.message()
    const body = qs.parse(context.req.body)
    const text = body.Body
    const image = body.NumMedia && body.MediaUrl0

    if (image) {
        const results = await customVision({image})
        const reply = quokkaResults({
            results,
        })

        message.body(reply.message)
        
        if (reply?.photo) {
            message.media(reply.photo)

            updateImage({
                image: reply.photo
            })
        }

        updateResults({
            image,
            results
        })
    }
    else {
        const reply = quokkaBot({
            text,
            version: 'plain'
        })

        message.body(reply.body)
        message.media(reply.media)
    }

    console.log({message})

    context.done(null, {
        status: 200,
        body: message.toString(),
        headers: {
            'Content-Type': 'text/xml'
        },
    })
};