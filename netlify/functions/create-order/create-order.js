const { Client, Environment } = require('square')

const client = new Client({
    environment: Environment.Sandbox,
    // accessToken: process.env.SQUARE_ACCESS_TOKEN,
    // accessToken: 'EAAAEDjayT7mAyyiqdNpLs_fD72uRTNq9FXwQ6nbDibhn-JHL62hwB-DuZQEs0I2'

    // this is from the 'sandbox test account'
    // this one works
    accessToken: 'EAAAENYzIzAS3PZdZBlqqj72RLqwdGpNt-3f-1mR7F1ZKy21bRI1IXpFMPAPGN07'
})

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {

    console.log('envvvv', process.env.SQ_SANDBOX_APP_ID)
    // console.log('client', client)

    const ordersApi = client.ordersApi;
    // body: CreateOrderRequest
    // https://github.com/square/square-nodejs-sdk/blob/master/doc/models/create-order-request.md
    // var body = {
    //     "idempotency_key": "8193148c-9586-11e6-99f9-28cfe92138cf",
    //     // https://github.com/square/square-nodejs-sdk/blob/master/doc/models/order.md
    //     // order: ''
    // }



    // https://github.com/square/square-nodejs-sdk/blob/master/doc/models/create-order-request.md
    var body = {
        "idempotency_key": "8193148c-9586-11e6-99f9-28cfe92138cf",
        "order": {
            "discounts": [],
            "line_items": [
                {
                    "base_price_money": {
                        "amount": 1599,
                        "currency": "USD"
                    },
                    "name": "New York Strip Steak",
                    "quantity": "1"
                },
                {
                    "applied_discounts": [],
                    "catalog_object_id": "BEMYCSMIJL46OCDV4KYIKXIB",
                    "modifiers": [
                        {
                            "catalog_object_id": "CHQX7Y4KY6N5KINJKZCFURPZ"
                        }
                    ],
                    "quantity": "2"
                }
            ],
            
            // this is a real loc id
            // location_id: "LAZSTD2P84MEA",
            // "location_id": "LTTBZ5XKA3MGS", 
            "locationId": "LAZSTD2P84MEA",

            // "reference_id": "my-order-001",
            "taxes": [
                {
                    "name": "State Sales Tax",
                    "percentage": "9",
                    "scope": "ORDER",
                    "uid": "state-sales-tax"
                }
            ]
        }
    }

    var res
    try {
        res = await ordersApi.createOrder(body);
    } catch (err) {
        console.log('***err')
        console.log(err)
    }

    // console.log('result', res)
    console.log('result22222222', res.result)

    try {
        const subject = event.queryStringParameters.name || 'World'
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Hello ${subject}. --create order--`,
                result: res.result,
                appId: process.env.SQ_SANDBOX_APP_ID
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
