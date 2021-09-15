var router = require('ruta3')()
var Checkout = require('./view/checkout')
var CartPage = require('./view/cart')
var SingleProductView = require('./view/single-product')
// var Products = require('./view/products')
var AboutPage = require('./view/about')
var IndexView = require('./view/index')
var evs = require('./EVENTS')

function Router (state, bus) {

    router.addRoute('/', () => {
        return {
            getContent: function getHome () {
                return new Promise((resolve, _reject) => {
                    setTimeout(() => {
                        resolve('homeeeee')
                    }, 1000)
                })
            },

            view: IndexView
        }
    })

    router.addRoute('/about', () => {
        return {
            view: AboutPage
        }
    })


    router.addRoute('/cart', () => {
        return {
            view: CartPage
        }
    })

    router.addRoute('/cart/checkout', () => {
        return {
            view: Checkout
        }
    })

    router.addRoute('/products', () => {
        console.log('**products route**')

        return {
            getContent: function () {
                return fetch('/.netlify/functions/get-catalog')
                    .then(response => response.json())
                    .then(res => {
                        console.log('resp', res)
                        return res
                    })
            },

            slug: '',

            view: SingleProductView
        }
    })

    router.addRoute('/:slug', ({ params }) => {
        var { slug } = params

        console.log('in here', slug)

        return {
            getContent: function () {
                console.log('getting content')
                if (state().catalog && state().catalog[slug]) {
                    return Promise.resolve(state().catalog[slug])
                }

                var url = new URL('/.netlify/functions/get-single-item', location)
                url.searchParams.append('permalink', slug)

                return fetch(url)
                    .then(res => {
                        return res.json()
                    })
                    .then(json => {
                        bus.emit(evs.product.got, json)
                        return json
                    })
                    .catch(err => {
                        console.log('oh no', err)
                    })
            },

            slug: slug,

            view: SingleProductView
        }
    })

    return router
}

module.exports = Router
