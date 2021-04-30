const { Client, Environment } = require('square')
// const fetch = require('node-fetch');
var accessToken = 'EAAAENYzIzAS3PZdZBlqqj72RLqwdGpNt-3f-1mR7F1ZKy21bRI1IXpFMPAPGN07'

const client = new Client({
    environment: Environment.Sandbox,
    // this is from the 'sandbox test account'
    // this one works
    accessToken: accessToken
})

const catalogApi = client.catalogApi;

var body = {
    limit: 100,

    customAttributeFilters: [
        {
            // `stringFilter` would come from the request body or query string
            "stringFilter": "test-slug",
            // i got this id value from the `test-list-catalog` response
            // not sure if it is visible in the square UI
            // this id maps to `slug`
            "customAttributeDefinitionId": "7KFDYZ54EAWBQ64SGDFIASRK",
        }
    ]
}

async function search () {
    const { result } = await catalogApi.searchCatalogItems(body)
    return result;
}

var stringer = (key, value) => {
    return typeof value === "bigint" ? value.toString() + "n" : value
}

search()
    .then(res => {
        // console.log('**search**', JSON.stringify(res, stringer, 2))
        console.log('**res**', JSON.stringify(res.items, stringer, 2))
        console.log('length', res.items.length)
        // console.log('search', res)
    })
    .catch(err => console.log('oh no', err))


// module.exports = { handler }
