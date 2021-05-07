var route = require('route-event')()
var Router = require('./router')
import { html, Component } from 'htm/preact'
// import { render/*, hydrate*/ } from 'preact'
import { createRef, /*hydrate,*/ render } from 'preact';
// import { useState, useLayoutEffect } from 'preact/hooks';
// import shell from './view/shell';
var _path = require('path')
import Cart from '@nichoth/shopping-cart'
var observ = require('observ')


console.log('wooooooo')


// -------------------------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register

// if ('serviceWorker' in navigator) {
//     console.log('we are in')
//     navigator.serviceWorker.register('/sw.js')
//         .then((reg) => {
//             // registration worked
//             console.log('Registration succeeded. Scope is ' + reg.scope)
//         }).catch((error) => {
//             // registration failed
//             console.log('Registration failed with ' + error)
//         })
// } else {
//       console.log('Service workers are not supported.')
// }

// --------------------------------------------------

var cart = new Cart({
    storage: true, // store the state in localStorage?
    key: 'myco-cart'  // default is 'cart'
})


var router = Router()

route(function onRoute (path) {
    console.log('route event', path)

    var m = router.match(path)

    if (!m) {
        console.log('not m', path)
        return
    }

    var { view, getContent } = m.action(m)

    var dirs = path.split('/').filter(Boolean)

    var contentClass = (path === '/' || path === '') ?
        'index' :
        _path.basename(path)

    var isProdPage = (dirs.length === 1 && dirs[0] !== 'products' &&
        dirs[0] !== 'about')
    if (isProdPage) contentClass += ' product-page'

    var el = html`<${Shell} cart=${cart} contentClass=${contentClass}>
        <${view} cart=${cart} getContent=${getContent} />
    <//>`

    render(el, document.getElementById('content'))
})



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
        cart.createIcon(this.ref.current)
    }

    render (props) {
        return html`<div class="nav-part">
            <a href="/cart" class="cart-container" ref=${this.ref}></a>
        </div>
        <div class="shell ${props.contentClass}">
            ${props.children}
        </div>`
    }
}
