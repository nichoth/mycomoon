const { Client, Environment } = require('square')

const client = new Client({
    environment: Environment.Sandbox,
    // this is from the 'sandbox test account'
    // this one works
    accessToken: 'EAAAENYzIzAS3PZdZBlqqj72RLqwdGpNt-3f-1mR7F1ZKy21bRI1IXpFMPAPGN07'
})

const handler = async (/* event */) => {
    const catalogApi = client.catalogApi;

    const {
        result,
        ...httpResponse
    } = await catalogApi.searchCatalogObjects(body);
}


module.exports = { handler }
