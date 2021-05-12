var router = require('ruta3')()
var Checkout = require('./view/checkout')
var CartPage = require('./view/cart')
var createSingleProductView = require('./view/single-product')
var Products = require('./view/products')
var AboutPage = require('./view/about')
// var createIndexView = require('./view/index')
var IndexView = require('./view/index')

function Router (/*order*/) {

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
            view: IndexView
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

            // view: createIndexView('products')
            view: IndexView
        }
    })

    router.addRoute('/:slug', ({ params }) => {
        var { slug } = params

        return {
            getContent: function () {
                var url = new URL('/.netlify/functions/get-single-item', location)
                url.searchParams.append('slug', slug)

                return fetch(url)
                    .then(res => {
                        return res.json()
                    })
                    .catch(err => {
                        console.log('oh no', err)
                    })
            },

            view: createSingleProductView({ slug })
        }
    })




    // we're going to just set some state in the `checkout` route instead

    // need to put the order object into the app state
    // router.addRoute('/success', (/*{ params }*/) => {
    //     // var { orderId } = params

    //     return {
    //         getContent: function noop () {},
    //         view: function (props) {
    //             var { order } = props
    //             console.log('in the success view', props)
    //             console.log('the order', props.order)
    //             return html`<div class="success">
    //                 <p>good job</p>
    //                 <pre>${orderId + JSON.stringify(order(), null, 2)}</pre>
    //             </div>`
    //         }
    //     }
    // })





    return router
}

module.exports = Router
