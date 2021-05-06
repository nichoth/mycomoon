const { Client, Environment } = require('square')
const createOrder = require('./create-order')
var pay = require('./pay')

const client = new Client({
    environment: Environment.Sandbox,
    accessToken: 'EAAAENYzIzAS3PZdZBlqqj72RLqwdGpNt-3f-1mR7F1ZKy21bRI1IXpFMPAPGN07'
})




// const ordersApi = client.ordersApi;

// Docs on event and context
// https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {

    // body: CreateOrderRequest
    // https://github.com/square/square-nodejs-sdk/blob/master/doc/models/create-order-request.md
    // var body = {
    //     "idempotency_key": "8193148c-9586-11e6-99f9-28cfe92138cf",
    //     // https://github.com/square/square-nodejs-sdk/blob/master/doc/models/order.md
    //     // order: ''
    // }


    var body = JSON.parse(event.body)
    var { nonce, idempotency_key, lineItems, shipping, email } = body
    console.log('body', body)

    var payment = await pay({ nonce, idempotency_key })

    var order = await createOrder({
        lineItems: lineItems,

        // lineItems: [
        //     {
        //         "base_price_money": {
        //             "amount": 1599,
        //             "currency": "USD"
        //         },
        //         "name": "New York Strip Steak",
        //         "quantity": "1"
        //     }
        // ],

        shipping: shipping,
        email: email
    }, idempotency_key)

    console.log('order', order)
    console.log('payment', payment)



    // https://github.com/square/square-nodejs-sdk/blob/master/doc/models/create-order-request.md
    // var body = {
    //     "idempotency_key": "8193148c-9586-11e6-99f9-28cfe92138cf",
    //     "order": {
    //         "discounts": [],
    //         "line_items": [
    //             {
    //                 "base_price_money": {
    //                     "amount": 1599,
    //                     "currency": "USD"
    //                 },
    //                 "name": "New York Strip Steak",
    //                 "quantity": "1"
    //             },
    //             {
    //                 "applied_discounts": [],
    //                 "catalog_object_id": "BEMYCSMIJL46OCDV4KYIKXIB",
    //                 "modifiers": [
    //                     {
    //                         "catalog_object_id": "CHQX7Y4KY6N5KINJKZCFURPZ"
    //                     }
    //                 ],
    //                 "quantity": "2"
    //             }
    //         ],
            
    //         // this is a real loc id
    //         // location_id: "LAZSTD2P84MEA",
    //         // "location_id": "LTTBZ5XKA3MGS", 
    //         "locationId": "LAZSTD2P84MEA",

    //         // "reference_id": "my-order-001",
    //         "taxes": [
    //             {
    //                 "name": "State Sales Tax",
    //                 "percentage": "9",
    //                 "scope": "ORDER",
    //                 "uid": "state-sales-tax"
    //             }
    //         ]
    //     }
    // }




    try {
        return {
            statusCode: 200,
            body: JSON.stringify({
                orderId: 'orderId'
            }),
            // // more keys you can return:
            // headers: { "headerName": "headerValue", ... },
            // isBase64Encoded: true,
        }
    } catch (error) {
        console.log('oh no', error)
        return { statusCode: 500, body: error.toString() }
    }

}

module.exports = { handler }
