import { html } from 'htm/preact'
import { useEffect, useState } from 'preact/hooks';
var SingleItem = require('./single-product')
var Route = require('route-event')
// var About = require('./about')
var Router = require('../router')
var router = Router()

var routeEvent = Route()

function IndexView (props) {
    console.log('ppppp', props)

    var [route, setRoute] = useState({ route: '', slug: '' })
    var [content, setContent] = useState(null)
    var item = content

    routeEvent(function onRoute (path) {
        console.log('**on route', path)
        var m = router.match(path)
        var { getContent, slug } = m.action(m)

        // in here we set the state
        setRoute({ route: path, slug })

        if (getContent) {
            getContent()
                .then(res => {
                    setContent(res)
                })
                .catch(err => {
                    console.log('aaaa', err)
                })
        } 
    })


    return html`
        <div class="left-part">
            <${HomeView} ...${props} />
            <${SingleItem} ...${props} content=${content} route=${route} />
        </div>

        <hr class="special-divider" />

        ${(route.route === '/') ?
            html`<div class="logo">
                <img src="/img/logo.png" />
            </div>` :
            html`<img src=${item && item.media.source} />`
        }
    `
}

function HomeView (props) {
    // component did update
    useEffect(() => {
        if (props.route !== '/') return
        document.getElementById('home').scrollIntoView(true)
    })

    return html`
        <div class="home-view">
            <img src="/img/logo.png" />

            <div class="home-text" id="home">
                <p>
                    Myco Moon wants to share their love for functional mushrooms
                    with the world. Their extracts are made from small batches of
                    homegrown Lion's Mane, Reishi, Turkey Tail, & Chaga mushrooms.
                </p>
                <p>
                    Funghi has the power to heal and balance the body and mind,
                    while simultaneously restoring environments and ecosystems.
                </p>
            </div>
        </div>
    `
}

module.exports = IndexView
