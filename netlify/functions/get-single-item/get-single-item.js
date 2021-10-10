require('dotenv').config()
const Commerce = require('@chec/commerce.js')


const handler = async (event) => {
    const commerce = new Commerce(process.env.CHEC_PUBLIC);
    var { permalink } = event.queryStringParameters

    try {
        var item = await commerce.products.retrieve(permalink, {
            type: 'permalink'
        })

        // console.log('item', item)

        return {
            statusCode: 200,
            body: JSON.stringify(item)
        }
    } catch(err) {
        return {
            statusCode: 500,
            body: 'oh no'
        }
    }
}

module.exports = { handler }
