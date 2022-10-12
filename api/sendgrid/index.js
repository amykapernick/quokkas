require('dotenv').config()

const sgMail = require('@sendgrid/mail')
const parseMultipartFormData = require('@anzp/azure-function-multipart').default
const customVision = require('../utils/quokkaTest')
const quokkaBot = require('../utils/quokkabot')
const { updateResults, updateImage } = require('../utils/sync')
const quokkaResults = require('../utils/quokkaResults')


module.exports = async function (context, req) {
    const { fields, files } = await parseMultipartFormData(req)
    const body = {}
    const image = (files && files.length) && files[0].bufferFile

    fields.forEach(field => {
        body[field.name] = field.value
    })

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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

        msg.html = reply?.message

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

        updateImage({
            image: results.media
        })

        msg.html = results?.body

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