import { html, Component } from 'htm/preact'
import { createRef } from 'preact';

class Shell extends Component {
    constructor (props) {
        super(props)
        this.state = { isOpen: false }
        this.ref = createRef();
        this.openMenu = this.openMenu.bind(this)
    }

    componentDidUpdate () {
        var el = document.getElementById('content')
        if (this.props.contentClass === 'index') {
            el.className += ' index'
        } else {
            el.className = ''
        }
    }

    openMenu (ev) {
        ev.preventDefault()
        console.log('opening')
        this.setState({ isOpen: !this.state.isOpen })
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
            <div class="menu-part${this.state.isOpen ? ' open' : ''}">
                <button onCLick=${this.openMenu}>
                    <i class="fas ${this.state.isOpen ? 'fa-times' : 'fa-bars'}"></i>
                </button>
            </div>

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

module.exports = Shell
