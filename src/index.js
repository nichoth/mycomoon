// var route = require('route-event')()
// var Router = require('./router')
import { html } from 'htm/preact'
import { render } from 'preact';
import Cart from '@nichoth/shopping-cart'
import EVENTS from '@nichoth/shopping-cart/src/EVENTS'
var Shell = require('./view/shell')
var IndexView = require('./view/index')

var struct = require('observ-struct')
var observ = require('observ')
// var Bus = require('@nichoth/events')
// var evs = require('./EVENTS')
// var xtend = require('xtend')

// var bus = Bus({ memo: true })
var state = struct({
    slug: observ(null),
    route: observ(''),
    content: observ(null)
})

// function subscribe (bus, state) {
//     // bus.on(evs.product.got, ev => {
//     //     var newItem = {}
//     //     newItem[ev.permalink] = ev
//     //     var newState = state.catalog() ?
//     //         xtend((state && state.catalog() || {}), newItem) :
//     //         newItem
//     //     state.catalog.set(newState)
//     // })
// }

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

// var router = Router(state)

// subscribe(bus, state)


// should move the onRoute callback into the index view
// or the single-product view

// route(function onRoute (path) {
//     var m = router.match(path)

//     var { getContent, slug } = m.action(m)

//     state.route.set(path)
//     state.slug.set(slug)

//     if (getContent) {
//         getContent()
//             .then(res => {
//                 state.content.set(res)
//             })
//             .catch(err => {
//                 console.log('aaaa', err)
//             })
//     } 
// })

// var el = html`<${Shell} cart=${cart} state=${state}>
//     <${IndexView} cart=${cart} setRoute=${route.setRoute} ...${state()} />
// <//>`

var el = html`<${Shell} cart=${cart} state=${state}>
    <${IndexView} cart=${cart} ...${state()} />
<//>`

render(el, document.getElementById('content'))
