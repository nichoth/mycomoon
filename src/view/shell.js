import { html, Component } from 'htm/preact'
import { useEffect, useState } from 'preact/hooks';
import { createRef } from 'preact';
var { ITEMS } = require('../CONSTANTS')
var xtend = require('xtend')
var Router = require('../router')
var _path = require('path')
// var IndexView = require('./index')

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

        if (!m) var view = null
        else {
            var { view, slug } = m.action(m)
        }

        console.log('in shell', props)
        console.log('in shell state', this.state)

        var item = this.state.content

        if (slug && !item) {
            return null
        }

        return html`<div class="outer-shell${this.state.isMenuOpen ?
            ' menu-open' :
            ''}"
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
                    <${One} ...${props} item=${item} slug=${slug} />
                    <${Two} ...${props} item=${item} slug=${slug} />
                </div>
            </div>
        </div>`
    }
}

                    // <${IndexView} ...${props} ...${this.state}>
                    //     <${view} ...${this.state} ...${this.props} />
                    // <//>

function One (props) {
    return html`<div class="pane-1">
        <div class="left-part">
            <${HomeView} ...${props} />
        </div>

        <hr class="special-divider" />

        <div class="right-part">
            <div class="logo">
                <img src="/img/logo.png" alt="mycomoon logo" />
            </div>
        </div>
    </div>`
}

function Two (props) {
    var { item, cart } = props

    // TODO -- return the product list with open to first one
    if (!item) return html`<div class="pane-2">
        <div class="left-part">
            <${ProductList} ...${props} prodsInCart=${prodsInCart} />
        </div>

        <div class="right-part">
            <div class="product-image">
                ${item && item.media && item.media.source ? 
                    html`<img src="${item.media.source}"
                        alt="mushroom"
                        class="inline-image"
                    />` :
                    null
                }
            </div>
        </div>
    </div>`

    var [cartState, setCartState] = useState(cart.state())

    var prodsInCart = cartState ? 
        cartState.products.reduce((acc, prod) => {
            acc[prod.itemId] = prod.quantity
            return acc
        }, {}) :
        null

    // console.log('porpppp', props)

    // subscribe to any changes in the shopping cart
    useEffect(() => {  // component did mount
        setCartState(cart.state())
        return cart.state(function onChange (newCartState) {
            setCartState(newCartState)
        })
    }, [])

    return html`<div class="pane-2">
        <div class="left-part">
            <${ProductList} ...${props} prodsInCart=${prodsInCart} />
        </div>

        <div class="right-part">
            <div class="product-image">
                <img src="${item && item.media && item.media.source}"
                    alt="mushroom"
                    class="inline-image"
                />
            </div>
        </div>
    </div>`
    

    // return html`<div class="pane-2">
    //     <div class="left-part">
    //         <div class="item-description">
    //             <div class="desc"
    //                 dangerouslySetInnerHTML=${{
    //                     __html: item.description
    //                 }}
    //             ></div>
    //             <${DualExtracted} />
    //         </div>
    //     </div>

    //     <div class="right-part">
    //         <div class="product-image">
    //             <img src="${item && item.media && item.media.source}"
    //                 alt="mushroom"
    //                 class="inline-image"
    //             />
    //         </div>
    //     </div>
    // </div>`
}

function HomeView (props) {
    useEffect(() => {  // component did update
        if (props.route !== '/') return
        document.getElementById('home').scrollIntoView(true)
    })

    return html`
        <div class="home-view">
            <img src="/img/logo.png" />

            <div class="home-text" id="home">
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
        </div>
    `
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

function DualExtracted () {
    return html`<div class="dual-extracted">
        <img src="/img/dual-extracted_1.svg" alt="dual extracted" />
    </div>`
}


function ProductList (props) {
    var { slug, item, prodsInCart, addToCart, route } = props
    console.log('ps in here', props)

    console.log('slug', slug)
    console.log('perma', item && item.permalink)
    useEffect(() => {
        var el = document.querySelector('.product-list li.active a')

        if (el && item) {
            console.log('scrolling', el, item)
            el.scrollIntoView()
        }

        if (route === '/products') {
            console.log('prods')
            document.getElementById('products').scrollIntoView(true)
        }
    }, [slug, (item && item.permalink)])

    function handleClck (ev) {
        ev.target.scrollIntoView()
    }

    // so the page layout doesn't get as bad when you're loading a product
    item = props.item || { foo: 'bar' }

    return html`<ul class="product-list">
        ${ITEMS.map(_item => {
            var isActive = _item.link === slug

            return html`<li class=${isActive ? 'active' : ''}>
                <a href=${isActive ?
                    '/products' :
                    '/' + _item.link}
                    onclick=${handleClck}
                >
                    ${_item.name}
                </a>

                ${(isActive && item) ?
                    html`
                    <img src="${item.media && item.media.source}"
                        alt="mushroom"
                        class="inline-image"
                    />
                    
                    <div class="item-description">
                        <div class="desc"
                            dangerouslySetInnerHTML=${{
                                __html: item.description
                            }}
                        ></div>
                        <${DualExtracted} />
                    </div>

                    <div class="bonus-info">
                        <div class="bonus-info-tab">
                            <span>Organic</span>
                            <span class="star-icon">
                                <img src="/img/star.png" />
                            </span>
                            <span>non-GMO</span>
                        </div>
                        <div class="bonus-info-tab">
                            <span>Vegan</span>
                            <span class="moon-icon">
                                <img src="/img/moon.png" />
                            </span>
                            <span>made in USA</span>
                        </div>
                    </div>

                    ${item ?
                        html`<${CartControls} item=${_item} product=${item}
                            cart=${cart} quantity=${prodsInCart[item.id]}
                            prodsInCart=${prodsInCart}
                            onAddToCart=${addToCart}
                        />` :
                        null
                    }` :

                    null
                }
            </li>`
        })}
    </ul>`
}

function CartControls (props) {
    var { product, prodsInCart, onAddToCart } = props

    var count = (prodsInCart[product.id] || 0)
    var price = (product.price && product.price.formatted_with_symbol)

    return html`<div class="cart-controls">
        <span class="price">${price}</span>
        <span>${count} in cart</span> 
        <button onClick=${onAddToCart} class="cart-add">add to cart</button>
    </div>`
}



module.exports = Shell
