var util = require('./netlify/functions/util')

util.getImages()
    .then(res => {
        console.log('***res***', res)
    })
    .catch(err => console.log('errrr', err))
