require('dotenv').config()

const customVision = require('../quokka-test').customVisionBinary,
quokkabot = require('../quokkabot').email

const emailReply = (outcome) => {
    let message,
        photo = Math.floor(Math.random() * 12),
        quokka = `${(outcome.quokka * 100).toFixed(2)}%`,
        notQuokka = `${(outcome.negative * 100).toFixed(2)}%`

        if(outcome.quokka > outcome.negative) {
            message = `<p>Yep, that looks like a quokka!</p>
                <dl>
                    <dt>Quokka:</dt><dd>${quokka}</dd>
                    <dt>Not Quokka:</dt><dd>${notQuokka}</dd>
                </dl>`
        }
        else {
            message = `<p>Sorry, that doesn't look like that's a quokka 😢</p>
                <dl>
                    <dt>Quokka:</dt><dd>${quokka}</dd>
                    <dt>Not Quokka:</dt><dd>${notQuokka}</dd>
                </dl>
                <p>That's pretty sad though, so here's a quokka!</p>
                <p><img src="https://amyskapers.dev/img/quokkas/quokka_(${photo}).jpg"/></p>`
        }

        return message
}

module.exports = async function (context, req) {
    const multipart = require('../parse-multipart/multipart'),
    bodyBuffer = Buffer.from(req.body),
    boundary = multipart.getBoundary(req.headers['content-type']),
    sgMail = require('@sendgrid/mail'),
    client = require('twilio')(
        process.env.TWILIO_API_KEY,
        process.env.TWILIO_API_SECRET,
        {accountSid: process.env.ACCOUNT_SID}
    ),
    service = client.sync.services(process.env.TWILIO_SYNC_SERVICE_SID)

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    let body = {},
    image,
    reply = {}

    multipart.Parse(bodyBuffer, boundary).forEach(o => {
        if(o.name) {
            body[o.name] = o.data
        }
        else if(o.filename) {
            body.filename = o.data
        }

        if(o.filename) {
            image = o.data
        }
    })

    let msg = {
        to: body.from,
        from: {
            name: 'Quokkabot',
            email: 'quokkas@amyskapers.dev',
        },
        subject: `Re: ${body.subject}`
    }

    if(image) {
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
        const results = quokkabot(body.text)

        msg.html = `${results.body}<hr/>${body.text}`

        if(results.error) {
            msg.bcc = {
                name: 'Quokkabot',
                email: 'quokkabot@kapers.dev'
            }
        }

        // service.documents('image').update({
        //     data: {
        //         image: results.media
        //     }
        // }).catch(console.error)
    }

    await sgMail.send(msg)

    
};