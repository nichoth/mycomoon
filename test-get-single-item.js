var getItem = require('./netlify/functions/get-single-item/get-single-item')
// var util = require('./netlify/functions/util')
var { handler } = getItem

handler({ queryStringParameters: {
    slug: 'test-slug'
}})
    .then(res => {
        var _res = JSON.parse(res.body)
        // console.log('***resss***', _res)
        console.log('***res***', _res)
        // gotThem()
    })
    .catch(err => console.log('!!!errrr!!!', err))
