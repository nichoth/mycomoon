const { Client, Environment } = require('square')

const client = new Client({
    environment: Environment.Sandbox,
    accessToken: 'EAAAENYzIzAS3PZdZBlqqj72RLqwdGpNt-3f-1mR7F1ZKy21bRI1IXpFMPAPGN07'
})

const ordersApi = client.ordersApi;

var createOrder = async function (lineItems, idempKey) {
    // https://github.com/square/square-nodejs-sdk/blob/master/doc/models/create-order-request.md
    var body = {
        "idempotency_key": idempKey,
        "order": {
            "line_items": lineItems,

            fulfillments: [
                {
                    shipmentDetails: {
                        recipient: {
                            emailAddress: '',
                            phoneNumber: '',
                            address: {
                                addressLine1: '',
                                addressLine2: '',
                                addressLine3: '',
                                locality: '', // the city
                                administrativeDistrictLevel1: '',  // the state
                                postalCode: '',
                                country: '',
                                firstName: '',
                                lastName: ''
                            }
                        },
                        trackingNumber: '',
                        trackingUrl: '',
                    }
                }
            ],
            
            // this is a real loc id
            "locationId": "LAZSTD2P84MEA",

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

    try {
        var res = await ordersApi.createOrder(body);
    } catch (err) {
        console.log('***err')
        console.log(err)
    }

    return res
}

module.exports = createOrder
