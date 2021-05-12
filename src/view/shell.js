import { html, Component } from 'htm/preact'
import { createRef } from 'preact';

class Shell extends Component {
    constructor (props) {
        super(props)
        this.ref = createRef();
    }

    componentDidUpdate () {
        var el = document.getElementById('content')
        if (this.props.contentClass === 'index') {
            el.className += ' index'
        } else {
            el.className = ''
        }
    }

    componentDidMount() {
        // console.log(this.ref.current);
        // Logs: [HTMLDivElement]

        if (this.props.contentClass === 'index') {
            var el = document.getElementById('content')
            el.className += " " + 'index'
        }

        var cart = this.props.cart
        cart.createIcon(this.ref.current, { link: '/cart' })
    }

    render (props) {
        return html`<div class="nav-part">
            <span class="who-are-you">Myco Moon</span>
            <span class="cart-container" ref=${this.ref}></span>
        </div>

        <!-- ${props.contentClass === 'index' ?
            html`<h1>myco moon</h1>` :
            null
        } -->

        <div class="shell ${props.contentClass}">
            ${props.children}
        </div>`
    }
}

module.exports = Shell
