var router = require('ruta3')()
import { useState, useEffect } from 'preact/hooks';
import { html } from 'htm/preact'
var Checkout = require('./view/checkout')
var CartPage = require('./view/cart')
var createSingleProductView = require('./view/single-product')

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

        view: function (props) {
            console.log('in products view', props)
            var { getContent } = props

            const [content, setContent] = useState(null)

            useEffect(() => {
                getContent()
                    .then(res => {
                        setContent(res)
                    })
                    .catch(err => console.log('errrr', err))
            }, []);

            console.log('products content', content)

            return html`<div>
                <h1>products page</h1>

                ${content ?
                    html`<ul class="products-list">
                        ${content
                            .filter(item => item.type === 'ITEM')
                            .map(item => {
                                if (item.customAttributeValues) {
                                    var key = Object.keys(item.customAttributeValues)[0]
                                    var slug = item.customAttributeValues[key].stringValue
                                }

                                return html`<li>
                                    <a href="/${slug}">
                                        <img src=${item.imageData.url}
                                            alt="mushroom" />
                                        <p>${item.itemData.name}</p>
                                    </a>
                                </li>`
                            })
                        }
                    </ul>` :
                    null
                }

            </div>`
        }
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

module.exports = router
