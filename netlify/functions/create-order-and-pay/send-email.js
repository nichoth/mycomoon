require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
function sendEmail ({ toEmail, subject }) {
    const msg = {
        to: toEmail, // Change to your recipient
        from: 'getmycomoon@mycomoon.com',
        subject: 'Sending with SendGrid is Fun',
        text: subject + ' -- and easy to do anywhere, even with Node.js',
        html: '<strong>' + subject + ' -- and easy to do anywhere, even with Node.js</strong>',
    }

    return sgMail.send(msg)
        // .then(() => {
        //     console.log('Email sent')
        //     cb(null, {
        //         statusCode: 200,
        //         body: JSON.stringify({
        //             status: 'email sent',
        //             message: `Hello ${subject}`
        //         })
        //     })
        // })
        // .catch((error) => {
        //     console.error('**err**', error)
        // })

}

module.exports = sendEmail
