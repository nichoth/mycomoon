import { html, Component } from 'htm/preact'
import { createRef } from 'preact';
var { toMoneyFormat, getTax, withTax } = require('../util')

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
            if (!Number.isInteger(n)) {
                return cart.changeQuantity(i, 1)
            }
            
            if (n > ev.target.max) {
                return cart.changeQuantity(i, parseInt(ev.target.max))
            }

            cart.changeQuantity(i, n)
        }

        function remove (i, ev) {
            ev.preventDefault()
            cart.remove(i)
        }

        function cancelRemove (i, ev) {
            ev.preventDefault()
            cart.changeQuantity(i, 1)
        }

        cart.createPage(this.ref.current, mapper)

        function mapper (html, prod, i) {
            console.log('mapper', prod)
            var { slug } = prod

            // return the buttons for confirm remove or keep
            if (prod.quantity === 0) {
                return html`<div>
                    <a href="${'/' + slug}" class="cart-image">
                        <img src=${prod.imageData.url} />
                    </a>
                    <button onClick=${remove.bind(null, i)} class="primary">
                        remove item?
                    </button>
                    <button class="cancel"
                        onclick=${cancelRemove.bind(null, i)}
                    >
                        cancel
                    </button>
                </div>`
            }

            return html`
                <a href="${slug}" class="cart-image">
                    <img src=${prod.imageData.url} />
                </a>
                <span>${prod.name + ' -- ' + prod.variationName}</span>
                <span>
                    <input type="number" min="0" max="${prod.quantityAvailable}"
                        value=${prod.quantity}
                        onChange=${changeQuantity.bind(null, i)}
                    />
                    <span> (${prod.quantityAvailable < 0 ?
                        0 :
                        prod.quantityAvailable} available)
                    </span>
                </span>
                <span>
                    ${toMoneyFormat(prod.price) + 'ea'} × ${prod.quantity}
                <//>
            `
        }
    }

    render (props) {
        var { cart } = props
        var { products } = cart.state()

        var total = products.reduce(function (total, prod) {
            return total + (prod.price * prod.quantity)
        }, 0)

        var isWonky = cart.ohno()

        return html`
            <h1>the shopping cart</h1>

            <div class="cart-content" ref=${this.ref}></div>

            <div class="cart-totals">
                <div class="subtotal-money">
                    subtotal ${toMoneyFormat(total)}
                </div>
                <div class="tax">tax ${toMoneyFormat(getTax(products))}</div>
                <div>total ${toMoneyFormat(withTax(products))}</div>
            </div>

            <div class="cart-controls">
                ${(products.length && !isWonky) ?
                    (html`<a class="pay" href="/cart/checkout">
                        buy them
                    </a>`) :
                    (html`<span class="pay">
                        buy them
                    </span>`)
                }
            </div>
        `
    }
}

module.exports = CartPage
