import { html } from 'htm/preact'

function Checkout (props) {
    console.log('checkout props', props)
    var { cart } = props
    console.log('**the cart**', cart)

    function submit (ev) {
        ev.preventDefault()
        var els = ev.target.elements
        console.log('name', els.name.value)
    }

    return html`<div class="checkout-page">
        <form onSubmit=${submit}>



            <div class="input-group">
                <input type="text" required />
                <label>Username</label>
            </div>




            <div class="form-controls">
                <button type="submit">submit</button>
            </div>
        </form>
    </div>`
}

module.exports = Checkout
