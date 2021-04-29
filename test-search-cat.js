const { Client, Environment } = require('square')
const fetch = require('node-fetch');
var accessToken = 'EAAAENYzIzAS3PZdZBlqqj72RLqwdGpNt-3f-1mR7F1ZKy21bRI1IXpFMPAPGN07'

const client = new Client({
    environment: Environment.Sandbox,
    // this is from the 'sandbox test account'
    // this one works
    accessToken: 'EAAAENYzIzAS3PZdZBlqqj72RLqwdGpNt-3f-1mR7F1ZKy21bRI1IXpFMPAPGN07'
})

const catalogApi = client.catalogApi;

var body = {
    // textFilter: 'name',
    // custom_attribute_filter: {
    //     "custom_attribute_definition_id": "slug",
    //     'custom_attribute_definition_token': 'slug',
    //     "string_filter": "test-slug"
    // },
    
    customAttributeFilters: [
        {
            "custom_attribute_definition_token": 'slug',
            "string_filter": "test-slug"
        },
        {
            "custom_attribute_definition_id": "slug",
            "string_filter": "test-slug"
        },
        {
            "custom_attribute_definition_id": "VARIETAL_DEFINITION_ID",
            "selection_ids_filter": "MERLOT_SELECTION_ID"
        }
    //     // {
    //     //     "custom_attribute_definition_id": "BRAND_DEFINITION_ID",
    //     //     "string_filter": "Dark Horse"
    //     // },
    ]
    // stockLevels: []
}

async function search () {
    const { result } = await catalogApi.searchCatalogItems(body)

    return result;
}

// var stringer = (key, value) => {
//     return typeof value === "bigint" ? value.toString() + "n" : value
// }

search()
    .then(res => {
        // console.log('search', JSON.stringify(res.objects, stringer, 2))
        console.log('search', res)
    })
    .catch(err => console.log('oh no', err))




// fetch('https://connect.squareupsandbox.com/v2/catalog/search-catalog-items', {
//     method: 'POST',
//     body: JSON.stringify(body),
//     headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer ' + accessToken
//     },
// })
//     .then(res => res.json())
//     .then(res => {
//         console.log('old style api call', JSON.stringify(res.items, stringer, 2))
//     })




// module.exports = { handler }
