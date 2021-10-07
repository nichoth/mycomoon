import { html } from 'htm/preact'
// import { useEffect, useState } from 'preact/hooks';
var SingleItem = require('./single-product')
var About = require('./about')

function IndexView (props) {
    var { item, route } = props

    console.log('props in index', props)

    return html`
        <div class="left-part">

            ${route === '/about' ?
                (html`
                    <${About} ...${props} />
                    <${SingleItem} ...${props} />
                `) :
                html`
                    <${HomeView} ...${props} />
                    <${SingleItem} ...${props} />
                `
            }
        </div>

        <hr class="special-divider" />

        ${item ?
            html`<img src=${item.media.source} />` :
            html`<div class="logo">
                <img src="/img/logo.png" />
            </div>`
        }
    `
}

            // <${SingleItem} ...${props} />
            // ${props.children[0] || props.children}

function HomeView () {
    return html`
        <div class="home-view">
            <img src="/img/logo.png" />
            <p class="home-text" id="home">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
        </div>
    `
}

module.exports = IndexView
