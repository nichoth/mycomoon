import { html } from 'htm/preact'
// var Products = require('./products')
// import { useEffect, useState } from 'preact/hooks';

function IndexView (props) {
    // var { getContent, path } = props

    console.log('props', props)

    // we're doing it this weird way because it doesn't work if you use a HOC
    return html`
        <div class="logo">
            <img src="/img/logo.jpeg" />
        </div>
    `
}

module.exports = IndexView
