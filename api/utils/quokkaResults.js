const { quokkas, randomImage } = require('../_data/photos')

const responses = {
	positive: [
		'Yep, that looks like a quokka!',
		'{results}'
	],
	negative: [
		`Sorry, doesn't look like that's a quokka 😢`,
		`{results}`,
		`That's pretty sad though, so here's a quokka`
	]
}

const reply = ({
	version = 'plain', 
	results = false
}) => {
	const photo = randomImage(quokkas)
	const quokka = `${(results.quokka * 100).toFixed(2)}%`
	const notQuokka = `${(results.negative * 100).toFixed(2)}%`
	const outcome = outcome.negative > outcome.quokka ? 'negative' : 'positive'

	let message
	let media

	if(version == 'html') {
		message = `${responses[outcome].join('</p><p>')}`
	}
	else {
		message = responses[outcome].join('\n')
	}

	message = message.replace('{results}', `Quokka: ${quokka}, Not Quokka: ${notQuokka}`)

	if(photo?.message) {
		if(version === 'html') {
			message = `${message} <p>(${photo.message})</p>`
		}
		else {
			message = `${message} (${photo.message})`
		}
	}

	if(version == 'plain') {
		media = `https://quokkas.amyskapers.dev/img/quokkas/${photo.slug}`
	}
	else {
		message = `${message}<p><img src="https://quokkas.amyskapers.dev/img/quokkas/${photo.slug}"/></p>`
	}

	return {
		message,
		photo: media
	}
}

module.exports = reply