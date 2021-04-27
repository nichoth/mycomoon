var router = require('ruta3')()
import { useState, useEffect } from 'preact/hooks';
import { html } from 'htm/preact'

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

module.exports = router
