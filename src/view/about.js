import { html } from 'htm/preact'

function About (props) {
    return html`<div>
        <div class="about-pic"></div>

        <hr class="special-divider" />

        <div class="about-info">
            <h1>About</h1>
            <p>
                Myco Moon wants to share their love for functional mushrooms
                with the world. Their extracts are made from small batches of
                homegrown Lion's Mane, Reishi, Turkey Tail, & Chaga mushrooms.
            </p>
            <p>
                Funghi has the power to heal and balance the body and mind,
                while simultaneously restoring environments and ecosystems.
            </p>
        </div>
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

