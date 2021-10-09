import { useState, useEffect } from 'preact/hooks';
import { html } from 'htm/preact'
var { ITEMS } = require('../CONSTANTS')
var _path = require('path')

// we are setting the 'active' class after the request resolves,
// needs to happend before then

function SingleProductView (props) {
    // var { slug, cart, route } = props
    var { cart, content, route } = props
    // var slug = item && item.permalink
    var [cartState, setCartState] = useState(cart.state())
    var item = content

    // subscribe to any changes in the shopping cart
    useEffect(() => {  // component did mount
        setCartState(cart.state())
        return cart.state(function onChange (newCartState) {
            setCartState(newCartState)
        })
    }, [])

    useEffect(() => {
        console.log('blaaaa', route)
        var path = route.route
        var contentClass = (path === '/' || path === '') ?
            'index' :
            _path.basename(path)

        if (path === '/') {
            document.getElementById('home').scrollIntoView()
        }

        var dirs = path.split('/').filter(Boolean)
        var isProdPage = (dirs.length === 1 && dirs[0] !== 'products' &&
            dirs[0] !== 'about' && dirs[0] !== 'cart')
        if (isProdPage) contentClass += ' product-page'

        var el = document.getElementById('content')
        el.className = contentClass
        document.body.className = contentClass
    }, [route])

    function addToCart (item, ev) {
        ev.preventDefault()

        var _item = {
            itemId: item.id,
            slug: slug,
            name: item.name,
            price: item.price,
            quantity: 1,
            quantityAvailable: parseInt(item.inventory.available),
            imageData: item.media
        }

        // here, check & adjust the quantity if necessary
        var i = cart.state().products.findIndex(prod => {
            return prod.itemId === item.id
        })

        if (i > -1) {
            var product = cart.state().products[i]

            if ((product.quantity + 1) > product.quantityAvailable) {
                return
            }

            cart.changeQuantity(i, product.quantity + 1)
            return
        }

        cart.add(_item)
    }

    // get the quantity of each item that is in the cart
    var prodsInCart = cartState ? 
        cartState.products.reduce((acc, prod) => {
            acc[prod.itemId] = prod.quantity
            return acc
        }, {}) :
        null

    // here we use the `item` from state
    return html`<div class="single-product">
        <h2 id="products">Products</h2>
        <div class="single-product-info">
            <${ProductList} slug=${route.slug} item=${item}
                route=${route.route} addToCart=${addToCart}
                prodsInCart=${prodsInCart}
            />
        </div>
    </div>`
}

// this view is used for the list of products,
// single products


function ProductList (props) {
    var { slug, prodsInCart, addToCart, route, item } = props

    useEffect(() => {
        var el = document.querySelector('.product-list li.active a')

        if (el && item) {
            // console.log('scrolling', el, item)
            el.scrollIntoView()
        }

        if (route === '/products') {
            console.log('prods')
            document.getElementById('products').scrollIntoView(true)
        }
    }, [slug, (item && item.permalink)])

    function handleClck (ev) {
        ev.target.scrollIntoView()
    }

    // so the page layout doesn't get as bad when you're loading a product
    item = props.item || { foo: 'bar' }

    return html`<ul class="product-list">
        ${ITEMS.map(_item => {
            var isActive = _item.link === slug

            return html`<li class=${isActive ? 'active' : ''}>
                <a href=${isActive ?
                    '/products' :
                    '/' + _item.link}
                    onclick=${handleClck}
                >
                    ${_item.name}
                </a>

                ${(isActive && item) ?
                    html`
                    <img src="${item.media && item.media.source}"
                        alt="mushroom"
                        class="inline-image"
                    />
                    
                    <div class="item-description">
                        <div class="desc"
                            dangerouslySetInnerHTML=${{
                                __html: item.description
                            }}
                        ></div>
                        <${DualExtracted} />
                    </div>

                    <div class="bonus-info">
                        <div class="bonus-info-tab">
                            <span>Organic</span>
                            <span class="star-icon">
                                <img src="/img/star.png" />
                            </span>
                            <span>non-GMO</span>
                        </div>
                        <div class="bonus-info-tab">
                            <span>Vegan</span>
                            <span class="moon-icon">
                                <img src="/img/moon.png" />
                            </span>
                            <span>made in USA</span>
                        </div>
                    </div>

                    ${item ?
                        html`<${CartControls} item=${_item} product=${item}
                            cart=${cart} quantity=${prodsInCart[item.id]}
                            prodsInCart=${prodsInCart}
                            onAddToCart=${addToCart}
                        />` :
                        null
                    }` :

                    null
                }
            </li>`
        })}
    </ul>`
}

function DualExtracted () {
    return html`<div class="dual-extracted">
        <img src="/img/dual-extracted_1.svg" alt="dual extracted" />
    </div>`
}

function CartControls (props) {
    var { product, prodsInCart, onAddToCart } = props

    var count = (prodsInCart[product.id] || 0)
    var price = (product.price && product.price.formatted_with_symbol)

    return html`<div class="cart-controls">
        <span class="price">${price}</span>
        <span>${count} in cart</span> 
        <button onClick=${onAddToCart} class="cart-add">add to cart</button>
    </div>`
}

module.exports = SingleProductView
