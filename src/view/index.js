import { html } from 'htm/preact'
import { useEffect } from 'preact/hooks';





function IndexView (props) {
    return html`<div>index</div>`
}

module.exports = IndexView




// var SingleItem = require('./single-product')

// function IndexView (props) {
//     var item = props.content
//     var path = props.route

//     console.log('path', path)

//     return html`
//         <div class="left-part">
//             <${HomeView} ...${props} />
//             <${SingleItem} ...${props} />
//         </div>

//         <hr class="special-divider" />

//         <div class="right-part">
//             ${(item && path === '/') ?
//                 html`
//                     <div class="logo">
//                         <img src="/img/logo.png" />
//                     </div>
//                 ` :
//                 html`
//                     <div class="logo">
//                         <img src="/img/logo.png" alt="mycomoon logo" />
//                     </div>
//                     ${(item && item.media) ?
//                         html`<div class="product-img">
//                             <img src=${item.media.source} />
//                         </div>` :
//                         null
//                     }
//                 `
//             }
//         </div>
//     `
// }

// function HomeView (props) {
//     useEffect(() => {  // component did update
//         if (props.route !== '/') return
//         document.getElementById('home').scrollIntoView(true)
//     })

//     return html`
//         <div class="home-view">
//             <img src="/img/logo.png" />

//             <div class="home-text" id="home">
//                 <p>
//                     Myco Moon wants to share their love for functional mushrooms
//                     with the world. Their extracts are made from small batches of
//                     homegrown Lion's Mane, Reishi, Turkey Tail, & Chaga mushrooms.
//                 </p>
//                 <p>
//                     Funghi has the power to heal and balance the body and mind,
//                     while simultaneously restoring environments and ecosystems.
//                 </p>
//             </div>
//         </div>
//     `
// }

// module.exports = IndexView
