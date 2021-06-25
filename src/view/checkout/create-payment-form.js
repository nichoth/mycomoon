var timestamp = require('monotonic-timestamp')

function createPaymentForm (self, cart, shipping, email) {
    //TODO: paste code from step 2.1.1
    // is supposed to be a string
    const idempotency_key = '' + timestamp()

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
                        shipping: shipping(),
                        lineItems: products,
                        email: email()
                    })   
                })
                    .catch(err => {
                        alert('Network error: ' + err);
                        self.setState({
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
                    .then(res => {
                        console.log('process payment success', res);

                        // TODO -- keep the route the same, and just set
                        // some state for the success response
                        // alert('Payment complete successfully!\nCheck browser developer console for more details');

                        self.setState({
                            isResolving: false,
                            order: res.order,
                            error: null
                        })
                    })
                    .catch(err => {
                        var _err = JSON.parse(err)
                        console.error('errr in hrr', _err);

                        self.setState({
                            isResolving: false,
                            order: null,
                            error: _err.errors[0]
                        })
                    })
            }
        }
    })

    return paymentForm
}

module.exports = createPaymentForm
