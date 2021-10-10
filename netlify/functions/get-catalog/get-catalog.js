require('dotenv').config()
const Commerce = require('@chec/commerce.js')

const handler = async () => {
    const commerce = new Commerce(process.env.CHEC_PUBLIC);
    try {
        var products = await commerce.products.list()
    } catch (err) {
        return {
            statusCode: 500,
            body: 'oh no'
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify(products.data)
    }
}

module.exports = { handler }
