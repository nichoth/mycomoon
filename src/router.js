var router = require('ruta3')()
import { useState, useEffect } from 'preact/hooks';
import { html, Component } from 'htm/preact'
import { createRef } from 'preact';

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
    class CartPage extends Component {
        constructor (props) {
            super(props)
            this.ref = createRef();
        }

        componentDidMount ()  {
            var { cart } = this.props
            cart.createPage(this.ref.current, mapper)

            function mapper (html, product) {
                console.log('in map', product)
                return html`
                    <span>${product.name + ' '}</span>
                    <span>${toMoneyFormat(product.price)}<//>
                `
            }
        }

        render (props) {
            return html`
                <h1>the shopping cart</h1>
                <div class="cart-content" ref=${this.ref}></div>
                <div class="cart-controls">
                    <a class="pay" href="/cart/checkout">pay for them</a>
                </div>
            `
        }
    }

    return {
        view: CartPage
    }
})

router.addRoute('/cart/checkout', () => {
    console.log('**checkout**')

    function Checkout (props) {
        console.log('checkout', props)
        return html`<div>
            checkout
        </div>`
    }

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
    return {
        getContent: function () {
            var { slug } = params
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

        view: function SingleProductView (props) {
            var { getContent, cart } = props
            const [item, setItem] = useState(null)

            useEffect(() => {
                getContent()
                    .then(res => setItem(res))
                    .catch(err => console.log('errrr', err))
            }, []);

            if (!item) return null

            function addToCart (variation, ev) {
                ev.preventDefault()
                console.log('the cart', props.cart)

                var _item = {
                    itemId: item.id,
                    variationId: variation.id,
                    name: item.itemData.name,
                    variationName: variation.itemVariationData.name,
                    price: parseInt(variation.itemVariationData.priceMoney
                        .amount)
                }

                cart.add(_item)
                console.log('cart state', cart.state())

                console.log('added to cart', item, _item)
            }

            // in here, show a list of variations with an 'add' button 
            // for each

            return html`<div class="single-product">
                <h1>${item.itemData.name}</h1>
                <div class="single-product-content">
                    <img src="${item.imageData.url}" alt="mushroom" />
                    <p>${item.itemData.description}</p>

                    <ul class="item-variations">
                        ${item.itemData.variations.map(function (v) {
                            return html`<li>
                                <span class="variation-name">
                                    ${v.itemVariationData.name + ' '}
                                </span>
                                <span class="price-money">
                                    ${getReadableMoney(v)}
                                </span>
                                <button onClick=${addToCart.bind(null, v)}>
                                    add to cart
                                </button>
                            </li>`
                        })}
                    </ul>

                </div>
            </div>`
        }
    }
})

function toMoneyFormat (num) {
    var format = (parseInt(num) / 100).toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    })
    console.log('formatted money', format)
    return format
}

function getReadableMoney (variation) {
    var price = variation.itemVariationData.priceMoney.amount
    return toMoneyFormat(price)
}

module.exports = router
