import { html } from 'htm/preact'
// var Products = require('./products')
// import { useEffect, useState } from 'preact/hooks';

function IndexView (props) {
    // var { getContent, path } = props

    console.log('props in index', props)

    return html`
        <div class="logo">
            <img src="/img/logo.png" />
        </div>

        <hr class="special-divider" />

        <p class="home-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
    `
}

module.exports = IndexView
