require('dotenv').config()

const sgMail = require('@sendgrid/mail')
const twilio = require('twilio')
const { customVisionBinary: customVision } = require('../utils/quokkaTest')
const multipart = require('../parse-multipart/multipart')
const { email: quokkaBot } = require('../utils/quokkabot')
const { quokkas, randomImage } = require('../_data/photos')

const emailReply = (outcome) => {
    const quokka = `${(outcome.quokka * 100).toFixed(2)}%`
    const notQuokka = `${(outcome.negative * 100).toFixed(2)}%`
    const photo = randomImage(quokkas)

    let message

    if (outcome.quokka > outcome.negative) {
        message = `<p>Yep, that looks like a quokka!</p><dl><dt>Quokka:</dt><dd>${quokka}</dd><dt>Not Quokka:</dt><dd>${notQuokka}</dd></dl>`
    }
    else {
        message = `<p>Sorry, that doesn't look like that's a quokka 😢</p><dl><dt>Quokka:</dt><dd>${quokka}</dd><dt>Not Quokka:</dt><dd>${notQuokka}</dd></dl><p>That's pretty sad though, so here's a quokka!</p><p><img src="https://quokkas.amyskapers.dev/img/quokkas/${photo}"/></p>`
    }

    if (photo?.message) {
        message = `${message}<p>(${photo.message})</p>`
    }

    return message
}

module.exports = async function (context, req) {
    const bodyBuffer = Buffer.from(req.body)
    const boundary = multipart.getBoundary(req.headers['content-type'])
    const client = twilio(
        process.env.TWILIO_API_KEY,
        process.env.TWILIO_API_SECRET,
        {
            accountSid: process.env.ACCOUNT_SID
        }
    )
    const service = client.sync.services(process.env.TWILIO_SYNC_SERVICE_SID)

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    console.log({ bodyBuffer, boundary })

    let body = {}
    let image

    multipart.Parse(bodyBuffer, boundary).forEach(o => {
        if (o.name) {
            body[o.name] = o.data
        }
        else if (o.filename) {
            body.filename = o.data
        }

        if (o.filename) {
            image = o.data
        }
    })

    console.log({ body, image })

    let msg = {
        to: body.from,
        from: {
            name: 'Quokkabot',
            email: 'quokkas@amyskapers.dev',
        },
        subject: `Re: ${body.subject}`
    }

    console.log({ msg })

    if (image) {
        const results = await customVision(image)

        msg.html = `${emailReply(results)}<hr/>${body.text}`

        service.syncLists('pastResults').syncListItems.create({
            data: {
                image: image,
                results: results
            }
        }).catch(console.error)
    }
    else {
        const results = quokkaBot(body.text)

        msg.html = `${results.body}<hr/><p><strong>From:</strong> ${body.from}<br/><strong>To:</strong> ${body.to}<br/><strong>Subject:</strong> ${body.subject}
        </p><br/><br/>${body?.html || `<p>${body.text}</p>`}`

        if (results.error) {
            msg.bcc = {
                name: 'Quokkabot',
                email: 'quokkabot@kapers.dev'
            }
        }
    }

    await sgMail.send(msg)


};