const twilio = require('twilio')
const client = twilio(
	process.env.TWILIO_API_KEY,
	process.env.TWILIO_API_SECRET,
	{
		accountSid: process.env.ACCOUNT_SID
	}
)
const service = client.sync.services(process.env.TWILIO_SYNC_SERVICE_SID)

const updateResults = ({image, results}) => {
	service.syncLists('pastResults').syncListItems.create({
		data: {
			image,
			results
		}
	}).catch(console.error)
}

const updateImage = ({image}) => {
	service.documents('image').update({
		data: {
			image
		}
	}).catch(console.error)
}

module.exports = {
	updateResults,
	updateImage
}