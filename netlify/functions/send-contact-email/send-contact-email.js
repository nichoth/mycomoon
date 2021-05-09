var key = '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'

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = (event, ctx, cb) => {
    try {
        const subject = event.queryStringParameters.name || 'World'

        const sgMail = require('@sendgrid/mail')
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)

        const msg = {
            to: 'nichoth@gmail.com', // Change to your recipient
            from: 'getmycomoon@mycomoon.com', // Change to your verified sender
            subject: 'Sending with SendGrid is Fun',
            text: subject + ' -- and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        }

        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
                cb(null, {
                    statusCode: 200,
                    body: JSON.stringify({
                        status: 'email sent',
                        message: `Hello ${subject}`
                    })
                })
            })
            .catch((error) => {
                console.error('**err**', error)
            })


        // return {
        //     statusCode: 200,
        //     body: JSON.stringify({
        //         status: 'email sent',
        //         message: `Hello ${subject}`
        //     })
        //     // // more keys you can return:
        //     // headers: { "headerName": "headerValue", ... },
        //     // isBase64Encoded: true,
        // }

    } catch (error) {
        return { statusCode: 500, body: error.toString() }
    }
}

module.exports = { handler }
