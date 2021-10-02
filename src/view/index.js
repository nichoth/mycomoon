import { html } from 'htm/preact'
// var Products = require('./products')
// import { useEffect, useState } from 'preact/hooks';
// var SingleProduct = require('./single-product')


function IndexView (props) {
    // var { getContent, path } = props

    console.log('props in index', props)

    return html`
        <div class="left-part">
            ${props.children}
        </div>

        <hr class="special-divider" />

        <div class="logo">
            <img src="/img/logo.png" />
        </div>
    `
}

module.exports = IndexView
