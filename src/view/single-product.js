import { useState, useEffect } from 'preact/hooks';
import { html } from 'htm/preact'

var ITEMS = [
    { link: 'turkey-tail-tincture', name: 'Turkey Tail Tincture' },
    { link: 'chaga-tincture', name: 'Chaga Tincture' },
    { link: 'lions-mane-tincture', name: "Lion's Mane Tincture" },
    { link: 'reishi-tincture', name: "Reishi Tincture" }
]


// TODO -- should use global state for the product list,
// vs requesting each product when the route loads (which is what we're doing
// currently)
// could do this all in the route handler actually
// if !(state().item[slug]) return fetch and set
// setItem(state().item[slug])

function SingleProductView (props) {
    var { slug, getContent, cart } = props
    const [item, setItem] = useState(null)
    var [cartState, setCartState] = useState(null)
    var [menuIsOpen, setMenuOpen] = useState(false)

    // console.log('props', props)
    // console.log('slug', slug)
    // console.log('the item', item)
    // console.log('the cart', cart)

    // comppnent did mount
    // request the item from the server

    // todo:
    // keep global state of products, and get it from there if possible
    // compponent did update
    useEffect(() => {
        getContent()
            .then(res => {
                setItem(res)
            })
            .catch(err => console.log('errrr', err))
    });

    // component did mount
    // subscribe to any changes in the shopping cart
    useEffect(() => {
        setCartState(cart.state())
        return cart.state(function onChange (newCartState) {
            setCartState(newCartState)
        })
    }, [])

    if (!item) return null

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
    var prodsInCart = cartState.products.reduce((acc, prod) => {
        console.log('prod', prod)
        acc[prod.itemId] = prod.quantity
        return acc
    }, {})

    // var isInStock = !v.is.sold_out

    function closeMenu (ev) {
        ev.preventDefault()
        setMenuOpen(false)
    }

    function closeMenuAndNav (ev) {
        setMenuOpen(false)
    }

    if (menuIsOpen) return html`<div class="modal-nav-window">
        <div>
            <button onclick=${closeMenu} class="fas fa-times"></button>
        </div>
        <ul class="the-modal-menu">
            ${ITEMS.map(item => {
                return html`<li>
                    <a onclick=${closeMenuAndNav} href="/${item.link}">
                        ${item.name}
                    </a>
                </li>`
            })}
        </ul>
    </div>`

    return html`<div class="single-product">
        <div class="single-product-info">
            <${ProductList} slug=${slug} item=${item}
                prodsInCart=${prodsInCart} addToCart=${addToCart}
                setMenuOpen=${setMenuOpen}
            />
        </div>

        <hr class="special-divider" />

        <div class="single-product-content">
            <img src="${item.media.source}" alt="mushroom" />
        </div>
    </div>`
}

// needs permalink, description, name
function ProductList (props) {
    var { slug, item, prodsInCart, addToCart, setMenuOpen } = props
    var items = ITEMS

    return html`<ul class="product-list">
        ${items.map(_item => {
            var isActive = _item.link === slug

            return html`<li class=${isActive ? 'active' : ''}>
                <a href=${'/' + _item.link}>${_item.name}</a>
                ${isActive ?
                    html`<div class="item-description"
                        dangerouslySetInnerHTML=${{
                            __html: item.description
                        }}
                    ></div>

                    <${DualExtracted} />

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
                    <${CartControls} item=${_item} product=${item}
                        cart=${cart} quantity=${prodsInCart[item.id]}
                        prodsInCart=${prodsInCart}
                        onAddToCart=${addToCart}
                    />` :
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

    // return html`<div class="dual-extracted">
    //     <svg viewBox="0 0 100 120" fill="red">
    //         <path id="curve" d="M0,50a50,50 0 1,0 100,0a50,50 0 1,0 -100,0" stroke="white" fill="transparent"/>
    //         <path id="big-curve" d="M0,70a60,60 0 1,0 120,0a60,60 0 1,0 -140,0" stroke="transparent" fill="transparent"/>
    //         <text transform="translate(-39, 30) rotate(-33)">
    //             <textPath href="#big-curve" fill="white" stroke="transparent">
    //                 Dual Extracted
    //             </textPath>
    //         </text>
    //     </svg>
    // </div>`
}

function CartControls (props) {
    var { item, product, cart, prodsInCart, onAddToCart } = props

    // console.log('item in cart contorls', item)
    // console.log('product in cart contorls', product)

    var count = (prodsInCart[product.id] || 0)
    var price = product.price.formatted_with_symbol

    return html`<div class="cart-controls">
        <span class="price">${price}</span>
        <span>${count} in cart</span> 
        <button onClick=${onAddToCart} class="cart-add">add to cart</button>
    </div>`
}

module.exports = SingleProductView

function getReadableMoney (variation) {
    return variation.formatted_with_symbol
    // var price = variation.itemVariationData.priceMoney.amount
    // return toMoneyFormat(price)
}

// function toMoneyFormat (num) {
//     var format = (parseInt(num) / 100).toLocaleString("en-US", {
//         style: "currency",
//         currency: "USD"
//     })
//     return format
// }
