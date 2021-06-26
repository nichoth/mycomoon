// require('dotenv').config()
// const { Client, Environment } = require('square')
// var util = require('../util')

// const client = new Client({
//     environment: Environment.Sandbox,
//     // this is from the 'sandbox test account'
//     // this one works
//     accessToken: process.env.SQ_ACCESS_TOKEN
// })

// const handler = async (event) => {
//     const catalogApi = client.catalogApi;
//     const inventoryApi = client.inventoryApi;
//     var { slug } = event.queryStringParameters

//     var body = {
//         limit: 100,

//         customAttributeFilters: [
//             {
//                 // `stringFilter` would come from the request body or query string
//                 "stringFilter": slug,
//                 // i got this id value from the `test-list-catalog` response
//                 // not sure if it is visible in the square UI
//                 // this id maps to `slug`
//                 "customAttributeDefinitionId": "7KFDYZ54EAWBQ64SGDFIASRK",
//             }
//         ]
//     }

//     async function getItem () {
//         var res

//         try {
//             const { result } = await catalogApi.searchCatalogItems(body);
//             res = result
//         } catch (err) {
//             console.log('err in here', err)
//             return {
//                 statusCode: 500,
//                 body: err
//             }
//         }

//         return res.items[0]
//     }

//     var item = await getItem()
//     var images = await util.getImages()
//     var img = images.find(_img => _img.id === item.imageId)
//     item.imageData = img.imageData


//     item.itemData.variations = await Promise.all(
//         item.itemData.variations.map(async v => {
//             v.inventory = await util.getInventory(v.id)
//             return v
//         })
//     )


//     var stringer = (key, value) => {
//         return typeof value === "bigint" ? value.toString() + "n" : value
//     }

//     return {
//         statusCode: 200,
//         body: JSON.stringify(item, stringer, 2)
//         // // more keys you can return:
//         // headers: { "headerName": "headerValue", ... },
//         // isBase64Encoded: true,
//     }
// }

// module.exports = { handler }
