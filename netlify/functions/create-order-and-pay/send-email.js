require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
function sendEmail ({ toEmail, fromEmail, payment, order }) {

    return Promise.all([toEmail, fromEmail].map(addr => {
        const msg = {
            to: addr, // Change to your recipient
            from: fromEmail,
            subject: 'Thanks for buying mushrooms',
            text: 'yes thanks',
            html: `<p>
                    <a href=${payment.receiptUrl}>
                        receipt URL
                    </a>
                </p>
                <pre>
                    ${JSON.stringify(payment, stringer, 2)}
                </pre>
                <pre>
                    ${JSON.stringify(order, stringer, 2)}
                </pre>`
        }

        return sgMail.send(msg)
            .then(res => {
                // console.log('**res**', res)
                return res
            })
            .catch(err => {
                console.log('errrrrrr', err)
            })
    }))



}

function stringer (key, value) {
    return typeof value === "bigint" ? value.toString() + "n" : value
}

module.exports = sendEmail
