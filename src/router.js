var router = require('ruta3')()
var Checkout = require('./view/checkout')
var CartPage = require('./view/cart')
var SingleProductView = require('./view/single-product')
var AboutPage = require('./view/about')
var IndexView = require('./view')

// if we have the item, return it
// if not, request it then return it

function Router (state) {

    router.addRoute('/', () => {
        return {
            view: IndexView,
            slug: ''

        //     getContent: function () {
        //     //     var url = new URL('/.netlify/functions/get-single-item', location)
        //     //     url.searchParams.append('permalink', slug)

        //     //     return fetch(url)
        //     //         .then(res => {
        //     //             return res.json()
        //     //         })
        //     //         .then(json => {
        //     //             bus.emit(evs.product.got, json)
        //     //             return json
        //     //         })
        //     //         .catch(err => {
        //     //             console.log('oh no', err)
        //     //         })
        //     // },
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
        // console.log('**products route**')

        return {
            getContent: function () {
                return Promise.resolve(null)
            },

            slug: '',

            view: SingleProductView
        }
    })

    router.addRoute('/:slug', ({ params }) => {
        var { slug } = params

        return {
            slug: slug,
            view: SingleProductView
        }
    })

    return router
}

module.exports = Router
