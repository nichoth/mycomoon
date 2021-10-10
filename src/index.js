var route = require('route-event')()
import { html } from 'htm/preact'
import { render } from 'preact';
import Cart from '@nichoth/shopping-cart'
var struct = require('observ-struct')
var observ = require('observ')
var Shell = require('./view/shell')
// var IndexView = require('./view/index')
var Router = require('./router')

var state = struct({
    slug: observ(null),
    path: observ(null),
    catalog: observ(null)
})

// request the product right away
var url = new URL('/.netlify/functions/get-catalog', location)
fetch(url)
    .then(res => res.json())
    .then(res => state.catalog.set(res))
    .catch(err => console.log('oh no', err))

// window for testing
var cart = window.cart = new Cart({
    storage: true, // store the state in localStorage?
    key: 'myco-cart'  // default is 'cart'
})

var router = Router(state)

route(function onRoute (path) {
    var match = router.match(path)

    var { slug, view } = match.action(match)

    state.path.set(path)
    state.slug.set(slug)

    var el = html`<${Shell} cart=${cart} state=${state}>
        <${view} cart=${cart} state=${state} />
    <//>`

    render(el, document.getElementById('content'))
})

