import { html, Component } from 'htm/preact'
import { createRef } from 'preact';
var { ITEMS } = require('../CONSTANTS')
var xtend = require('xtend')
var Router = require('../router')
var _path = require('path')
var IndexView = require('./index')

function Icon () {
    // return html`<img src="/img/shoppingcart_icon.svg" />`
    return html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100.07 91"><defs><style>.cls-1{fill:none;stroke:#e8e1d7;stroke-miterlimit:10;stroke-width:2px;}</style></defs><title>shoppingcart_icib</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M0,1H10.75a5.17,5.17,0,0,1,5,4L17.1,11a5.17,5.17,0,0,0,5,4H93.91A5.16,5.16,0,0,1,99,21L93.72,52.69A5.16,5.16,0,0,1,88.63,57H33a5.17,5.17,0,0,1-5-3.85L22,15l9,57.2a5.17,5.17,0,0,0,5,3.8H87"/><circle class="cls-1" cx="42" cy="85" r="5"/><circle class="cls-1" cx="79" cy="85" r="5"/></g></g></svg>`
}

class Shell extends Component {
    constructor (props) {
        super(props)
        this.state = xtend({ isMenuOpen: false }, props.state())
        this.ref = createRef();
        this.setState = this.setState.bind(this)
        this.openMenu = this.openMenu.bind(this)
        this.closeMenu = this.closeMenu.bind(this)
        this.router = Router(props.state)
        props.state(newState => {
            this.setState(xtend(this.state, newState))
        })
    }

    componentDidUpdate () {
        var path = this.state.route
        var contentClass = (path === '/' || path === '') ?
            'index' :
            _path.basename(path)

        var dirs = path.split('/').filter(Boolean)
        var isProdPage = (dirs.length === 1 && dirs[0] !== 'products' &&
            dirs[0] !== 'about' && dirs[0] !== 'cart')
        if (isProdPage) contentClass += ' product-page'

        var el = document.getElementById('content')
        el.className = contentClass
        document.body.className = contentClass
    }

    componentDidMount () {
        var el = document.getElementById('content')
        el.className = this.props.contentClass;

        document.body.className = this.props.contentClass

        var cart = this.props.cart
        cart.createIcon(this.ref.current, Icon, { link: '/cart' })
    }

    openMenu () {
        this.setState({ isMenuOpen: true })
    }

    closeMenu () {
        this.setState({ isMenuOpen: false })
    }

    render (props) {
        var path = this.state.route

        var m = this.router.match(path)

        var view
        if (!m) view = null
        else view = m.action(m).view

        return html`<div class="outer-shell${this.state.isMenuOpen ?
            ' menu-open' : ''}"
        >
            <${Menu} onOpen=${this.openMenu} onClose=${this.closeMenu}
                activePath=${path} isOpen=${this.state.isMenuOpen}
                ...${this.state}
            />

            <div class="page-content">
                <div class="nav-part">
                    <span class="who-are-you">
                        <a href="/">
                            <img src="/img/logo-left.png" alt="myco moon logo" />
                        </a>
                    </span>
                    <span class="cart-container" ref=${this.ref}></span>
                </div>

                <div class="shell shell-content">
                    <${IndexView} ...${props} ...${this.state}>
                        <${view} ...${this.state} ...${this.props} />
                    <//>
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
            <li class=${active('/', activePath)}>
                <a href="/">about</a>
            </li>
            <li class=${active('/products', activePath)}>
                <a href="/turkey-tail-tincture">products</a>
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
