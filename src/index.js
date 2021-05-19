var route = require('route-event')()
var Router = require('./router')
import { html } from 'htm/preact'
import { render } from 'preact';
// import { useState, useLayoutEffect } from 'preact/hooks';
// import shell from './view/shell';
var _path = require('path')
import Cart from '@nichoth/shopping-cart'
var Shell = require('./view/shell')


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


// window for testing
var cart = window.cart = new Cart({
    storage: true, // store the state in localStorage?
    key: 'myco-cart'  // default is 'cart'
})

var router = Router()


// need to listen to cart events also, and change the ohno icon accordingly


route(function onRoute (path) {
    console.log('route event', path)


    // in here, on every route change, check the stock of things in the cart
    fetch('/.netlify/functions/get-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            catalogObjectIds: cart.products().map(prod => prod.variationId)
        })
    })
        .then(response => response.json())
        .then(res => {
            console.log('***inventory res', res)

            cart.products().forEach((prod, i) => {
                var wantedQuantity = prod.quantity
                var availableQuantity = parseInt(res[prod.variationId].quantity)
                if (wantedQuantity > availableQuantity) {
                    cart.ohno()
                }
                if (prod.availableQuantity != availableQuantity) {
                    // also update the items in cart with the availableQuantity
                    // if it has changed
                    cart.update(i, { availableQuantity: availableQuantity })
                }
            })
        })


    try {
        var m = router.match(path)
    } catch (err) {
        console.log('caught', err)
    }

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


    // `shell` gets rendered just once
    // gets updated multiple times though


    var el = html`<${Shell} cart=${cart} contentClass=${contentClass} path=${path}>
        <${view} cart=${cart} getContent=${getContent} path=${path} />
    <//>`

    render(el, document.getElementById('content'))
})
