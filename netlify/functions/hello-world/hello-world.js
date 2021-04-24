const { Client, Environment } = require('square')

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
})

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {

  console.log('envvvv', process.env.SQ_SANDBOX_APP_ID)
  // console.log('client', client)

  try {
    const subject = event.queryStringParameters.name || 'World'
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Hello ${subject}`,
        appId: process.env.SQ_SANDBOX_APP_ID
      }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }

