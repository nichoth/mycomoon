// const { Client, Environment } = require('square')
const createOrder = require('./create-order')
var pay = require('./pay')

// const client = new Client({
//     environment: Environment.Sandbox,
//     accessToken: 'EAAAENYzIzAS3PZdZBlqqj72RLqwdGpNt-3f-1mR7F1ZKy21bRI1IXpFMPAPGN07'
// })

// Docs on event and context
// https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {

    // https://github.com/square/square-nodejs-sdk/blob/master/doc/models/create-order-request.md
    // https://github.com/square/square-nodejs-sdk/blob/master/doc/models/order.md


    var body = JSON.parse(event.body)
    var { nonce, idempotency_key, lineItems, shipping, email } = body
    console.log('body', body)

    var orderRes = await createOrder({
        lineItems: lineItems,
        shipping: shipping,
        email: email
    }, idempotency_key)

    // console.log('order', order)

    var paymentRes = await pay({ nonce, idempotency_key, ...orderRes })

    // console.log('payment', payment)


    // https://github.com/square/square-nodejs-sdk/blob/master/doc/models/create-order-request.md


    try {
        return {
            statusCode: 200,
            body: JSON.stringify({ ...paymentRes, ...orderRes }, stringer, 2),
            // // more keys you can return:
            // headers: { "headerName": "headerValue", ... },
            // isBase64Encoded: true,
        }
    } catch (error) {
        console.log('oh no', error)
        return { statusCode: 500, body: error.toString() }
    }
}

function stringer (key, value) {
    return typeof value === "bigint" ? value.toString() + "n" : value
}

module.exports = { handler }
