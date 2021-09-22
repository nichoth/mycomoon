import { useState, useEffect } from 'preact/hooks';
import { html } from 'htm/preact'
var { ITEMS } = require('../CONSTANTS')

function SingleProductView (props) {
    var { slug, getContent, cart } = props
    const [item, setItem] = useState(slug === '' ? '' : null)
    // const [catalog, setCatalog] = useState(null)
    var [cartState, setCartState] = useState(null)

    console.log('props', props)

    // todo:
    // keep global state of products, and get it from there if possible
    useEffect(() => {  // compponent did mount
        if (!slug) {
            // set the route to the first in the ITEMS list

            // do nothing

            // getContent()
            //     .then(res => {
            //         setCatalog(res)
            //     })
            //     .catch(err => console.log('errrr', err))
        } else {
            getContent()
                .then(res => {
                    setItem(res)
                })
                .catch(err => console.log('errrr', err))
        }
    }, [slug]);

    // subscribe to any changes in the shopping cart
    useEffect(() => {  // component did mount
        setCartState(cart.state())
        return cart.state(function onChange (newCartState) {
            setCartState(newCartState)
        })
    }, [])

    if (item === null) {
        return null
    }

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

    return html`<div class="single-product">
        <div class="single-product-info">
            <${ProductList} slug=${slug} item=${item}
                prodsInCart=${prodsInCart} addToCart=${addToCart}
            />
        </div>

        <hr class="special-divider" />

        <div class="single-product-content">
            ${(item && item.media && slug) ?
                html`<img src="${item.media.source}" alt="mushroom" />` :
                null
                // (catalog ?
                //     html`<ul class="products-list">
                //         ${catalog
                //         .filter(item => item.active)
                //         .map(item => {
                //             return html`<li>
                //                 <a href="/${item.permalink}">
                //                     <img src=${item.media.source}
                //                         alt="mushroom" />
                //                     <p>${item.name}</p>
                //                 </a>
                //             </li>`
                //         })}
                //     </ul>` :
                //     null
                // )
            }
        </div>
    </div>`
}

// needs permalink, description, name
function ProductList (props) {
    var { slug, item, prodsInCart, addToCart } = props

    console.log('in here', props)

    // here you return a link regardless of whether it's active
    return html`<ul class="product-list">
        ${ITEMS.map(_item => {
            var isActive = _item.link === slug

            return html`<li class=${isActive ? 'active' : ''}>
                <a href=${'/' + _item.link}>${_item.name}</a>

                ${isActive ?
                    html`<div class="item-description">
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
        <img src="/img/dual-extracted.png" alt="dual extracted" />
    </div>`
}

function CartControls (props) {
    var { product, prodsInCart, onAddToCart } = props

    var count = (prodsInCart[product.id] || 0)
    var price = product.price.formatted_with_symbol

    return html`<div class="cart-controls">
        <span class="price">${price}</span>
        <span>${count} in cart</span> 
        <button onClick=${onAddToCart} class="cart-add">add to cart</button>
    </div>`
}

module.exports = SingleProductView
