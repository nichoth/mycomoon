var route = require('route-event')()
var router = require('./router')
import { html, Component } from 'htm/preact'
// import { render/*, hydrate*/ } from 'preact'
import { createRef, /*hydrate,*/ render } from 'preact';
import { useState, useLayoutEffect } from 'preact/hooks';
// import shell from './view/shell';
var _path = require('path')
import Cart from '@nichoth/shopping-cart'


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


route(function onRoute (path) {
    console.log('route event', path)

    var m = router.match(path)

    if (!m) {
        console.log('not m', path)
        return
    }

    var { view, getContent } = m.action(m)

    var dirs = path.split('/').filter(Boolean)

    var contentClass = path === '/' ?
        'index' :
        _path.basename(path)

    var isProdPage = (dirs.length === 1 && dirs[0] !== 'products' &&
        dirs[0] !== 'about')
    if (isProdPage) contentClass += ' product-page'

    // var el = html`<div class="shell-placeholder ${contentClass}">
    //     <${view} getContent=${getContent} />
    // </div>`

    var el = html`<${Shell} contentClass=${contentClass}>
        <${view} getContent=${getContent} />
    <//>`

    render(el, document.getElementById('content'))
})



class Shell extends Component {
    constructor (props) {
        super(props)
        this.ref = createRef();
    }

    componentDidMount() {
        console.log(this.ref.current);
        // Logs: [HTMLDivElement]

        var cart = new Cart({
            storage: true, // store the state in localStorage?
            key: 'myco-cart'  // default is 'cart'
        })
        cart.createIcon(this.ref.current)
    }

    render (props) {
        return html`<div class="shell-paceholder" ${props.contentClass}>
            <div class="nav-part" ref=${this.ref}>
                <!-- <div ref=${this.ref} id="shopping-cart-icon"></div> -->
            </div>
            ${props.children}
        </div>`
    }
}


// function shell (props) {
//     useLayoutEffect(() => {
//         // cart in here
//     }, [])

//     return html`<div class="shell-paceholder" ${props.contentClass}>
//         <div class="nav-part">
//         </div>
//         ${props.children}
//     </div>`
// }
