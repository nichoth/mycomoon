// const createOrder = require('./create-order')
// var pay = require('./pay')
// var sendEmail = require('./send-email')

// // Docs on event and context
// // https://www.netlify.com/docs/functions/#the-handler-method
// const handler = async (event, ctx, cb) => {

//     // https://github.com/square/square-nodejs-sdk/blob/master/doc/models/create-order-request.md
//     // https://github.com/square/square-nodejs-sdk/blob/master/doc/models/order.md


//     var body = JSON.parse(event.body)
//     var { nonce, idempotency_key, lineItems, shipping, email } = body

//     try {
//         var orderRes = await createOrder({
//             lineItems: lineItems,
//             shipping: shipping,
//             email: email
//         }, idempotency_key)
//     } catch (err) {
//         console.log('errrrrrr', err)
//         return { statusCode: 500, body: err.toString() }
//     }

//     // console.log('**order**', orderRes)

//     try {
//         var paymentRes = await pay({ nonce, idempotency_key, ...orderRes })
//     } catch (err) {
//         console.log('**server side error**', err)
//         console.log('**the body**', JSON.parse(err.body, null, 2))
//         return {
//             statusCode: 500,
//             body: err.body
//         }
//     }

//     // console.log('**payment**', paymentRes)

//     // https://github.com/square/square-nodejs-sdk/blob/master/doc/models/create-order-request.md

//     return sendEmail({
//         ...paymentRes,
//         ...orderRes,
//         fromEmail: 'getmycomoon@mycomoon.com',
//         toEmail: email
//     })
//         .then(() => {
//             return {
//                 statusCode: 200,
//                 body: JSON.stringify({
//                     ...paymentRes,
//                     ...orderRes,
//                     status: 'email sent',
//                     message: `woooo`,
//                 }, stringer, 2)
//             }
//         })
//         .catch(err => console.log('errrrr againnn', err))

// }

// function stringer (key, value) {
//     return typeof value === "bigint" ? value.toString() + "n" : value
// }

// module.exports = { handler }
