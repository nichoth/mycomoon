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
    const catalogApi = client.catalogApi;
    const cursor = ''
    const types = "ITEM,ITEM_VARIATION,CATEGORY,IMAGE"
    // const catalogVersion = 126;

    try {
        const { result, ...httpResponse } = await catalogApi.listCatalog(
            cursor, types);
        // const { result, ...httpResponse } = await catalogApi.listCatalog(
        //     cursor, types/*, catalogVersion*/);
        console.log('result', result)
        // console.log('objects', result.objects)
        // console.log('response', httpResponse)
        console.log('stat code', httpResponse.statusCode)
        // Get more response info...
        // const { statusCode, headers } = httpResponse;
    } catch (error) {
        console.log('errrrrr', error)
    }

}

try {
    handler({
        queryStringParameters: {}
    })
} catch (err) {
    console.log('**errrrrrrrrrrrrrr**')
    console.log(err)
}




// now the inventory
var body = {
    catalogObjectIds: ['Q4UZQOY3XDUCVREVFXJAHQIU', 'XADSDDW5UKJLRYINTYCUSE4V']
    // locationIds: ['LTTBZ5XKA3MGS']
}

const inv = async () => {
    const inventoryApi = client.inventoryApi;

    try {
        const { result, ...httpResponse } =
            await inventoryApi.batchRetrieveInventoryCounts(body);
        console.log('inventory', result)
        console.log('inv stat code', httpResponse.statusCode)
    } catch(error) {
        console.log('err in inv', error)
    }
}

try {
    inv()
} catch (err) {
    console.log('inv **errrrrrrrrrrrrrr**')
    console.log(err)
}