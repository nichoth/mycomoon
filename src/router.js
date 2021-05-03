var router = require('ruta3')()
import { useState, useEffect } from 'preact/hooks';
import { html, Component } from 'htm/preact'
import { createRef } from 'preact';
// import EVENTS from '@nichoth/shopping-cart/src/EVENTS'

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
            this.state = props.cart.state()
        }

        componentDidMount ()  {
            var { cart } = this.props

            var self = this
            cart.state(function onChange (newState) {
                self.setState(newState)
            })

            function changeQuantity (i, ev) {
                var n = parseInt(ev.target.value)
                cart.changeQuantity(i, n)
            }

            cart.createPage(this.ref.current, mapper)

            function mapper (html, prod, i) {
                return html`<form>
                    <span>${prod.name + ' -- ' + prod.variationName}</span>
                    <input type="number" min="0" max="${prod.quantityAvailable}"
                        value=${prod.quantity}
                        onChange=${changeQuantity.bind(null, i)}
                    />
                    <span>${toMoneyFormat(prod.price) + 'ea'} × ${prod.quantity}
                    <//>
                </form>`
            }
        }

        render (props) {
            var { products } = props.cart.state()

            var total = products.reduce(function (total, prod) {
                return total + (prod.price * prod.quantity)
            }, 0)

            return html`
                <h1>the shopping cart</h1>
                <div class="cart-content" ref=${this.ref}></div>
                <div class="cart-totals">
                    <span class="total-money">
                        total ${toMoneyFormat(total)}
                    </span>
                </div>
                <div class="cart-controls">
                    ${products.length ?
                        (html`<a class="pay" href="/cart/checkout">
                            pay for them
                        </a>`) :
                        (html`<span class="pay">
                            pay for them
                        </span>`)
                    }
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
            var [cartState, setCartState] = useState(null)

            console.log('state', cart.state())

            useEffect(() => {
                getContent()
                    .then(res => setItem(res))
                    .catch(err => console.log('errrr', err))
            }, []);

            useEffect(() => {
                setCartState(cart.state())
                return cart.state(function onChange (newCartState) {
                    setCartState(newCartState)
                })
            }, [])

            if (!item) return null

            function addToCart (variation, ev) {
                ev.preventDefault()
                console.log('the cart', props.cart)

                console.log('variation', variation)

                var _item = {
                    itemId: item.id,
                    variationId: variation.id,
                    name: item.itemData.name,
                    variationName: variation.itemVariationData.name,
                    price: parseInt(variation.itemVariationData.priceMoney
                        .amount),
                    quantity: 1,
                    quantityAvailable: parseInt(variation.inventory[0].quantity)
                }

                // here, check & adjust the quantity if necessary
                var i = cart.state().products.findIndex(prod => {
                    return prod.variationId === variation.id
                })

                if (i > -1) {
                    var product = cart.state().products[i]
                    cart.changeQuantity(i, product.quantity + 1)
                    console.log('i > -1', cart.state())
                    return
                }

                cart.add(_item)
                console.log('cart state', cart.state())

                console.log('added to cart', item, _item)
            }

            // get the number of variations that are in the cart
            var prodsInCart = cartState.products.reduce((acc, variant) => {
                acc[variant.variationId] = variant.quantity
                return acc
            }, {})

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
                                <span class="variation-controls">
                                    ${prodsInCart[v.id] ?
                                        html`<span class="prod-count">
                                            ${prodsInCart[v.id]}
                                        </span>` :
                                        null
                                    }
                                    <button onClick=${addToCart.bind(null, v)}>
                                        add to cart
                                    </button>
                                </span>
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
    return format
}

function getReadableMoney (variation) {
    var price = variation.itemVariationData.priceMoney.amount
    return toMoneyFormat(price)
}

module.exports = router
