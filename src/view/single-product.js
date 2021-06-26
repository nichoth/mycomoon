import { useState, useEffect } from 'preact/hooks';
import { html } from 'htm/preact'

function createSingleProductView ({ slug }) {

    return function SingleProductView (props) {
        var { getContent, cart } = props
        const [item, setItem] = useState(null)
        var [cartState, setCartState] = useState(null)

        console.log('cart state', cart.state())
        console.log('item state', item)

        // comppnent did mount
        useEffect(() => {
            getContent()
                .then(res => {
                    console.log('**res**', res)
                    setItem(res)
                })
                .catch(err => console.log('errrr', err))
        }, []);

        // component did mount
        useEffect(() => {
            setCartState(cart.state())
            return cart.state(function onChange (newCartState) {
                setCartState(newCartState)
            })
        }, [])

        if (!item) return null

        function addToCart (variation, ev) {
            ev.preventDefault()

            console.log('variation', variation)

            var _item = {
                itemId: item.id,
                // variationId: variation.id,
                slug: slug,
                name: item.name,
                // variationName: variation.itemVariationData.name,
                price: variation.price,
                quantity: 1,
                quantityAvailable: parseInt(variation.inventory.available),
                imageData: item.media
            }

            // here, check & adjust the quantity if necessary
            var i = cart.state().products.findIndex(prod => {
                return prod.itemId === variation.id
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

        // get the number of variations that are in the cart
        var prodsInCart = cartState.products.reduce((acc, prod) => {
            console.log('prod', prod)
            acc[prod.itemId] = prod.quantity
            return acc
        }, {})

        console.log('prods in cart', prodsInCart)

        return html`<div class="single-product">
            <h1>${item.name}</h1>
            <div class="single-product-content">
                <img src="${item.media.source}" alt="mushroom" />
                <p dangerouslySetInnerHTML=${{
                        __html: item.description
                    }}
                />

                <ul class="item-variations">
                    ${[item].map(function (v) {

                        var isInStock = !v.is.sold_out

                        return html`<li>
                            <span class="variation-name">
                                ${v.name + ' '}
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
                                <button
                                    disabled=${!isInStock}
                                    onClick=${addToCart.bind(null, v)}
                                >
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

module.exports = createSingleProductView

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
