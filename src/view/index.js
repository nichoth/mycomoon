import { html, Component } from 'htm/preact'
// import { useEffect, useState } from 'preact/hooks';

function IndexView (props) {
    // we're doing it this weird way because it doesn't work if you use a HOC
    var { path } = this.props

    return html`
        <ul class="main-nav">
            <li class="tab${path.includes('about') ? ' active' : ''}">
                <a href="/about"><h2>about</h2></a>
                <div class="page-content">the about content</div>
            </li>

            <li class="tab${path.includes('products') ? ' active' : ''}">
                <a href="/products"><h2>products</h2></a>
            </li>
        </ul>
    `
}

module.exports = IndexView
