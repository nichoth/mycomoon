var route = require('route-event')()
import { html } from 'htm/preact'
import { render } from 'preact';
import Cart from '@nichoth/shopping-cart'
var struct = require('observ-struct')
var observ = require('observ')
var Shell = require('./view/shell')
var IndexView = require('./view/index')
var Router = require('./router')

// window for testing
var cart = window.cart = new Cart({
    storage: true, // store the state in localStorage?
    key: 'myco-cart'  // default is 'cart'
})

var state = struct({
    slug: observ(null),
    route: observ(''),
    content: observ(null),
    catalog: observ(null),
    cartState: cart.state
})

// fetch the entire catalog right away
var url = new URL('/.netlify/functions/get-catalog', location)
fetch(url)
    .then(res => res.json())
    .then(res => {
        state.catalog.set(res)
    })
    .catch(err => console.log('oh no', err))


var router = Router()

route(function onRoute (path) {
    var m = router.match(path)

    var { slug } = m.action(m)

    state.route.set(path)
    state.slug.set(slug)
})

var el = html`<${Shell} cart=${cart} state=${state}>
    <${IndexView} cart=${cart} setRoute=${route.setRoute} state=${state} />
<//>`

render(el, document.getElementById('content'))
