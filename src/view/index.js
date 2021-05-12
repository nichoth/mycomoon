import { html } from 'htm/preact'

function createIndexView (activePart) {

    return function IndexView (props) {
        return html`
            <!-- <h1>Myco Moon</h1> -->
            <ul class="main-nav">
                <li class="tab${activePart === 'about' ? ' active' : ''}">
                    <a href="/about"><div>about</div></a>
                </li>
                <li class="tab${activePart === 'products' ? ' active' : ''}">
                    <a href="/products"><div>products</div></a>
                </li>
            </ul>
        `
    }

}

module.exports = createIndexView
