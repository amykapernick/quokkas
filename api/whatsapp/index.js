require('dotenv').config()

const twilio = require('twilio')
const { PredictionAPIClient } = require('@azure/cognitiveservices-customvision-prediction')
const { ApiKeyCredentials } = require('@azure/ms-rest-js')

const { randomImage, quokkas, notQuokkas } = require('../_data/photos')
const {randomFacts, facts} = require('../_data/facts')

const key = process.env.API_KEY
const endpoint = process.env.ENDPOINT
const projectId = process.env.PROJECT_ID
const iteration = process.env.ITERATION

const credentials = new ApiKeyCredentials({ inHeader: { "Prediction-key": key } })
const predictor = new PredictionAPIClient(credentials, endpoint)

module.exports = async function (context) {
    const MessagingResponse = twilio.twiml.MessagingResponse
    const twiml = new MessagingResponse()
    const message = twiml.message()
    const msgParams = new URLSearchParams(context.req.body)
    const msgText = msgParams.get('Body')
    const image = msgParams.get('MediaUrl0')
    let results = false

    if(image) {
        results = await predictor.classifyImageUrl(projectId, iteration, { url: image })

        let outcome = {}

        results.predictions.forEach(tag => {
            if (tag.tagName == 'Negative') {
                outcome.negative = tag.probability
            } else if (tag.tagName == 'Quokka') {
                outcome.quokka = tag.probability
            }
        })

        const quokka = `${(outcome.quokka * 100).toFixed(2)}%`
        const notQuokka = `${(outcome.negative * 100).toFixed(2)}%`

        if(outcome.negative > outcome.quokka) {
            message.body(`Sorry that doesn't look like a quokka\nQuokka: ${quokka}, Not Quokka: ${notQuokka}\nThat's pretty sad though, so here's a quokka`)

            message.media(`https://quokkas.amyskapers.dev/img/quokkas/${randomImage(quokkas).slug}`)
        }
        else {
            message.body(`Yep that looks like a quokka!\nQuokka: ${quokka}, Not Quokka: ${notQuokka}`)
        }
    }
    else {
        if(RegExp(/error|issue|wrong/, 'i').test(msgText)) {
            message.body('Sorry about that, here is a quokka to cheer you up')
        }
        else if (RegExp('fact', 'i').test(msgText)) {
            message.body(randomFacts(facts))
        }
        else if(RegExp('quokka', 'i').test(msgText)) {
            message.body('This is a quokka')
            
        }
        else {
            message.body(`Welcome to Quokkabot! I can do a bunch of different things that have to do with quokkas.\nNeed a picture of a quokka? Just ask me\nNot sure if you've seen a quokka? Send me a picture and I'll tell you if there's a quokka in it`)
        }

        message.media(`https://quokkas.amyskapers.dev/img/quokkas/${randomImage(quokkas).slug}`)
    }

    context.done(null, {
        status: 200,
        body: message.toString(),
        headers: {
            'Content-Type': 'text/xml'
        },
    })
};