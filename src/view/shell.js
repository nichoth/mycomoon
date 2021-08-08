import { html, Component } from 'htm/preact'
import { useState } from 'preact/hooks';
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
        if (this.props.contentClass === 'index') {
            var el = document.getElementById('content')
            el.className += " " + 'index'
        }

        var cart = this.props.cart
        cart.createIcon(this.ref.current, { link: '/cart' })
    }

    render (props) {
        console.log('in shell', props)

        var { path } = props

        return html`<div class="outer-shell">
            <${Menu} activePath=${path} />

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

function Menu ({ activePath }) {
    var [isOpen, setOpen] = useState(false)

    function openMenu (ev) {
        ev.preventDefault()
        setOpen(!isOpen)
    }

    return html`<div class="menu-part${isOpen ? ' open' : ''}">
        <div>
            <button onCLick=${openMenu}>
                <i class="fas ${isOpen ?  'fa-times' : 'fa-bars'}"></i>
            </button>
        </div>

        <ul class="menu-content">
            <li class=${active('/about', activePath)}>
                <a href="/about">about</a>
            </li>
            <li class=${active('/products', activePath)}>
                <a href="/products">products</a>
            </li>
        </ul>
    </div>`
}

function active (href, path) {
    return href === path ? 'active' : ''
}

module.exports = Shell
