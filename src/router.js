var router = require('ruta3')()
import { html } from 'htm/preact'
var Checkout = require('./view/checkout')
var CartPage = require('./view/cart')
var createSingleProductView = require('./view/single-product')
var Products = require('./view/products')

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

            view: function () {
                return html`<h1>Myco Moon</h1>
                    <ul class="main-nav">
                        <li><a href="/about">about</a></li>
                        <li><a href="/products">products</a></li>
                    </ul>
                `
            }
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

    // need to put the order object into the app state
    router.addRoute('/success', (/*{ params }*/) => {
        // var { orderId } = params

        return {
            getContent: function noop () {},
            view: function (props) {
                var { order } = props
                console.log('in the success view', props)
                console.log('the order', props.order)
                return html`<div class="success">
                    <p>good job</p>
                    <pre>${orderId + JSON.stringify(order(), null, 2)}</pre>
                </div>`
            }
        }
            

    })

    return router
}

module.exports = Router
