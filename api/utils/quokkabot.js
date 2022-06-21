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

const response = ({
	version = 'plain', 
	state = 'default', 
	imgMsg = false, 
	results = false
}) => {
	let msg = responses[state][version]

	if(results) {
		const quokka = `${(results.quokka * 100).toFixed(2)}%`
        const notQuokka = `${(results.negative * 100).toFixed(2)}%`
		const outcome = outcome.negative > outcome.quokka ? 'negative' : 'positive'

		if(version == 'html') {
			msg = `${responses[outcome].join('</p><p>')}`
		}
		else {
			msg = responses[outcome].join('\n')
		}

		msg = msg.replace('{results}', `Quokka: ${quokka}, Not Quokka: ${notQuokka}`)
	}

	if(!msg) {
		msg = responses[state]['plain']
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

	if(version == 'plain') {
		results.media = `https://quokkas.amyskapers.dev/img/quokkas/${image.slug}`
	}
	else {
		results.body = `${results.body}<p><img src="https://quokkas.amyskapers.dev/img/quokkas/${image.slug}"/></p>`
	}

	return results
}

module.exports = message