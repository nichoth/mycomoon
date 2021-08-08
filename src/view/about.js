import { html } from 'htm/preact'

function About (props) {
    return html`<div class="about">
        <p>This is 'about' content</p>
    </div>`
}

module.exports = About

// function getReadableMoney (variation) {
//     var price = variation.itemVariationData.priceMoney.amount
//     return toMoneyFormat(price)
// }

// function toMoneyFormat (num) {
//     var format = (parseInt(num) / 100).toLocaleString("en-US", {
//         style: "currency",
//         currency: "USD"
//     })
//     return format
// }

