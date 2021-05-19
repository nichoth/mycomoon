const { Client, Environment } = require('square')

const client = new Client({
    environment: Environment.Sandbox,
    accessToken: 'EAAAENYzIzAS3PZdZBlqqj72RLqwdGpNt-3f-1mR7F1ZKy21bRI1IXpFMPAPGN07'
})

const handler = async (event, ctx, cb) => {
    var body = JSON.parse(event.body)

    try {
        const response = await client.inventoryApi.batchRetrieveInventoryCounts({
            catalogObjectIds: body.catalogObjectIds,
            // our one location ID
            locationIds: [ 'LAZSTD2P84MEA' ]
        });
      
        console.log('**inv response.result**', response.result);

        var res = response.result.counts.reduce((acc, item) => {
            acc[item.catalogObjectId] = item
            return acc
        }, {})

        return {
            statusCode: 200,
            body: JSON.stringify(res)
        }
    } catch (error) {
        console.log('errrr', error);
        return {
            statusCode: 500,
            body: error
        }
    }


    // need to call square with the inventory ids
    // return the result

    // return square.getInv
    //     .then(res => {
    //         return {
    //             statusCode: 200,
    //             body: JSON.stringify({ })
    //         }
    //     })
}

module.exports = { handler }
