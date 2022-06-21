require('dotenv').config()

const sgMail = require('@sendgrid/mail')
const customVision = require('../utils/quokkaTest')
const multipart = require('../parse-multipart/multipart')
const quokkaBot = require('../utils/quokkabot')
const { updateResults, updateImage } = require('../utils/sync')


module.exports = async function (context, req) {
    const bodyBuffer = Buffer.from(req.body)
    const boundary = multipart.getBoundary(req.headers['content-type'])

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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

    let msg = {
        to: body.from,
        from: {
            name: 'Quokkabot',
            email: 'quokkas@amyskapers.dev',
        },
        subject: `Re: ${body.subject}`
    }

    const original = `<hr/><p><strong>From:</strong> ${body.from}<br/><strong>To:</strong> ${body.to}<br/><strong>Subject:</strong> ${body.subject}</p><br/><br/>${body?.html || `<p>${body?.text}</p>`}`


    if (image) {
        const results = await customVision({image, version: 'binary'})
        const reply = quokkaResults({
            results,
            version: 'html'
        })

        if (reply?.photo) {
            updateImage({
                image: photoUrl
            })
        }

        updateResults({
            image,
            results
        })
    }
    else {
        const results = quokkaBot({
            text: body.text,
            version: 'html'
        })

        if (results.error) {
            msg.bcc = {
                name: 'Quokkabot',
                email: 'quokkabot@kapers.dev'
            }
        }
    }

    msg.html = `${msg.html}${original}`

    await sgMail.send(msg)


};