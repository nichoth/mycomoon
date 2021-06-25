const { Client, Environment } = require('square')

const client = new Client({
    environment: Environment.Sandbox,
    accessToken: 'EAAAEDjayT7mAyyiqdNpLs_fD72uRTNq9FXwQ6nbDibhn-JHL62hwB-DuZQEs0I2'
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
