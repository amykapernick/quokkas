require('dotenv').config()

const { PredictionAPIClient } = require('@azure/cognitiveservices-customvision-prediction')
const { ApiKeyCredentials } = require('@azure/ms-rest-js')

const key = process.env.API_KEY
const endpoint = process.env.ENDPOINT
const projectId = process.env.PROJECT_ID
const iteration = process.env.ITERATION

const credentials = new ApiKeyCredentials({ inHeader: { "Prediction-key": key } })
const predictor = new PredictionAPIClient(credentials, endpoint)

const customVision = async ({image, version}) => {
	let results

	if(version == 'binary') {
		results = await predictor.classifyImage(projectId, iteration, image)
	}
	else {
		results = await predictor.classifyImageUrl(projectId, iteration, { url: image })
	}

	const outcome = quokkaTest(results)

	return outcome
}

const quokkaTest = (results) => {
	let outcome = {}

	results.predictions.forEach(tag => {
		if (tag.tagName == 'Negative') {
			outcome.negative = tag.probability
		} else if (tag.tagName == 'Quokka') {
			outcome.quokka = tag.probability
		}
	})

	return outcome
}


module.exports = customVision