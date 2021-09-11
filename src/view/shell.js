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
        el.className = this.props.contentClass;
        document.body.className = this.props.contentClass
    }

    componentDidMount() {
        var el = document.getElementById('content')
        console.log('this.props.contentclass', this.props.contentClass)
        el.className = this.props.contentClass;

        document.body.className = this.props.contentClass

        var cart = this.props.cart
        cart.createIcon(this.ref.current, { link: '/cart' })
    }

    render (props) {
        var { path } = props

        return html`<div class="outer-shell">
            <${Menu} activePath=${path} />

            <div>
                <div class="nav-part">
                    <span class="who-are-you">
                        <a href="/">🌙 Myco Moon</a>
                    </span>
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

    function toggleOpen (ev) {
        ev.preventDefault()
        setOpen(!isOpen)
    }

    function navigate (ev) {
        setOpen(false)
    }

    return html`<div class="menu-part${isOpen ? ' open' : ''}">
        <div>
            <button onCLick=${toggleOpen}>
                <div class="hamburger${isOpen ? ' open' : ''}">
                    <span class="hamburger__top-bun"></span>
                    <span class="hamburger__middle-bun"></span>
                    <span class="hamburger__bottom-bun"></span>
                </div>
            </button>
        </div>

        <ul class="menu-content" onclick="${navigate}">
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
