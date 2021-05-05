import { html, Component } from 'htm/preact'
import { createRef } from 'preact';

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
            return html`<div>
                <span>${prod.name + ' -- ' + prod.variationName}</span>
                <input type="number" min="0" max="${prod.quantityAvailable}"
                    value=${prod.quantity}
                    onChange=${changeQuantity.bind(null, i)}
                />
                <span>${toMoneyFormat(prod.price) + 'ea'} × ${prod.quantity}
                <//>
            </div>`
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

function toMoneyFormat (num) {
    var format = (parseInt(num) / 100).toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    })
    return format
}

module.exports = CartPage
