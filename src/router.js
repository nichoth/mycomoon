var router = require('ruta3')()
var Checkout = require('./view/checkout')
var CartPage = require('./view/cart')
var SingleProductView = require('./view/single-product')
// var Products = require('./view/products')
var AboutPage = require('./view/about')
// var IndexView = require('./view/index')
var evs = require('./EVENTS')
import { html } from 'htm/preact'

// function HomeView () {
//     return html`
//         <p class="home-text" id="home">
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
//             do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//         </p>
//     `
// }

function Router (state, bus) {

    router.addRoute('/', () => {
        return {
            view: () => html`<p>ok</p>`
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
                        return res
                    })
            },

            slug: '',

            view: SingleProductView
        }
    })

    router.addRoute('/:slug', ({ params }) => {
        var { slug } = params

        console.log('current url in :slug route', window.location.href)

        return {
            getContent: function () {
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

            // view: IndexView
            view: SingleProductView
        }
    })

    return router
}

module.exports = Router
