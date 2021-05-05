import { html } from 'htm/preact'
import { useEffect } from 'preact/hooks';
var timestamp = require('monotonic-timestamp')

function Checkout (props) {
    console.log('checkout props', props)
    var { cart } = props
    console.log('**the cart**', cart)



    // function submit (ev) {
    //     ev.preventDefault()
    //     var els = ev.target.elements
    //     console.log('name', els.name.value)
    // }


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
                    // Log errors from nonce generation to the browser
                    // developer console.
                    console.error('Encountered errors:');
                    errors.forEach(function (error) {
                        console.error('  ' + error.message);
                    });
                    alert('Encountered errors, check browser console for more');
                    return;
                }


                // in here, first create an order, then pay for it


                //TODO: Replace alert with code in step 2.1
                fetch('/.netlify/functions/process-payment', {
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
                  

                console.log('got nonce', nonce)
                console.log('card data', cardData)
                // alert(`The generated nonce is:\n${nonce}`);
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
        console.log('**els**', ev.target.elements.name.value)
        paymentForm.requestCardNonce();
    }


    return html`<div class="checkout-page">

        <div id="form-container">
            <form onsubmit="${getCardNonce}">

                <h2>shipping</h2>

                <div class="input-group">
                    <input name="name" type="text" placeholder=" " required
                        minlength="3" />
                    <label>Name</label>
                </div>

                <h2>payment</h2>

                <div id="sq-card-number"></div>
                <div class="third" id="sq-expiration-date"></div>
                <div class="third" id="sq-cvv"></div>
                <div class="third" id="sq-postal-code"></div>
                <button id="sq-creditcard" class="button-credit-card"
                    type="submit">
                    Pay $1.00
                </button>
            </form>
        </div> 



    </div>`



        // <form onSubmit=${submit}>

            // <div class="input-group">
            //     <input name="name" type="text" placeholder=" " required
            //         minlength="3" />
            //     <label>Name</label>
            // </div>

        //     <div class="form-controls">
        //         <button type="submit">submit</button>
        //     </div>

        // </form>
}

module.exports = Checkout
