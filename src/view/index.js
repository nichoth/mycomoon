import { html } from 'htm/preact'
// var Products = require('./products')
// import { useEffect, useState } from 'preact/hooks';
// var SingleProduct = require('./single-product')
var SingleItem = require('./single-product')


function IndexView (props) {
    var { item } = props

    console.log('props in index', props)

    return html`
        <div class="left-part">
            <${HomeView} />

            <${SingleItem} ...${props} />
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
