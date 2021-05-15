var { toMoneyFormat } = require('../util')
import { html } from 'htm/preact'

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

module.exports = OrderSummary
