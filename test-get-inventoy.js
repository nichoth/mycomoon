var util = require('./netlify/functions/util')

var { getInventory } = util

getInventory("Q4UZQOY3XDUCVREVFXJAHQIU")
    .then(res => {
        console.log('**res**', res)
    })
    .catch(err => console.log('err', err))
