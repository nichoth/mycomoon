var router = require('ruta3')()
var Checkout = require('./view/checkout')
var CartPage = require('./view/cart')
var SingleProductView = require('./view/single-product')
var Products = require('./view/products')
var AboutPage = require('./view/about')
// var createIndexView = require('./view/index')
var IndexView = require('./view/index')
// const Commerce = require('@chec/commerce.js')

function Router () {

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
            },

            view: Products
        }
    })

    router.addRoute('/:slug', ({ params }) => {
        var { slug } = params

        return {
            getContent: function () {
                // var checKey = 'pk_test_183261c4e2a86741dc202b75c7956df699e0c2678d549'
                // const commerce = new Commerce(checKey);

                // return commerce.products.retrieve(slug, {
                //     type: 'permalink'
                // })
                //     .then(res => {
                //         console.log('res', res)
                //         return res
                //     })

                var url = new URL('/.netlify/functions/get-single-item', location)
                url.searchParams.append('permalink', slug)

                return fetch(url)
                    .then(res => {
                        return res.json()
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
