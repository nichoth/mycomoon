var route = require('route-event')()
import { html } from 'htm/preact'
import { render } from 'preact';
import Cart from '@nichoth/shopping-cart'
import EVENTS from '@nichoth/shopping-cart/src/EVENTS'
var struct = require('observ-struct')
var observ = require('observ')
var Shell = require('./view/shell')
var IndexView = require('./view/index')
var Router = require('./router')

var state = struct({
    slug: observ(null),
    route: observ(''),
    content: observ(null)
})

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

var router = Router(state)

route(function onRoute (path) {
    var m = router.match(path)

    var { getContent, slug } = m.action(m)

    state.route.set(path)
    state.slug.set(slug)

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

var el = html`<${Shell} cart=${cart} state=${state}>
    <${IndexView} cart=${cart} setRoute=${route.setRoute} ...${state()} />
<//>`

render(el, document.getElementById('content'))
