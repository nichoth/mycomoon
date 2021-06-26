// const { Client, Environment } = require('square')

// const client = new Client({
//     environment: Environment.Sandbox,
//     accessToken: 'EAAAENYzIzAS3PZdZBlqqj72RLqwdGpNt-3f-1mR7F1ZKy21bRI1IXpFMPAPGN07'
// })

// const paymentsApi = client.paymentsApi;

// // Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
// const handler = async (event) => {

//     try {
//         var body = JSON.parse(event.body)
//         var { nonce, idempotency_key, location_id } = body
//         console.log('body', body)

//         var requestBody = {
//             sourceId: nonce,
//             amountMoney: {
//                 amount: 100, // $1.00 charge
//                 currency: 'USD'
//             },
//             locationId: location_id,
//             idempotencyKey: idempotency_key,
//         };

//         var response = await paymentsApi.createPayment(requestBody);

//         console.log('response aaaaa', response)



//         var stringer = (key, value) => {
//             return typeof value === "bigint" ? value.toString() + "n" : value
//         }

//         return {
//             statusCode: 200,
//             body: JSON.stringify({
//                 title: 'Payment Successful',
//                 result: response.result
//             }, stringer, 2)
//         }

//     } catch (error) {
//         return {
//             statusCode: 500,
//             body: JSON.stringify({
//                 'title': 'Payment Failure',
//                 'result': error.toString()
//             })
//         }
//     }
// }

// module.exports = { handler }
