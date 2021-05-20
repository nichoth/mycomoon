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
            console.log('***value', ev.target.value)
            var n = parseInt(ev.target.value)
            console.log('****n', n)
            if (!Number.isInteger(n)) {
                console.log('not int', n)
                return cart.changeQuantity(i, 1)
            }
            
            // var max = cart.products()[i].quantityAvailable
            var max = parseInt(ev.target.max)
            var min = parseInt(ev.target.min)
            if (n < min) {
                return cart.changeQuantity(i, min)
            }
            if (n > max) {
                return cart.changeQuantity(i, max)
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

        function displayAvailable (prod) {
            return prod.quantityAvailable > 0 ?
                prod.quantityAvailable :
                0
        }

        function mapper (html, prod, i) {
            console.log('mapper', prod)
            var { slug } = prod

            // return the buttons for remove or keep
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
                <span class="quantities${cart.ohno(i) ? ' ohno' : ''}">
                    <input type="text" inputmode="numeric" pattern="[0-9]*"
                        max="${displayAvailable(prod)}"
                        min="0"
                        onchange=${changeQuantity.bind(null, i)}
                        value=${prod.quantity}
                        name="quantity"
                    />
                    <!-- <input type="number" min="0" value=${prod.quantity}
                        max="${displayAvailable(prod)}"
                        onChange=${changeQuantity.bind(null, i)}
                    /> -->
                    <span class="available${cart.ohno(i) ? ' ohno' : ''}">
                        ${' '}(${displayAvailable(prod)} available)
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
