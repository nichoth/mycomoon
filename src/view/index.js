import { html } from 'htm/preact'
var Products = require('./products')
// import { useEffect, useState } from 'preact/hooks';

function IndexView (props) {
    var { getContent, path } = props

    console.log('props', props)

    // we're doing it this weird way because it doesn't work if you use a HOC
    return html`
        <p>the index content</p>

        <!-- <ul class="main-nav">
            <li class="tab${path === '/' ? ' active' : ''}">
                <a href="/"><h2>
                    <span class="dot">${path === '/' ? '●' : '⚬'}${'\u00A0'}</span>
                    products
                </h2></a>
                <div class="page-content">
                    <${Products} />
                </div>
            </li>

            <li class="tab${path.includes('about') ? ' active' : ''}">
                <a href="/about"><h2>
                    <span class="dot">${path === '/about' ? '●' : '⚬'}${'\u00A0'}</span>
                    about
                </h2></a>
                <div class="page-content">the about content</div>
            </li>
        </ul> -->
    `
}

module.exports = IndexView
