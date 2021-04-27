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
            return fetch('/.netlify/functions/get-catalog')
                .then(response => response.json())
        },

        view: function (props) {
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

            console.log('products content', content)

            return html`<div>
                <h1>products page</h1>

                ${content ?
                    html`<ul class="products-list">
                        ${content
                            .filter(item => item.type === 'ITEM')
                            .map(item => {
                                return html`<li>
                                    <img src=${item.imageData.url}
                                        alt="mushroom" />
                                    <p>${item.itemData.name}</p>
                                </li>`
                            })
                        }
                    </ul>` :
                    null
                }

            </div>`
        }
    }
})

module.exports = router
