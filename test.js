require('dotenv').config({
    path: __dirname + '/.env.example'
})
var { ApiError, Client, Environment } = require('square')
 
// Create an instance of the API Client 
// and initialize it with the credentials 
// for the Square account whose assets you want to manage
const client = new Client({
  timeout:3000,
  environment: Environment.Sandbox,
//   accessToken: process.env.SQ_SANDBOX_APP_SECRET

    // this on works
    // the one from the 'sandbox account'
    // https://developer.squareup.com/apps
//   accessToken: 'EAAAENYzIzAS3PZdZBlqqj72RLqwdGpNt-3f-1mR7F1ZKy21bRI1IXpFMPAPGN07'

    // this one works
    // the one from the 'real' site
    // https://developer.squareup.com/apps/sq0idp-tQkeBZJNjlKlfjdxvaBxFg/settings
    accessToken: 'EAAAEDjayT7mAyyiqdNpLs_fD72uRTNq9FXwQ6nbDibhn-JHL62hwB-DuZQEs0I2'
})
 
// Get an instance of the Square API you want call
const { locationsApi } = client

// Create wrapper async function 
const getLocations = async () => {
  // The try/catch statement needs to be called from within an asynchronous function
  try {
    // Call listLocations method to get all locations in this Square account
    let listLocationsResponse = await locationsApi.listLocations()

    // Get first location from list
    let firstLocation = listLocationsResponse.result.locations[0]

    console.log("Here is your first location: ", firstLocation)
  } catch (error) {
    if (error instanceof ApiError) {
      console.log("There was an error in your request: ", error.errors)
    } else {
      console.log("Unexpected Error: ", error)
    }
  }
}

// Invokes the async function
getLocations()
