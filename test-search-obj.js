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
    objectTypes: ['ITEM'],
    includeRelatedObjects: true,
    exactQuery: {
        "attributeName": "itemData.name",
        "attributeValue": "test mushroom"
    }
    // query: 'test'
    // textQuery: 'test'
    // textQuery: {
    //     "keywords": [
    //         "test"
    //     ]
    // }
}

async function search () {
    const { result } = await catalogApi.searchCatalogObjects(body)
    return result;
}


var stringer = (key, value) => {
    return typeof value === "bigint" ? value.toString() + "n" : value
}

search()
    .then(res => {
        // console.log('**search**', JSON.stringify(res, stringer, 2))
        console.log('**res**', JSON.stringify(res, stringer, 2))
        console.log('length', res.objects.length)
        // console.log('search', res)
    })
    .catch(err => console.log('oh no', err))