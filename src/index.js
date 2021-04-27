var route = require('route-event')()
var router = require('ruta3')()
import { html } from 'htm/preact'
import { render/*, hydrate*/ } from 'preact'
import { useState, useEffect } from 'preact/hooks';
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

// ------------ router -----------------------

router.addRoute('/', () => {
    return {
        getContent: function getHome () {
            return new Promise((resolve, _reject) => {
                setTimeout(() => {
                    resolve('homeeeee')
                }, 1000)
            })
        },

        view: function () {
            return html`<h1>Myco Moon</h1>
                <ul class="main-nav">
                    <li><a href="/about">about</a></li>
                    <li><a href="/products">products</a></li>
                </ul>
            `
        }
    }
})

router.addRoute('/products', () => {
    console.log('**products route**')

    return {
        getContent: function () {
            return new Promise((resolve, _reject) => {
                setTimeout(() => {
                    resolve('products content')
                }, 1000)
            })
        },
        view: function (props) {
            // in here, could do `useEffect` to fetch the content
            console.log('in view', props)
            var { getContent } = props

            const [content, setContent] = useState(null)

            useEffect(() => {
                getContent()
                    .then(res => {
                        setContent(res)
                    })
                    .catch(err => console.log('errrr', err))
            }, []);

            return html`<div>
                <p>products page</p>
                ${content ? html`<p>${content}</p>` : null}
            </div>`
        }
    }
})

// ------------ /router -----------------------


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
