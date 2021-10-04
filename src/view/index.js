import { html } from 'htm/preact'
// var Products = require('./products')
import { useEffect, useState } from 'preact/hooks';
// var SingleProduct = require('./single-product')
var SingleItem = require('./single-product')


function IndexView (props) {
    var { item } = props

    console.log('props in index', props)

    // console.log('props.children', props.children)

    return html`
        <div class="left-part">
            <${HomeView} />

            ${item ? html`<${SingleItem} ...${props} />` : null}
        </div>

        <hr class="special-divider" />

        ${item ?
            html`<img src=${item.media.source} />` :
            html` <div class="logo">
                <img src="/img/logo.png" />
            </div>`
        }

    `
}

            // ${props.children[0] || props.children}

function HomeView () {
    return html`
        <p class="home-text" id="home">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
            do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
    `
}

module.exports = IndexView
