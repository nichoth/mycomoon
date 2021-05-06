const { Client, Environment } = require('square')

const client = new Client({
    environment: Environment.Sandbox,
    accessToken: 'EAAAENYzIzAS3PZdZBlqqj72RLqwdGpNt-3f-1mR7F1ZKy21bRI1IXpFMPAPGN07'
})

const ordersApi = client.ordersApi;

var createOrder = async function ({ lineItems, shipping, email }, idempKey) {
    // https://github.com/square/square-nodejs-sdk/blob/master/doc/models/create-order-request.md
    var body = {
        idempotencyKey: idempKey,
        order: {
            lineIems: lineItems,

            idempotencyKey: idempKey,

            // this is a real loc id
            locationId: "LAZSTD2P84MEA",

            fulfillments: [
                {
                    shipmentDetails: {
                        recipient: {
                            emailAddress: email,
                            phoneNumber: '',
                            address: {
                                addressLine1: shipping.address,
                                addressLine2: '',
                                addressLine3: '',
                                locality: shipping.city, // the city
                                // the state
                                administrativeDistrictLevel1: shipping.state,  
                                postalCode: shipping.postalCode,
                                country: 'USA',
                                firstName: shipping.name,
                                lastName: shipping.lastName
                            }
                        },
                        trackingNumber: '',
                        trackingUrl: '',
                    }
                }
            ],
            
            // lineItems: [
            //     {
            //       quantity: '1',
            //       catalogObjectId: '{COFFEE_ITEM_ID}',
            //       modifiers: [
            //         {
            //           catalogObjectId: '{SMALL_MODIFIER_ID}'
            //         }
            //       ]
            //     }
            //   ]
            // },

            taxes: [
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
