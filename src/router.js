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
                    <span>name: ${product.name || 'none'}, </span>
                    <span>price: ${product.price || 'none'}<//>
                `
            }
        }

        render (props) {
            console.log('render cart', props.cart)
            return html`
                <h1>the shopping cart</h1>
                <div class="cart-content" ref=${this.ref}></div>
            `
        }
    }

    return {
        view: CartPage
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
            var { getContent } = props
            const [item, setItem] = useState(null)

            useEffect(() => {
                getContent()
                    .then(res => setItem(res))
                    .catch(err => console.log('errrr', err))
            }, []);

            if (!item) return null

            function addToCart (ev) {
                ev.preventDefault()
                console.log('the cart', props.cart)
                var _item = {
                    name: item.itemData.name
                }
                console.log('added to cart', item, _item)
            }

            return html`<div class="single-product">
                <h1>${item.itemData.name}</h1>
                <div class="single-product-content">
                    <img src="${item.imageData.url}" alt="mushroom" />
                    <p>${item.itemData.description}</p>

                    <form onSubmit=${addToCart} class="item-controls">
                        <button type="submit">add to cart</button>
                    </form>
                </div>
            </div>`
        }
    }
})

module.exports = router
