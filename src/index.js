var route = require('route-event')()
var Router = require('./router')
import { html } from 'htm/preact'
import { render } from 'preact';
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
    catalog: observ(null),
    route: observ('/'),
    content: observ(null)
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

var router = Router(state)

subscribe(bus, state)


// for dev
window.setRoute = route.setRoute


route(function onRoute (path) {
    var m = router.match(path)

    // if (!m) {
    //     console.log('not m', path)
    //     return
    // }

    var { getContent } = m.action(m)

    // var dirs = path.split('/').filter(Boolean)

    // var contentClass = (path === '/' || path === '') ?
    //     'index' :
    //     _path.basename(path)

    // var isProdPage = (dirs.length === 1 && dirs[0] !== 'products' &&
    //     dirs[0] !== 'about' && dirs[0] !== 'cart')
    // if (isProdPage) contentClass += ' product-page'

    state.route.set(path)

    if (getContent) {
        getContent()
            .then(res => {
                state.content.set(res)
            })
            .catch(err => {
                console.log('aaaa', err)
            })
    } 
})

var el = html`<${Shell} cart=${cart} state=${state} >
    <${IndexView} cart=${cart} setRoute=${route.setRoute} ...${state()} />
<//>`

render(el, document.getElementById('content'))
