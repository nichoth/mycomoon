var route = require('route-event')()
// var router = require('ruta3')()
var router = require('./router')
import { html } from 'htm/preact'
import { render/*, hydrate*/ } from 'preact'
// import shell from './view/shell';


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

    var el = html`<div class="shell-placeholder">
        <${view} getContent=${getContent} />
    </div>`

    // var el = html`<${shell} active=${_path} links=${links}>
    //     <${view} />
    // <//>`

    render(el, document.getElementById('content'))
})
