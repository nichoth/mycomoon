import { html } from 'htm/preact'
import { useEffect, useState } from 'preact/hooks';
var timestamp = require('monotonic-timestamp')
var { toMoneyFormat, withTax } = require('../util')

function Checkout (props) {
    var { cart } = props

    // this gets set by the `submit` handler for the form -- `getCardNonce`
    // then it's read in the cb we pass to the payment form --
    // `cardNonceResponseReceived`
    var shipping
    var email

    //TODO: paste code from step 2.1.1
    // is supposed to be a string
    const idempotency_key = '' + timestamp()

    var [state, setState] = useState({
        isResolving: false,
        order: null,
        error: null
    })

    // Create and initialize a payment form object
    var paymentForm = new window.SqPaymentForm({
        // Initialize the payment form elements
        
        //TODO: Replace with your sandbox application ID
        // applicationId: "REPLACE_WITH_APPLICATION_ID",
        applicationId: 'sandbox-sq0idb-ACaOfM9YIuvb6PvOIKRhJw',
        inputClass: 'sq-input',
        autoBuild: false,
        // Customize the CSS for SqPaymentForm iframe elements
        inputStyles: [{
            fontSize: '16px',
            lineHeight: '24px',
            padding: '16px',
            placeholderColor: '#a0a0a0',
            backgroundColor: 'transparent'
        }],
        // Initialize the credit card placeholders
        cardNumber: {
            elementId: 'sq-card-number',
            placeholder: 'Card Number'
        },
        cvv: {
            elementId: 'sq-cvv',
            placeholder: 'CVV'
        },
        expirationDate: {
            elementId: 'sq-expiration-date',
            placeholder: 'MM/YY'
        },
        postalCode: {
            elementId: 'sq-postal-code',
            placeholder: 'Postal'
        },
        // SqPaymentForm callback functions
        callbacks: {
            /*
            * callback function: cardNonceResponseReceived
            * Triggered when: SqPaymentForm completes a card nonce request
            */
            cardNonceResponseReceived: function (errors, nonce, cardData) {
                if (errors) {
                    // Log errors from nonce generation
                    console.error('Encountered errors:');
                    errors.forEach(function (error) {
                        console.error('  ' + error.message);
                    });
                    var msg = errors[0].message
                    alert('Error -- ' + msg)
                    return;
                }

                // console.log('got nonce', nonce)
                // console.log('card data', cardData)
                // console.log('in nonce received cb', shipping, email)
                // alert(`The generated nonce is:\n${nonce}`);


                var products = cart.products()


                // in here, first create an order, then pay for it
                // @TODO -- need to get the address info & call our endpoint
                fetch('/.netlify/functions/create-order-and-pay', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nonce: nonce,
                        idempotency_key: idempotency_key,
                        location_id: "LAZSTD2P84MEA",
                        shipping: shipping,
                        lineItems: products,
                        email: email
                    })   
                })
                    .catch(err => {
                        alert('Network error: ' + err);
                        setState({
                            isResolving: false,
                            order: null,
                            error: err
                        })
                    })
                    .then(response => {
                        if (!response.ok) {
                            console.log('not ok', response)
                            return response.text().then(errInfo => {
                                return Promise.reject(errInfo)
                            })
                            // return response.json().then(errorInfo => {
                            //     Promise.reject(errorInfo)
                            // });
                        }
                        return response.json()
                    })
                    .catch(err => {
                        // console.log('**err**', err)
                        console.error('errr in hrr', err);
                        // alert('Payment failed to complete!\nCheck browser developer console for more details');

                        // TODO -- should show an error message

                        setState({
                            isResolving: false,
                            order: null,
                            error: err
                        })
                    })
                    .then(res => {
                        console.log('process payment success', res);

                        // TODO -- keep the route the same, and just set
                        // some state for the success response
                        // alert('Payment complete successfully!\nCheck browser developer console for more details');

                        setState({
                            isResolving: false,
                            order: res.order,
                            error: null
                        })
                    })
                    .catch(err => {
                        // console.log('**err**', err)
                        console.error('error -- process payment', err);
                        // alert('Payment failed to complete!\nCheck browser developer console for more details');

                        // TODO -- should show an error message

                        setState({
                            isResolving: false,
                            order: null,
                            error: err
                        })
                    });

            }
        }
    });

    useEffect(() => {
        // 1.1.5: ADD JAVASCRIPT TO BUILD THE FORM
        if (!state.order && !state.error) {
            paymentForm.build();
        } 
    }, [])

    function getCardNonce (ev) {
        ev.preventDefault()
        console.log('get card nonce', ev.target.elements)
        console.log('**name el**', ev.target.elements['first-name'].value)
        console.log('**address el**', ev.target.elements.address.value)

        shipping = ['first-name', 'last-name', 'address', 'city', 'state',
            'zip-code'].reduce((acc, v) => {
                acc[v] = ev.target.elements[v].value
                return acc
            }, {})

        email = ev.target.elements.email.value

        setState({ isResolving: true })

        paymentForm.requestCardNonce();
    }

    if (state.order) {
        console.log('**order**', state.order)
        return html`<div class="success">
            <h1>success</h1>

            <p>Thanks for buying some things</p>
            <p>We will send you an email with a receipt</p>

            <${OrderSummary} order=${state.order}
                lineItems=${state.order.lineItems} />
        </div>`
    }

    if (state.error) {
        console.log('**error**')
        return html`<div>
            <p>error</p>
            <p class="error">${state.error}</p>
        </div>`
    }

    return html`<div class="checkout-page">
        <h1>Checkout</h1>

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
                            minlength="5" max-length="5" />
                        <label>email</label>
                    </div>

                    <div id="sq-card-number"></div>
                    <div class="third" id="sq-expiration-date"></div>
                    <div class="third" id="sq-cvv"></div>
                    <div class="third" id="sq-postal-code"></div>
                    ${state.isResolving ?
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

function OrderSummary ({ lineItems, order }) {
    return html`<div class="order-summary">
        ${lineItems.map(item => {
            return html`<ul>
                <li>
                    <span>${item.name} -- ${item.variationName}</span>
                    <span>${item.quantity}</span>
                    <span>${toMoneyFormat(item.totalMoney.amount)}</span>
                </li>

                <li>total ${toMoneyFormat(order.totalMoney.amount)}</li>
            </ul>`
        })}
    </div>`
}


module.exports = Checkout
