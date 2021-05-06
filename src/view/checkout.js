import { html } from 'htm/preact'
import { useEffect } from 'preact/hooks';
var timestamp = require('monotonic-timestamp')

function Checkout (props) {
    console.log('checkout props', props)
    var { cart } = props
    console.log('**the cart**', cart)


    //TODO: paste code from step 2.1.1
    // is supposed to be a string
    const idempotency_key = '' + timestamp()

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

                console.log('got nonce', nonce)
                console.log('card data', cardData)
                // alert(`The generated nonce is:\n${nonce}`);




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
                        location_id: "LAZSTD2P84MEA"
                    })   
                })
                    .catch(err => {
                        alert('Network error: ' + err);
                    })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(errorInfo => {
                                Promise.reject(errorInfo)
                            });
                        }
                        return response.json()
                    })
                    .then(res => {
                        console.log('process payment success', res.result);
                        alert('Payment complete successfully!\nCheck browser developer console for more details');
                    })
                    .catch(err => {
                        console.log('err', err)
                        console.error('error process payment', err);
                        alert('Payment failed to complete!\nCheck browser developer console for more details');
                    });




                //TODO: Replace alert with code in step 2.1
            //     fetch('/.netlify/functions/process-payment', {
            //         method: 'POST',
            //         headers: {
            //             'Accept': 'application/json',
            //             'Content-Type': 'application/json'
            //         },
            //         body: JSON.stringify({
            //             nonce: nonce,
            //             idempotency_key: idempotency_key,
            //             location_id: "LAZSTD2P84MEA"
            //         })   
            //     })
            //     .catch(err => {
            //         alert('Network error: ' + err);
            //     })
            //     .then(response => {
            //         if (!response.ok) {
            //             return response.json().then(errorInfo => {
            //                 Promise.reject(errorInfo)
            //             });
            //         }
            //         return response.json()
            //     })
            //     .then(res => {
            //         console.log('process payment success', res.result);
            //         alert('Payment complete successfully!\nCheck browser developer console for more details');
            //     })
            //     .catch(err => {
            //         console.log('err', err)
            //         console.error('error process payment', err);
            //         alert('Payment failed to complete!\nCheck browser developer console for more details');
            //     });
            

                  
            }
        }
    });


    useEffect(() => {
        // 1.1.5: ADD JAVASCRIPT TO BUILD THE FORM
        paymentForm.build();

    }, [])


    function getCardNonce (ev) {
        ev.preventDefault()
        console.log('get card nonce', ev.target.elements)
        console.log('**name el**', ev.target.elements.name.value)
        console.log('**address el**', ev.target.elements.address.value)

        var shipping = ['name', 'address', 'city', 'state',
            'zip-code'].reduce((acc, v) => {
                acc[v] = ev.target.elements[v].value
                return acc
            }, {})

        var email = ev.target.elements.email

        console.log('**shipping**', shipping)
        console.log('**email**', email)

        paymentForm.requestCardNonce();
    }


    return html`<div class="checkout-page">

        <h1>Checkout</h1>

        <div id="form-container">
            <form onsubmit="${getCardNonce}">

                <div class="form-section">
                    <h2>shipping</h2>

                    <div class="input-group">
                        <input name="name" type="text" placeholder=" " required
                            minlength="3" />
                        <label>Name</label>
                    </div>

                    <div class="input-group">
                        <input name="address" type="text" placeholder=" " required
                            minlength="3" />
                        <label>address</label>
                    </div>

                    <div class="input-group">
                        <input name="city" type="text" placeholder=" " required
                            minlength="3" />
                        <label>City</label>
                    </div>

                    <div class="input-group">
                        <input name="state" type="text" placeholder=" " required
                            minlength="3" />
                        <label>State</label>
                    </div>

                    <div class="input-group">
                        <input name="zip-code" type="text" placeholder=" " required
                            minlength="5" max-length="5" />
                        <label>Zip Code</label>
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
                    <button id="sq-creditcard" class="button-credit-card"
                        type="submit">
                        Pay $1.00
                    </button>
                </div>
            </form>
        </div> 



    </div>`

}

module.exports = Checkout
