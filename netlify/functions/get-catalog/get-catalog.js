const { Client, Environment } = require('square')

const client = new Client({
    environment: Environment.Sandbox,
    // this is from the 'sandbox test account'
    // this one works
    accessToken: 'EAAAENYzIzAS3PZdZBlqqj72RLqwdGpNt-3f-1mR7F1ZKy21bRI1IXpFMPAPGN07'
})

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (/* event */) => {
    const catalogApi = client.catalogApi;
    const inventoryApi = client.inventoryApi;
    const cursor = ''
    // const types = "ITEM,ITEM_VARIATION,CATEGORY,IMAGE"
    const types = "ITEM,CATEGORY,IMAGE"

    var cats
    try {
        const { result } = await catalogApi.listCatalog(cursor, types);
        cats = result.objects
    } catch (err) {
        console.log('errrrr', err)
        return {
            statusCode: 500,
            body: 'oh no'
        }
    }

    var invBody = {
        catalogObjectIds: cats.reduce((acc, catItem) => {
            if (catItem.type !== 'ITEM') return acc
            return acc.concat(catItem.itemData.variations.map(variation => {
                return variation.id
            }))
        }, [])
    }

    var invRes
    try {
        invRes = await inventoryApi.batchRetrieveInventoryCounts(invBody);
    } catch (err) {
        console.log('err in here', err)
        return {
            statusCode: 500,
            body: 'oh no'
        }
    }

    // inventory by catalog item ID
    var inv = invRes.result.counts.reduce((acc, invItem) => {
        acc[invItem.catalogObjectId] = invItem
        return acc
    }, {})

    // mutate each catalog item variation by adding a field
    // `quantityAvailable`
    cats.forEach(cat => {
        if (cat.type !== 'ITEM') return
        cat.itemData.variations.forEach(variation => {
            var id = variation.id
            variation.quantityAvailable = inv[id].quantity
        })
    })

    // -----------------------------------------

    var stringer = (key, value) => {
        return typeof value === "bigint" ? value.toString() + "n" : value
    }

    return {
        statusCode: 200,
        body: JSON.stringify(cats, stringer, 2)
        // // more keys you can return:
        // headers: { "headerName": "headerValue", ... },
        // isBase64Encoded: true,
    }
}

module.exports = { handler }
