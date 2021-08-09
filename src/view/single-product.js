import { useState, useEffect } from 'preact/hooks';
import { html } from 'htm/preact'

function createSingleProductView ({ slug }) {

    return function SingleProductView (props) {
        var { getContent/*, cart*/ } = props
        const [item, setItem] = useState(null)
        // var [cartState, setCartState] = useState(null)

        console.log('props', props)
        console.log('slug', slug)
        console.log('the item', item)

        // comppnent did mount
        useEffect(() => {
            getContent()
                .then(res => {
                    // console.log('**res**', res)
                    setItem(res)
                })
                .catch(err => console.log('errrr', err))
        }, []);

        // component did mount
        // useEffect(() => {
        //     setCartState(cart.state())
        //     return cart.state(function onChange (newCartState) {
        //         setCartState(newCartState)
        //     })
        // }, [])

        if (!item) return null

        // function addToCart (variation, ev) {
        //     ev.preventDefault()

        //     var _item = {
        //         itemId: item.id,
        //         // variationId: variation.id,
        //         slug: slug,
        //         name: item.name,
        //         // variationName: variation.itemVariationData.name,
        //         price: variation.price,
        //         quantity: 1,
        //         quantityAvailable: parseInt(variation.inventory.available),
        //         imageData: item.media
        //     }

        //     // here, check & adjust the quantity if necessary
        //     var i = cart.state().products.findIndex(prod => {
        //         return prod.itemId === variation.id
        //     })

        //     if (i > -1) {
        //         var product = cart.state().products[i]

        //         if ((product.quantity + 1) > product.quantityAvailable) {
        //             return
        //         }

        //         cart.changeQuantity(i, product.quantity + 1)
        //         return
        //     }

        //     cart.add(_item)
        // }

        // get the number of variations that are in the cart
        // var prodsInCart = cartState.products.reduce((acc, prod) => {
        //     console.log('prod', prod)
        //     acc[prod.itemId] = prod.quantity
        //     return acc
        // }, {})

        // which menu item is open? it's based on the URL

        return html`<div class="single-product">

            <div class="single-product-info">

                <${ProductList} slug=${slug} item=${item} />

            </div>

            <div class="single-product-content">
                <img src="${item.media.source}" alt="mushroom" />


            </div>
        </div>`
    }
}

// needs permalink, description, name
function ProductList (props) {
    var { slug, item } = props

    var items = [
        { link: 'turkey-tail-tincture', name: 'Turkey Tail Tincture' },
        { link: 'chaga-tincture', name: 'Chaga Tincture' },
        { link: 'lions-mane-tincture', name: "Lion's Mane Tincture" },
        { link: 'reishi-tincture', name: "Reishi Tincture" }
    ]

    return html`<ul class="product-list">
        ${items.map(_item => {
            var isActive = _item.link === slug
            return html`<li class=${isActive ? 'active' : ''}>
                <a href=${'/' + _item.link}>${_item.name}</a>
                ${isActive ?
                    html`<div dangerouslySetInnerHTML=${{
                            __html: item.description
                        }}
                    />` :
                    null
                }
            </li>`
        })}
    </ul>`
}

module.exports = createSingleProductView

// function getReadableMoney (variation) {
//     return variation.formatted_with_symbol
//     // var price = variation.itemVariationData.priceMoney.amount
//     // return toMoneyFormat(price)
// }

// function toMoneyFormat (num) {
//     var format = (parseInt(num) / 100).toLocaleString("en-US", {
//         style: "currency",
//         currency: "USD"
//     })
//     return format
// }
