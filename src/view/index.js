import { html, Component } from 'htm/preact'
import { useEffect, useState } from 'preact/hooks';

function IndexView (props) {
    var { path } = this.props
    
    return html`
        <!-- <h1>Myco Moon</h1> -->
        <ul class="main-nav">
            <li class="tab${path.includes('about') ? ' active' : ''}">
                <a href="/about"><div>about</div></a>
            </li>
            <li class="tab${path.includes('products') ? ' active' : ''}">
                <a href="/products"><div>products</div></a>
            </li>
        </ul>
    `
}

module.exports = IndexView
