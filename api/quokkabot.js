const message = (text) => {
	let results = {},
		photo = Math.floor(Math.random() * 12)

	if (RegExp(/error|issue|wrong/, 'i').test(text)) {
		results.body = `Thanks for reporting your issue, here's a picture of a quokka`
		results.error = true
	}
	else if (RegExp('quokka', 'i').test(text)) {
		results.body = 'This is a quokka'
	}
	else {
		results.body = `Welcome to Quokkabot! I can do a bunch of different things that have to do with quokkas.
		\nNeed a picture of a quokka? Just ask me
		\nNot sure if you've seen a quokka? Send me a picture and I'll tell you if there's a quokka in it`
	}

	results.media = `https://quokkas.amyskapers.dev/img/quokkas/quokka_(0).jpg`

	return results
}

const email = (text) => {
	let results = {},
		photo = Math.floor(Math.random() * 12)

	if (RegExp(/error|issue|wrong/, 'i').test(text)) {
		results.body = `<p>Thanks for reporting your issue, here's a picture of a quokka</p>`
		results.error = true
	}
	else if (RegExp('quokka', 'i').test(text)) {
		results.body = '<p>This is a quokka</p>'
	}
	else {
		results.body = `<p>Welcome to Quokkabot! I can do a bunch of different things that have to do with quokkas.</p>
		<p>Need a picture of a quokka? Just ask me</p>
		<p>Not sure if you've seen a quokka? Send me a picture and I'll tell you if there's a quokka in it</p>`
	}

	results.body = `${results.body}<p><img src="https://quokkas.amyskapers.dev/img/quokkas/quokka_(0).jpg"/></p>`

	return results
}

module.exports = {
	message,
	email
}