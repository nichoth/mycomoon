import { html } from 'htm/preact'
import { useEffect } from 'preact/hooks';
var SingleItem = require('./single-product')
// var About = require('./about')

function IndexView (props) {
    var item = props.content

    console.log('**props in index', props)

    return html`
        <div class="left-part">
            <${HomeView} ...${props} />
            <${SingleItem} ...${props} />
        </div>

        <hr class="special-divider" />

        ${item ?
            html`<img src=${item.media.source} />` :
            html`<div class="logo">
                <img src="/img/logo.png" />
            </div>`
        }
    `
}

function HomeView (props) {
    console.log('**props', props)
    // component did update
    useEffect(() => {
        document.getElementById('home').scrollIntoView()
    })

    return html`
        <div class="home-view">
            <img src="/img/logo.png" />

            <div class="home-text" id="home">
                <p>
                    Myco Moon wants to share their love for functional mushrooms
                    with the world. Their extracts are made from small batches of
                    homegrown Lion's Mane, Reishi, Turkey Tail, & Chaga mushrooms.
                </p>
                <p>
                    Funghi has the power to heal and balance the body and mind,
                    while simultaneously restoring environments and ecosystems.
                </p>
            </div>
        </div>
    `
}

module.exports = IndexView
