require('dotenv').config()
// const { Client, Environment } = require('square')
import Commerce from '@chec/commerce.js';



const handler = async () => {
    const commerce = new Commerce(process.env.CHEC_PUBLIC);
    var products = await commerce.products.list()
    console.log('**products**', products)

    return {
        statusCode: 200,
        body: JSON.stringify(products)
    }
    
    // .then(product => {
    //     console.log(product)
    // });
}

module.exports = { handler }








// const client = new Client({
//     environment: Environment.Sandbox,
//     // this is from the 'sandbox test account'
//     // this one works
//     accessToken: process.env.SQ_ACCESS_TOKEN
// })

// // Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
// const handler = async (/* event */) => {
//     console.log('token', process.env.SQ_ACCESS_TOKEN)
//     const catalogApi = client.catalogApi;
//     const inventoryApi = client.inventoryApi;
//     const cursor = ''
//     // const types = "ITEM,ITEM_VARIATION,CATEGORY,IMAGE"
//     const types = "ITEM,CATEGORY,IMAGE"

//     var cats
//     try {
//         const { result } = await catalogApi.listCatalog(cursor, types);
//         console.log('**results**', result)
//         cats = result.objects
//     } catch (err) {
//         console.log('errrrr', err)
//         return {
//             statusCode: 500,
//             body: 'oh no'
//         }
//     }

//     var invBody = {
//         catalogObjectIds: (cats || []).reduce((acc, catItem) => {
//             if (catItem.type !== 'ITEM') return acc
//             return acc.concat(catItem.itemData.variations.map(variation => {
//                 return variation.id
//             }))
//         }, [])
//     };

//     var invRes
//     try {
//         invRes = await inventoryApi.batchRetrieveInventoryCounts(invBody);
//     } catch (err) {
//         console.log('err in here', err)
//         return {
//             statusCode: 500,
//             body: 'oh no'
//         }
//     }


//     // console.log('**aaaaa***', invRes.result);

//     // inventory by catalog item ID
//     var arr = (invRes.result && invRes.result.counts) || [];
//     // console.log('***rrrrrrrr***', arr);
//     var inv = arr.reduce((acc, invItem) => {
//         acc[invItem.catalogObjectId] = invItem;
//         return acc;
//     }, {});

//     // mutate each catalog item variation by adding a field
//     // `quantityAvailable`
//     (cats || []).forEach(cat => {
//         if (cat.type !== 'ITEM') return
//         cat.itemData.variations.forEach(variation => {
//             var id = variation.id
//             variation.quantityAvailable = inv[id].quantity
//         })
//     })

//     // images by imageId
//     var images = (cats || [])
//         .reduce((acc, item) => {
//             if (item.type !== 'IMAGE') return acc
//             acc[item.id] = item
//             return acc
//         }, {})

//     // mutate each catalog item by adding the image data
//     var _cats = (cats || []);
//     _cats.forEach(cat => {
//         if (cat.type !== 'ITEM') return;
//         cat.imageData = images[cat.imageId].imageData;
//     });


//     // -----------------------------------------


//     var stringer = (key, value) => {
//         return typeof value === "bigint" ? value.toString() + "n" : value
//     }

//     console.log('**cats**', JSON.stringify(cats, stringer, 2))

//     return {
//         statusCode: 200,
//         body: JSON.stringify((cats || {}), stringer, 2)
//         // // more keys you can return:
//         // headers: { "headerName": "headerValue", ... },
//         // isBase64Encoded: true,
//     }
// }

// module.exports = { handler }
