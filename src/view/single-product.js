import { useState, useEffect } from 'preact/hooks';
import { html } from 'htm/preact'

function createSingleProductView ({ slug }) {

    return function SingleProductView (props) {
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

            console.log('variation', variation)

            var _item = {
                itemId: item.id,
                variationId: variation.id,
                slug: slug,
                name: item.itemData.name,
                variationName: variation.itemVariationData.name,
                price: parseInt(variation.itemVariationData.priceMoney
                    .amount),
                quantity: 1,
                quantityAvailable: parseInt(variation.inventory[0].quantity),
                imageData: item.imageData
            }

            console.log('__item', _item)

            // here, check & adjust the quantity if necessary
            var i = cart.state().products.findIndex(prod => {
                return prod.variationId === variation.id
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

                        var isInStock = v.inventory[0].quantity > 0

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
    var price = variation.itemVariationData.priceMoney.amount
    return toMoneyFormat(price)
}

function toMoneyFormat (num) {
    var format = (parseInt(num) / 100).toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    })
    return format
}
