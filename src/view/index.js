import { html } from 'htm/preact'

function IndexView (props) {
    return html`
        <h1>Myco Moon</h1>
        <ul class="main-nav">
            <li><a href="/about">about</a></li>
            <li><a href="/products">products</a></li>
        </ul>
    `
}

module.exports = IndexView
