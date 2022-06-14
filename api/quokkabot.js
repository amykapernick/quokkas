const { quokkas, notQuokkas } = require('./_data/photos')

const randomImage = (array) => {
	const length = array.length
	const number = Math.floor((Math.random() * length))

	return array[number]
}

const message = (text) => {
	const image = randomImage(quokkas)
	let results = {}

	if (RegExp(/error|issue|wrong/, 'i').test(text)) {
		results.body = `Thanks for reporting your issue, here's a picture of a quokka`
		results.error = true

		if (image?.message) {
			results.body = `${results.body} (${image.message})`
		}
	}
	else if (RegExp('quokka', 'i').test(text)) {
		results.body = 'This is a quokka'

		if (image?.message) {
			results.body = image.message
		}
	}
	else {
		results.body = `Welcome to Quokkabot! I can do a bunch of different things that have to do with quokkas.\nNeed a picture of a quokka? Just ask me\nNot sure if you've seen a quokka? Send me a picture and I'll tell you if there's a quokka in it`
	}

	results.media = `https://quokkas.amyskapers.dev/img/quokkas/${image.slug}`

	return results
}

const email = (text) => {
	const image = randomImage(quokkas)
	let results = {}

	if (RegExp(/error|issue|wrong/, 'i').test(text)) {
		results.body = `<p>Thanks for reporting your issue, here's a picture of a quokka</p>`
		results.error = true

		if (image?.message) {
			results.body = `${results.body} <p>(${image.message})</p>`
		}
	}
	else if (RegExp('quokka', 'i').test(text)) {
		results.body = '<p>This is a quokka</p>'

		if (image?.message) {
			results.body = `<p>${image.message}</p>`
		}
	}
	else {
		results.body = `<p>Welcome to Quokkabot! I can do a bunch of different things that have to do with quokkas.</p><p>Need a picture of a quokka? Just ask me</p><p>Not sure if you've seen a quokka? Send me a picture and I'll tell you if there's a quokka in it</p>`
	}

	results.body = `${results.body}<p><img src="https://quokkas.amyskapers.dev/img/quokkas/${image.slug}"/></p>`

	return results
}

module.exports = {
	message,
	email
}