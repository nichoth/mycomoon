const { Client, Environment } = require('square');

const client = new Client({
    environment: Environment.Sandbox,
    // accessToken: process.env.SQUARE_ACCESS_TOKEN,
    // accessToken: 'EAAAEDjayT7mAyyiqdNpLs_fD72uRTNq9FXwQ6nbDibhn-JHL62hwB-DuZQEs0I2'

    // this is from the 'sandbox test account'
    // this one works
    accessToken: 'EAAAENYzIzAS3PZdZBlqqj72RLqwdGpNt-3f-1mR7F1ZKy21bRI1IXpFMPAPGN07'
})


var cat;
var inv;


// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {
    const catalogApi = client.catalogApi;
    const cursor = ''
    // const types = "ITEM,ITEM_VARIATION,CATEGORY,IMAGE"
    const types = "ITEM,CATEGORY,IMAGE"
    // const catalogVersion = 126;

    try {
        const { result, ...httpResponse } = await catalogApi.listCatalog(
            cursor, types);
        // const { result, ...httpResponse } = await catalogApi.listCatalog(
        //     cursor, types/*, catalogVersion*/);

        // console.log('result', result)

        // var stringer = (key, value) => {
        //     return typeof value === "bigint" ? value.toString() + "n" : value
        // };

        // console.log('objects', JSON.stringify(result.objects, stringer, 2))

        console.log('cat stat code', httpResponse.statusCode)

        return result

        // Get more response info...
        // const { statusCode, headers } = httpResponse;
    } catch (error) {
        console.log('errrrrr', error)
    }

}

var res = handler({
    queryStringParameters: {}
})
res.then(_res => {
    // console.log('**resresres**', _res)
    var catItems = _res.objects
    // console.log('**cats**', catItems)
    cat = catItems
    if (inv) gotThem(catItems, inv)
}).catch(err => {
    console.log('**errrrrrrrrrrrrrr**')
    console.log(err)
})


function gotThem (catalog, inventory) {
    console.log('got them')

    // inventory by catalog item ID
    var _inv = inventory.counts.reduce((acc, invItem) => {
        acc[invItem.catalogObjectId] = invItem
        return acc
    }, {})


    catalog.forEach(cat => {
        if (cat.type !== 'ITEM') return
        cat.itemData.variations.forEach(variation => {
            var id = variation.id
            variation.quantityAvailable = _inv[id].quantity
        })
    })


    var images = catalog.reduce((acc, obj) => {
        // this maps the catalog item id to an image
        if (obj.type === 'IMAGE') {
            acc[obj.id] = obj
        }
        return acc
    }, {})

    var stringer = (key, value) => {
        return typeof value === "bigint" ? value.toString() + "n" : value
    }

    console.log('****cat', JSON.stringify(catalog, stringer, 2))

    // a map of all product variations, indexed by variationId
    // var variations = catalog.reduce((acc, catItem) => {
    //     if (catItem.type !== 'ITEM') return acc
    //     var variants = catItem.itemData.variations
    //     variants.forEach(v => (acc[v.id] = v))
    //     return acc
    // }, {})

    // this is a list of `variations` b/c thats what the inventory is of
    // var withStock = inventory.counts.map(({ catalogObjectId, quantity }) => {
    //     variations[catalogObjectId].quantity = quantity
    //     return variations[catalogObjectId]
    // })

    // console.log('got them catalog', JSON.stringify(catalog, stringer, 2))
    // console.log('got them with stock', withStock)
    // console.log('got them variations', JSON.stringify(variations, stringer, 2))
    console.log('got them images', images)
    console.log('got them inventory', inventory)


    // we want a list of products with nested variation & quanitity
}




// first get the catalog, then can get the inventory for each catalog item
// get inv for each where type === 'ITEM_VARIATION'


// catalog response
// shows the link between variation and item
// item variation has itemVariationData.itemId
// result.objects
// {
//     type: 'ITEM',
//     id: 'YEUQ7F6NHHZTFO666FQ5CUVI',
//     updatedAt: '2021-04-24T19:33:31.272Z',
//     version: 1619292811272n,
//     isDeleted: false,
//     presentAtAllLocations: true,
//     imageId: 'DCID4DTGFOMPHAADEYE453AH',
//     itemData: {
//       name: 'test mushroom',
//       description: 'a description of the mushroom',
//       variations: 

    // [
    //     {
    //       "type": "ITEM_VARIATION",
    //       "id": "Q4UZQOY3XDUCVREVFXJAHQIU",
    //       "updatedAt": "2021-04-24T19:19:23.56Z",
    //       "version": "1619291963560n",
    //       "isDeleted": false,
    //       "presentAtAllLocations": true,
    //       "itemVariationData": {
    //         "itemId": "YEUQ7F6NHHZTFO666FQ5CUVI",
    //         "name": "Regular",
    //         "ordinal": 1,
    //         "pricingType": "FIXED_PRICING",
    //         "priceMoney": {
    //           "amount": "1300n",
    //           "currency": "USD"
    //         },
    //         "locationOverrides": [
    //           {
    //             "locationId": "LAZSTD2P84MEA",
    //             "trackInventory": true
    //           }
    //         ]
    //       }
    //     },
    //     {
    //       "type": "ITEM_VARIATION",
    //       "id": "XADSDDW5UKJLRYINTYCUSE4V",
    //       "updatedAt": "2021-04-24T19:33:31.272Z",
    //       "version": "1619292811272n",
    //       "isDeleted": false,
    //       "presentAtAllLocations": true,
    //       "itemVariationData": {
    //         "itemId": "YEUQ7F6NHHZTFO666FQ5CUVI",
    //         "name": "foo variation",
    //         "ordinal": 2,
    //         "pricingType": "FIXED_PRICING",
    //         "priceMoney": {
    //           "amount": "1400n",
    //           "currency": "USD"
    //         },
    //         "locationOverrides": [
    //           {
    //             "locationId": "LAZSTD2P84MEA",
    //             "trackInventory": true,
    //             "inventoryAlertType": "LOW_QUANTITY",
    //             "inventoryAlertThreshold": "3n"
    //           }
    //         ]
    //       }
    //     }
    //   ],




//       productType: 'REGULAR',
//       skipModifierScreen: false
//     }
// },
//   {
//     type: 'ITEM_VARIATION',
//     id: 'Q4UZQOY3XDUCVREVFXJAHQIU',
//     updatedAt: '2021-04-24T19:19:23.56Z',
//     version: 1619291963560n,
//     isDeleted: false,
//     presentAtAllLocations: true,
//     itemVariationData: {
//         itemId: 'YEUQ7F6NHHZTFO666FQ5CUVI',
//         name: 'Regular',
//         ordinal: 1,
//         pricingType: 'FIXED_PRICING',
//         priceMoney: [Object],
//         locationOverrides: [Array]
//       }
//   },

// inv response
// {
//     catalogObjectId: 'Q4UZQOY3XDUCVREVFXJAHQIU',
//     catalogObjectType: 'ITEM_VARIATION',
//     state: 'IN_STOCK',
//     locationId: 'LAZSTD2P84MEA',
//     quantity: '6',
//     calculatedAt: '2021-04-24T19:19:25.4247Z'
// }


// when you have the catalog, map ITEMs with IMAGEs so the IMAGEs are nested
// get an object of ITEMs, with IMAGEs nested inside
// inventory should be on a per variation basis
// so someone makes an order for a list of variations
// could have a select list of variations on the product page
// the catalog response already has nested variations
// {
//      ...,
//      imageId: '',
//      imageData: { url },
// }



// now the inventory
// these are variation ids
var invBody = {
    catalogObjectIds: ['Q4UZQOY3XDUCVREVFXJAHQIU', 'XADSDDW5UKJLRYINTYCUSE4V',
        'BHRROLX5PDHPOLXANSIK4SWB']
}

const _inv = async () => {
    const inventoryApi = client.inventoryApi;

    try {
        const { result, ...httpResponse } =
            await inventoryApi.batchRetrieveInventoryCounts(invBody);
        // console.log('inventory', result)
        console.log('inv stat code', httpResponse.statusCode)
        return result
    } catch(error) {
        console.log('err in inv', error)
    }
}

_inv()
    .then(invRes => {
        inv = invRes
        if (cat) gotThem(cat, invRes)
    })
    .catch(err => {
        console.log('inv errrr', err)
    })



// go through the catalog response, and map the item_variations to quntity