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
            // lineIems: lineItems,

            lineItems: lineItems.map(function (item) {
                return {
                    catalogObjectId: item.variationId,
                    quantity: '' + item.quantity,
                    metadata: { slug: item.slug }
                }
            }),

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


            idempotencyKey: idempKey,

            // this is a real loc id
            locationId: "LAZSTD2P84MEA",

            fulfillments: [
                {
                    type: 'SHIPMENT',
                    shipmentDetails: {
                        recipient: {
                            displayName: shipping['first-name'],
                            emailAddress: email,
                            // phoneNumber: '',
                            address: {
                                addressLine1: shipping.address,
                                // addressLine2: '',
                                // addressLine3: '',
                                locality: shipping.city, // the city
                                // the state
                                administrativeDistrictLevel1: shipping.state,  
                                postalCode: shipping['zip-code'],
                                country: 'US',
                                firstName: shipping['first-name'],
                                lastName: shipping['last-name']
                            }
                        },
                        // trackingNumber: '',
                        // trackingUrl: '',
                    }
                }
            ],
            
            taxes: [
                {
                    "name": "State Sales Tax",
                    "percentage": "6.5",
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
        throw err
    }

    return res.result
}

module.exports = createOrder
