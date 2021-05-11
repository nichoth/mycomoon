import { html } from 'htm/preact'

function IndexView (props) {
    return html`
        <!-- <h1>Myco Moon</h1> -->
        <ul class="main-nav">
            <li><a href="/about"><div>about</div></a></li>
            <li><a href="/products"><div>products</div></a></li>
        </ul>
    `
}

module.exports = IndexView
