require('dotenv').config()

const twilio = require('twilio')
const { PredictionAPIClient } = require('@azure/cognitiveservices-customvision-prediction')
const { ApiKeyCredentials } = require('@azure/ms-rest-js')

const { randomImage, quokkas, notQuokkas } = require('../_data/photos')

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
    }
    else {
        if(RegExp('quokka', 'i').test(msgText)) {
            message.body('This is a quokka')
            message.media(`https://quokkas.amyskapers.dev/img/quokkas/${randomImage(quokkas).slug}`)
        }
        else {
            message.body('This is not a quokka')
            message.media(`https://quokkas.amyskapers.dev/img/not_quokkas/${randomImage(notQuokkas).slug}`)
        }
    }

    context.log({results: JSON.stringify(results)})

    context.done(null, {
        status: 200,
        body: message.toString(),
        headers: {
            'Content-Type': 'text/xml'
        },
    })
};