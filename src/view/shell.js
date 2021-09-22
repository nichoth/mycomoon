import { html, Component } from 'htm/preact'
// import { useState } from 'preact/hooks';
import { createRef } from 'preact';
// import { options } from 'marked';
var { ITEMS } = require('../CONSTANTS')

class Shell extends Component {
    constructor (props) {
        super(props)
        this.state = { isMenuOpen: false }
        this.ref = createRef();
        this.setState = this.setState.bind(this)
        this.openMenu = this.openMenu.bind(this)
        this.closeMenu = this.closeMenu.bind(this)
    }

    componentDidUpdate () {
        var el = document.getElementById('content')
        el.className = this.props.contentClass;
        document.body.className = this.props.contentClass
    }

    componentDidMount () {
        var el = document.getElementById('content')
        // console.log('this.props.contentclass', this.props.contentClass)
        el.className = this.props.contentClass;

        document.body.className = this.props.contentClass

        var cart = this.props.cart
        cart.createIcon(this.ref.current, { link: '/cart' })
    }

    openMenu () {
        this.setState({ isMenuOpen: true })
    }

    closeMenu () {
        this.setState({ isMenuOpen: false })
    }

    render (props) {
        var { path } = props

        return html`<div class="outer-shell${this.state.isMenuOpen ?
            ' menu-open' : ''}"
        >
            <${Menu} onOpen=${this.openMenu} onClose=${this.closeMenu}
                activePath=${path} isOpen=${this.state.isMenuOpen}
            />

            <div>
                <div class="nav-part">
                    <span class="who-are-you">
                        <a href="/">
                            <img src="/img/logo-left.png" alt="myco moon logo" />
                        </a>
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

function Menu ({ activePath, isOpen, onOpen, onClose }) {
    function toggleOpen (ev) {
        ev.preventDefault()
        isOpen ? onClose() : onOpen()
    }

    function navigate (ev) {
        onClose()
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
            <li class=${active('/products', activePath)}>
                <a href="/products">products</a>
            </li>
            <li class=${active('/about', activePath)}>
                <a href="/about">about</a>
            </li>
        </ul>
    </div>`
}

function active (href, path) {
    return ((href === path || (href === '/products' && ITEMS.find(item => {
        return path.includes(item.link)
    }))) ?
        'active' :
        '')
}

module.exports = Shell
