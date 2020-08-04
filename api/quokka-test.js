require('dotenv').config()

const { PredictionAPIClient } = require('@azure/cognitiveservices-customvision-prediction'),
{ApiKeyCredentials} = require('@azure/ms-rest-js'),
key = process.env.API_KEY,
endpoint = process.env.ENDPOINT,
projectId = process.env.PROJECT_ID,
iteration = process.env.ITERATION,
credentials = new ApiKeyCredentials({ inHeader: {"Prediction-key": key } })
predictor = new PredictionAPIClient(credentials, endpoint)

console.log({key, endpoint})

const customVision = async (image) => {
	context.log('test 2 1')
	const results = await predictor.classifyImageUrl(projectId, iteration, {url: image}),
	outcome = quokkaTest(results)

	return outcome
}

const customVisionBinary = async (image) => {
	const results = await predictor.classifyImage(projectId, iteration, image),
	outcome = quokkaTest(results)

	return outcome
}

const quokkaTest = (results) => {
	let outcome = {
		negative: null,
		quokka: null
	}

	results.predictions.forEach(tag => {
		if(tag.tagName == 'Negative') {
			outcome.negative = tag.probability
		}
		else if (tag.tagName == 'Quokka') {
			outcome.quokka = tag.probability
		}
	})

	return outcome
}

module.exports = {
	customVision,
	customVisionBinary
}