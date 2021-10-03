import { html } from 'htm/preact'
// var Products = require('./products')
// import { useEffect, useState } from 'preact/hooks';
// var SingleProduct = require('./single-product')


function IndexView (props) {
    // var { getContent, path } = props

    console.log('props in index', props)


    return html`
        <div class="left-part">
            <${HomeView} />

            ${props.children}
        </div>

        <hr class="special-divider" />

        <div class="logo">
            <img src="/img/logo.png" />
        </div>
    `
}

function HomeView () {
    return html`
        <p class="home-text" id="home">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
            do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
    `
}

module.exports = IndexView
