import { html, Component } from 'htm/preact'
import { useState } from 'preact/hooks';
import { createRef } from 'preact';

class Shell extends Component {
    constructor (props) {
        super(props)
        // this.state = { isOpen: false }
        this.ref = createRef();
        // this.openMenu = this.openMenu.bind(this)
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
        if (this.props.contentClass === 'index') {
            var el = document.getElementById('content')
            el.className += " " + 'index'
        }

        var cart = this.props.cart
        cart.createIcon(this.ref.current, { link: '/cart' })
    }

    render (props) {
        return html`<div class="outer-shell">
            <${Menu} />

            <div>
                <div class="nav-part">
                    <span class="who-are-you"><a href="/">Myco Moon</a></span>
                    <span class="cart-container" ref=${this.ref}></span>
                </div>

                <div class="shell shell-content ${props.contentClass}">
                    ${props.children}
                </div>
            </div>
        </div>`
    }
}

function Menu () {
    var [isOpen, setOpen] = useState(false)

    function openMenu (ev) {
        ev.preventDefault()
        setOpen(!isOpen)
    }

    return html`<div class="menu-part${isOpen ? ' open' : ''}">
        <button onCLick=${openMenu}>
            <i class="fas ${isOpen ?  'fa-times' : 'fa-bars'}"></i>
        </button>
    </div>`
}

module.exports = Shell
