require('dotenv').config()
const { Client, Environment } = require('square')

const client = new Client({
    environment: Environment.Sandbox,
    accessToken: process.env.SQ_ACCESS_TOKEN
})

const handler = async (event, ctx, cb) => {
    var body = JSON.parse(event.body)

    try {
        const response = await client.inventoryApi.batchRetrieveInventoryCounts({
            catalogObjectIds: body.catalogObjectIds,
            // our one location ID

            locationIds: [ 'LTTBZ5XKA3MGS' ]
        });
      
        console.log('**inv response.result**', response.result);

        var list = (response.result && response.result.counts)
        var res = (list || []).reduce((acc, item) => {
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
