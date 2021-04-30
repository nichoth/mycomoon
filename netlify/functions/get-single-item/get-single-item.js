const { Client, Environment } = require('square')

const client = new Client({
    environment: Environment.Sandbox,
    // this is from the 'sandbox test account'
    // this one works
    accessToken: 'EAAAENYzIzAS3PZdZBlqqj72RLqwdGpNt-3f-1mR7F1ZKy21bRI1IXpFMPAPGN07'
})

const handler = async (event) => {
    const catalogApi = client.catalogApi;
    var { slug } = event.queryStringParameters

    var body = {
        limit: 100,

        customAttributeFilters: [
            {
                // `stringFilter` would come from the request body or query string
                "stringFilter": slug,
                // i got this id value from the `test-list-catalog` response
                // not sure if it is visible in the square UI
                // this id maps to `slug`
                "customAttributeDefinitionId": "7KFDYZ54EAWBQ64SGDFIASRK",
            }
        ]
    }

    var res
    try {
        const { result } = await catalogApi.searchCatalogObjects(body);
        res = result
    } catch (err) {
        console.log('err in here', err)
        return {
            statusCode: 500,
            body: err
        }
    }

    var stringer = (key, value) => {
        return typeof value === "bigint" ? value.toString() + "n" : value
    }

    return {
        statusCode: 200,
        body: JSON.stringify(res.items[0], stringer, 2)
        // // more keys you can return:
        // headers: { "headerName": "headerValue", ... },
        // isBase64Encoded: true,
    }
}

module.exports = { handler }
