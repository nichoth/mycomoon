import { useState, useEffect } from 'preact/hooks';
import { html } from 'htm/preact'

// function Products (props) {
//     return html`<div>
//         <p>the 'products' content</p>
//     </div>`
// }

// module.exports = Products

function Products (props) {
    console.log('props in products view', props)

    const [content, setContent] = useState(null)

    console.log('products content', content)

    useEffect(() => {
        fetch('/.netlify/functions/get-catalog')
            .then(response => {
                console.log('cat res', response)

                if (!response.ok) {
                    console.log('not ok')
                    return response.text().then(t => console.log('t', t))
                }

                return response.json()
            })
            .then(res => {
                console.log('cat res', res)
                return setContent(res.data)
            })
    }, []);

    return html`
        ${(content && Object.keys(content).length) ?
            html`<ul class="products-list">
                ${content
                    .filter(item => item.active)
                    .map(item => {
                        // if (item.customAttributeValues) {
                        //     var key = Object.keys(item.customAttributeValues)[0]
                        //     var slug = item.customAttributeValues[key].stringValue
                        // }

                        return html`<li>
                            <a href="/${item.permalink}">
                                <img src=${item.media.source}
                                    alt="mushroom" />
                                <p>${item.name}</p>
                            </a>
                        </li>`
                    })
                }
            </ul>` :
            null
        }
    `
}

module.exports = Products
