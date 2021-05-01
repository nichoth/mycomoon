const { Client, Environment } = require('square');

const client = new Client({
    environment: Environment.Sandbox,
    // accessToken: process.env.SQUARE_ACCESS_TOKEN,
    // accessToken: 'EAAAEDjayT7mAyyiqdNpLs_fD72uRTNq9FXwQ6nbDibhn-JHL62hwB-DuZQEs0I2'

    // this is from the 'sandbox test account'
    // this one works
    accessToken: 'EAAAENYzIzAS3PZdZBlqqj72RLqwdGpNt-3f-1mR7F1ZKy21bRI1IXpFMPAPGN07'
})

async function getImages () {
    const types = "IMAGE"
    var cursor = ''
    const catalogApi = client.catalogApi;

    var res

    try {
        const {
            result,
            ...httpResponse
        } = await catalogApi.listCatalog( cursor, types);
        res = result.objects
    } catch (err) {
        throw err
    }

    return res
}

module.exports = {
    getImages
}
