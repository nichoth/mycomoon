import { useState, useEffect } from 'preact/hooks';
import { html } from 'htm/preact'

function Products (props) {
    console.log('in products view', props)

    const [content, setContent] = useState(null)

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
                return setContent(res)
            })
    }, []);

    console.log('products content', content)

    return html`<div>
        ${(content && Object.keys(content).length) ?
            html`<ul class="products-list">
                ${content
                    .filter(item => item.type === 'ITEM')
                    .map(item => {
                        if (item.customAttributeValues) {
                            var key = Object.keys(item.customAttributeValues)[0]
                            var slug = item.customAttributeValues[key].stringValue
                        }

                        return html`<li>
                            <a href="/${slug}">
                                <img src=${item.imageData.url}
                                    alt="mushroom" />
                                <p>${item.itemData.name}</p>
                            </a>
                        </li>`
                    })
                }
            </ul>` :
            null
        }

    </div>`
}

module.exports = Products
