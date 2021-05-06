const { Client, Environment } = require('square')

const client = new Client({
    environment: Environment.Sandbox,
    accessToken: 'EAAAENYzIzAS3PZdZBlqqj72RLqwdGpNt-3f-1mR7F1ZKy21bRI1IXpFMPAPGN07'
})

const paymentsApi = client.paymentsApi;

const pay = async ({ order, nonce, idempotency_key }) => {


    var { totalMoney } = order


    const requestBody = {
        sourceId: nonce,
        orderId: order.id,
        amountMoney: totalMoney,

        // amountMoney: {
        //     amount: 100, // $1.00 charge
        //     currency: 'USD'
        // },

        locationId: "LAZSTD2P84MEA",
        idempotencyKey: idempotency_key
    };

    try {
        var response = await paymentsApi.createPayment(requestBody);
        return response.result
    } catch (error) {
        // let errorResult = null;

        // if (error instanceof ApiError) {
        //     errorResult = error.errors;
        // } else {
        //     errorResult = error;
        // }

        throw error

    }

}

module.exports = pay
