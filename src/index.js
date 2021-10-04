var route = require('route-event')()
var Router = require('./router')
import { html } from 'htm/preact'
import { render } from 'preact';
// import { useState, useLayoutEffect } from 'preact/hooks';
var _path = require('path')
import Cart from '@nichoth/shopping-cart'
import EVENTS from '@nichoth/shopping-cart/src/EVENTS'
var Shell = require('./view/shell')
var IndexView = require('./view/index')

var struct = require('observ-struct')
var observ = require('observ')
var Bus = require('@nichoth/events')
var evs = require('./EVENTS')
var xtend = require('xtend')

// var { ITEMS } = require('./CONSTANTS')

var bus = Bus({ memo: true })
var state = struct({
    catalog: observ(null)
})

function subscribe (bus, state) {
    bus.on(evs.product.got, ev => {
        var newItem = {}
        newItem[ev.permalink] = ev
        var newState = state.catalog() ?
            xtend((state && state.catalog() || {}), newItem) :
            newItem
        state.catalog.set(newState)
    })
}

// state(_state => {
//     console.log('**debug new state', _state)
// })

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

cart.on(EVENTS.product.change, (index, updatedProduct) => {
    console.log('product change', updatedProduct)
})

console.log('cart state', cart.state())

var router = Router(state, bus)

subscribe(bus, state)


// for dev
window.setRoute = route.setRoute


route(function onRoute (path) {
    console.log('route event', path)

    var m = router.match(path)

    if (!m) {
        console.log('not m', path)
        return
    }

    var { view, getContent, slug } = m.action(m)

    var dirs = path.split('/').filter(Boolean)

    var contentClass = (path === '/' || path === '') ?
        'index' :
        _path.basename(path)

    var isProdPage = (dirs.length === 1 && dirs[0] !== 'products' &&
        dirs[0] !== 'about' && dirs[0] !== 'cart')
    if (isProdPage) contentClass += ' product-page'

    // here we take the view returned from router, and use it as a child of
    // `shell`
    // need to always render the `index` view, and pass it a child that
    //   is the content corresponding to url

    if (getContent) {
        getContent()
            .then(res => {
                console.log('in res', res)
                var el = html`<${Shell} cart=${cart} contentClass=${contentClass}
                    path=${path} slug=${slug}
                >
                    <${IndexView} cart=${cart} slug=${slug} item=${res}
                        setRoute=${route.setRoute} path=${path}
                    >
                        <${view} cart=${cart} item=${res} path=${path}
                            slug=${slug}
                        />
                    <//>
                <//>`

                render(el, document.getElementById('content'))
            })
            .catch(err => {
                console.log('aaaa', err)
            })
    } 

    var el = html`<${Shell} cart=${cart} contentClass=${contentClass}
        path=${path} slug=${slug}
    >
        <${IndexView} cart=${cart} slug=${slug} setRoute=${route.setRoute}
            path=${path}
        >
            <${view} cart=${cart} path=${path} slug=${slug} path=${path} />
        <//>
    <//>`

    render(el, document.getElementById('content'))

})
