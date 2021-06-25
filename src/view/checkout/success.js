import { html } from 'htm/preact'
import { useEffect } from 'preact/hooks';
var OrderSummary = require('./order-summary')

function Success (props) {
    useEffect(() => {
        window.scrollTo(0, 0); 
    }, [])

    return html`<div class="success">
        <h1>success</h1>

        <p>Thanks for buying some things</p>
        <p>We will send you an email with a receipt</p>

        <${OrderSummary} order=${props.order}
            lineItems=${props.order.lineItems} />
    </div>`
}

module.exports = Success
