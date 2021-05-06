const { Client, Environment } = require('square')

const client = new Client({
    environment: Environment.Sandbox,
    accessToken: 'EAAAENYzIzAS3PZdZBlqqj72RLqwdGpNt-3f-1mR7F1ZKy21bRI1IXpFMPAPGN07'
})

const paymentsApi = client.paymentsApi;

const pay = async ({ order, nonce, idempotency_key }) => {
    const requestBody = {
        sourceId: nonce,

        // TODO -- get the order and see if it has the total price
        orderId: order.id,

        // TODO -- need to get the amount from the backend
        amountMoney: {
            amount: 100, // $1.00 charge
            currency: 'USD'
        },

        locationId: "LAZSTD2P84MEA",
        idempotencyKey: idempotency_key
    };

    try {
        var response = await paymentsApi.createPayment(requestBody);
        return response.result
    } catch(error) {
        // let errorResult = null;

        // if (error instanceof ApiError) {
        //     errorResult = error.errors;
        // } else {
        //     errorResult = error;
        // }

        throw error

        // res.status(500).json({
        //     'title': 'Payment Failure',
        //     'result': errorResult
        // });
    }

}

module.exports = pay
