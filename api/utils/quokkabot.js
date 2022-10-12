const { quokkas, randomImage } = require('../_data/photos')
const { facts, randomFacts } = require('../_data/facts')

const responses = {
	issue: {
		plain: `Thanks for reporting your issue, here's a picture of a quokka`
	},
	fact: {
		plain: randomFacts(facts)
	},
	quokka: {
		plain: 'This is a quokka',
	},
	default: {
		plain: `Welcome to Quokkabot! I can do a bunch of different things that have to do with quokkas.\nNeed a picture of a quokka? Just ask me\nNot sure if you've seen a quokka? Send me a picture and I'll tell you if there's a quokka in it`,
		html: `<p>Welcome to Quokkabot! I can do a bunch of different things that have to do with quokkas.</p><p>Need a picture of a quokka? Just ask me</p><p>Not sure if you've seen a quokka? Send me a picture and I'll tell you if there's a quokka in it</p>`
	},
}

const response = ({
	version = 'plain', 
	state = 'default', 
	imgMsg = false, 
}) => {
	let msg = responses[state][version]

	if(!msg) {
		msg = responses[state]['plain']

		if(version == 'html') {
			msg = `<p>${msg}</p>`
		}
	}

	console.log({msg, version, state, imgMsg})

	if(imgMsg) {
		if(version === 'html') {
			msg = `${msg} <p>(${imgMsg})</p>`
		}
		else {
			msg = `${msg} (${imgMsg})`
		}
	}

	return msg
}

const message = ({text, version = 'plain'}) => {
	const image = randomImage(quokkas)
	let results = {}

	if (RegExp(/error|issue|wrong/, 'i').test(text)) {
		results.body = response({
			version,
			state: 'issue', 
			imgMsg: image?.message
		})
		results.error = true
	}
	else if (RegExp('fact', 'i').test(text)) {
		results.body = response({
			version,
			state: 'fact', 
			imgMsg: image?.message
		})
	}
	else if (RegExp('quokka', 'i').test(text)) {
		results.body = response({
			version,
			state: 'quokka', 
			imgMsg: image?.message
		})
	}
	else {
		results.body = response({
			version,
			imgMsg: image?.message
		})
	}

	results.media = `https://quokkas.amyskapers.dev/img/quokkas/${image.slug}`

	if(version == 'html') {
		results.body = `${results.body}<p><img src="https://quokkas.amyskapers.dev/img/quokkas/${image.slug}"/></p>`
	}

	return results
}

module.exports = message