import { useState, useEffect } from 'preact/hooks';
import { html } from 'htm/preact'

function Products (props) {
    console.log('in products view', props)
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
