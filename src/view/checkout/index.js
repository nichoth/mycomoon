import { html, Component } from 'htm/preact'
var observ = require('observ')
var { toMoneyFormat, getTax, withTax } = require('../../util')
var Success = require('./success')
var createPaymentForm = require('./create-payment-form')

class Checkout extends Component {
    constructor (props) {
        super(props)

        this.state = {
            isResolving: false,
            order: null,
            error: null
        }

        this.shipping = observ()
        this.email = observ()
        this.paymentForm = null
    }

    componentDidUpdate () {
        // kind of a hacky way to do this
        if (this.state.error || this.state.order) {
            window.scrollTo(0, 0); 
        }
    }

    componentDidMount () {


        // could check the inventory here
        // disable or don't render the 'pay' button if theres not
        // enough available


        var { cart } = this.props
        var self = this
        window.scrollTo(0, 0); 
        var paymentForm = createPaymentForm(self, cart, this.shipping,
            this.email)
        this.paymentForm = paymentForm
        paymentForm.build();
    }

    render () {
        var { cart } = this.props

        // this gets set by the `submit` handler for the form -- `getCardNonce`
        // then it's read in the cb we pass to the payment form --
        // `cardNonceResponseReceived`
        var shipping = this.shipping
        var email = this.email


        // Create and initialize a payment form object
        var self = this

        function getCardNonce (ev) {
            ev.preventDefault()

            shipping.set(['first-name', 'last-name', 'address', 'city', 'state',
                'zip-code'].reduce((acc, v) => {
                    acc[v] = ev.target.elements[v].value
                    return acc
                }, {})
            )

            email.set(ev.target.elements.email.value)

            self.setState({
                isResolving: true,
                order: null,
                error: null
            })

            self.paymentForm.requestCardNonce();
        }

        if (self.state.order) {
            console.log('**order**', self.state.order)
            return html`<${Success} order=${self.state.order} />`
        }

        if (self.state.error) {
            console.log('**error**', self.state.error)
            return html`<div class="payment-error">
                <p>error</p>
                <p class="error">${self.state.error.category}</p>
                <p class="error">${self.state.error.code}</p>
            </div>`
        }

        var { products } = cart.state()

        var total = products.reduce(function (total, prod) {
            return total + (prod.price * prod.quantity)
        }, 0)

        return html`<div class="checkout-page">
            <h1>Checkout</h1>

            <ul id="cart-summary">
                ${products.map((prod, i) => {
                    console.log('in map', prod)
                    var { slug } = prod

                    return html`<li>
                        <a href="${'/' + slug}" class="cart-image">
                            <img src=${prod.imageData.url} />
                        </a>
                        <span>${prod.name + ' -- ' + prod.variationName}</span>

                        <!-- <span>${prod.quantity}</span> -->
                        <span>
                            ${toMoneyFormat(prod.price) + 'ea'} × ${prod.quantity}
                            ${' = ' + toMoneyFormat(total)}
                        <//>
                    </li>`
                })}
            </ul>

            <div class="cart-totals">
                <div class="subtotal-money">
                    subtotal ${toMoneyFormat(total)}
                </div>
                <div class="tax">tax ${toMoneyFormat(getTax(products))}</div>
                <div>total ${toMoneyFormat(withTax(products))}</div>
            </div>

            <div id="form-container">
                <form onsubmit="${getCardNonce}">

                    <div class="form-section">
                        <h2>shipping</h2>

                        <div class="input-group">
                            <input name="first-name" type="text" placeholder=" "
                                required minlength="3" id="first-name" />
                            <label for="first-name">First Name</label>
                        </div>

                        <div class="input-group">
                            <input id="last-name" name="last-name" type="text"
                                placeholder=" " required minlength="3" />
                            <label for="last-name">Last Name</label>
                        </div>

                        <div class="input-group">
                            <input name="address" id="address" type="text"
                                placeholder=" " required minlength="3" />
                            <label for="address">address</label>
                        </div>

                        <div class="input-group">
                            <input name="city" id="city" type="text"
                                placeholder=" " required minlength="3" />
                            <label for="city">City</label>
                        </div>

                        <div class="input-group">
                            <input name="state" id="state" type="text"
                                placeholder=" " required minlength="3" />
                            <label for="state">State</label>
                        </div>

                        <div class="input-group">
                            <input name="zip-code" id="zip-code" type="text"
                                placeholder=" " required minlength="5"
                                max-length="5" />
                            <label for="zip-code">Zip Code</label>
                        </div>
                    </div>

                    <div class="form-section">
                        <h2>payment</h2>

                        <div class="input-group">
                            <input name="email" type="email" placeholder=" " required
                                minlength="1" />
                            <label>email</label>
                        </div>

                        <div id="sq-card-number"></div>
                        <div class="third" id="sq-expiration-date"></div>
                        <div class="third" id="sq-cvv"></div>
                        <div class="third" id="sq-postal-code"></div>
                        ${self.state.isResolving ?
                            html`<button id="sq-creditcard"
                                class="button-credit-card spinning" type="submit"
                                disabled=${true}
                            >
                            </button>` :
                            html`<button id="sq-creditcard" class="button-credit-card">
                                Pay ${toMoneyFormat(withTax(cart.products()))}
                            </button>`
                        }
                    </div>
                </form>
            </div> 

        </div>`
    }
}

module.exports = Checkout
