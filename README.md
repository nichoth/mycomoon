# mycomoon

A website

[![Netlify Status](https://api.netlify.com/api/v1/badges/ec517db2-97d2-48ac-803a-c21453d83cea/deploy-status)](https://app.netlify.com/sites/musing-kirch-9f2f0c/deploys)

* https://medium.com/samsung-internet-dev/pwa-series-service-workers-the-basics-about-offline-a6e8f1d92dfd
* https://www.smashingmagazine.com/2016/02/making-a-service-worker/

---------------------------------------------

* https://css-tricks.com/serviceworker-for-offline/


--------------------------------------

Could browserify the service worker js file, which would let us use the
version number from package.json.

----------------------------------

* https://blog.logrocket.com/every-website-deserves-a-service-worker/

* https://github.com/okitavera/eleventy-plugin-pwa

* https://www.smashingmagazine.com/2019/06/pwa-webpack-workbox/

------------------------------------------------

## 4-15-2021

[branch deploys](https://docs.netlify.com/site-deploys/overview/#branch-deploy-controls)

----------------------------------------

* https://www.smashingmagazine.com/2016/08/a-beginners-guide-to-progressive-web-apps/

-----^-------
* uses a network-first strategy

----------------------------------------------

[caches.match](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/match)

> Note: caches.match() is a convenience method. Equivalent functionality is to call cache.match() on each cache (in the order returned by caches.keys()) until a Response is returned.

## todo

* fix the cache system in service worker. 

-------------------------------------------------------

## 4-16-2020

This is the colorful horizontally snapping one:

> here’s a pen where I made a fully responsive Swipe Views (Carousel) with CSS Grid and Snap Points where neither JavaScript nor CSS media queries are required to achieve the responsiveness.

[Swipe Views with CSS Snap Points](https://medium.com/@_zouhir/swipe-views-with-css-snap-points-building-a-more-efficient-mobile-web-navigation-f9ac8c53dbc0)

-----------------------------------------

This is the demo with the pink smooth scrolling boxes:

[Creating horizontal scrolling containers the right way [CSS Grid]](https://uxdesign.cc/creating-horizontal-scrolling-containers-the-right-way-css-grid-c256f64fc585)

----------------------------------------

[Example 5: 2D image grid](https://css-tricks.com/practical-css-scroll-snapping/#example-5-2d-image-grid) -- could be cool


----------------------------------------------

## square

1. copy the app id and secret to `.env.example`
2. install `square` via npm
3. set up netlify functions. see [build your first function](https://app.netlify.com/sites/mycomoon/functions)

--------------------------------

You can start a local dev server with `netlify dev`

```
my_functions/hello.js
my_functions/hello/hello.js
my_functions/hello/index.js
```

> Any of the above formats would deploy a synchronous serverless function that can be called on the following endpoint, relative to the base URL of your site: `/.netlify/functions/hello`

```
https://dev--mycomoon.netlify.app/.netlify/functions/hello-world
```


https://docs.netlify.com/functions/build-with-javascript/

-----------------------------------

* [create order request](https://github.com/square/square-nodejs-sdk/blob/master/doc/models/create-order-request.md)

----------------------------------------------

[test values](https://developer.squareup.com/docs/testing/test-values)

Payments.CreatePayment (card)
nonce --
```
cnon:card-nonce-ok
```

-----------------------------------------

What am I doing?

Need to create an order on square 
from the myco website


Get the catalog_object_id for your line item 

## test file

I found the access token here:
https://developer.squareup.com/apps
**In the 'account details' part** when you click on `myco-test`

This is different than after you click 'open' on the 'myco moon' website, or
when you click 'open' on the sandbox `myco-test`.
https://developer.squareup.com/apps/sq0idp-tQkeBZJNjlKlfjdxvaBxFg/settings

--------------------------------

## [how to find a location id?](https://www.sellercommunity.com/t5/Point-of-Sale-API/Square-s-API-How-do-I-find-my-Application-ID-Location-ID-amp/td-p/142543)

* Go to https://developer.squareup.com
* The Location ID(s) for your Square account can be found in the Locations tab of your Developer Dashboard.


'default test' location in the 'real' site

LTTBZ5XKA3MGS

----------------------------------------


[Batch Retrieve Inventory Counts](https://github.com/square/square-nodejs-sdk/blob/master/doc/api/inventory.md#batch-retrieve-inventory-counts)


------------------------------------------------

1. make a store type thing on square -- https://developer.squareup.com/apps,
and make some products with pictures. This is done in the 'sandbox account' --
https://squareupsandbox.com/dashboard/


Have an index page that shows one item per item

Then on the item page, you have the ability to select a variation for that item

-----------------------------------------------

in the catalog response, *rlow inventory alerts** are in `locationOverrides`:

```js
{
    "locationId": "LAZSTD2P84MEA",
    "trackInventory": true,
    "inventoryAlertType": "LOW_QUANTITY",
    "inventoryAlertThreshold": "3n"
}
```

vs this one with no alert:
```js
{
    "locationId": "LAZSTD2P84MEA",
    "trackInventory": true
}
```


------------------------------------------------

go through the catalog response, and map the item_variations to quntity

```js
item.itemData.variations[0].id === inventory.counts[0].catalogObjectId
```

the url for functions
```
/.netlify/functions/hello-world
```

`vmin` unit -- the lesser of `vw` and `vh`


--------------------------------------------


```js
"custom_attribute_values": {
    "Square:9b562b5e-b18e-4a91-8877-5b0ea3d433ec": {
    "name": "slug",
    "string_value": "test-slug",
    "custom_attribute_definition_id": "7KFDYZ54EAWBQ64SGDFIASRK",
    "type": "STRING",
    "key": "Square:9b562b5e-b18e-4a91-8877-5b0ea3d433ec"
    }
},
```

In the catalog list response:

```
{
    "type": "ITEM",
    "id": "YEUQ7F6NHHZTFO666FQ5CUVI",
    "updatedAt": "2021-04-29T14:39:41.468Z",
    "version": "1619707181468n",
    "isDeleted": false,
    "customAttributeValues": {
      "Square:9b562b5e-b18e-4a91-8877-5b0ea3d433ec": {
        "name": "slug",
        "stringValue": "test-slug",
        "customAttributeDefinitionId": "7KFDYZ54EAWBQ64SGDFIASRK",
        "type": "STRING",
        "key": "Square:9b562b5e-b18e-4a91-8877-5b0ea3d433ec"
      }
    },
```

This shows the `customAttributeDefinitionId`

-----------------------------------------------

## slugs

You can use the same `customAttributeDefinitionId` string, and replace
the value `stringFilter` in the request. This example uses the same ID with different
search values. In the square UI, I created a custom attribute on each
item with an attribute name of `slug`, and a different attribute value for each.
It re-used the same attribute id.

```js
    customAttributeFilters: [
        {
            "stringFilter": "test-slug",
            // i got this id value from the `test-list-catalog` response
            // not sure if it is visible in the square UI
            "customAttributeDefinitionId": "7KFDYZ54EAWBQ64SGDFIASRK",
        }
    ]
```

vs

```js
customAttributeFilters: [
    {
        "stringFilter": "oos-slug",
        "customAttributeDefinitionId": "7KFDYZ54EAWBQ64SGDFIASRK",
    }
]
```

------------------------------------------
https://github.com/square/square-nodejs-sdk/issues/30#issuecomment-829522492

> you could just use `stringFilter` in the `SearchCatalogItems` instead of `customAttributeDefinitionId` to search by a specific string, I believe, instead of needing to know the actual definition id.

see `textFilter` here: https://github.com/square/square-nodejs-sdk/blob/master/doc/models/search-catalog-items-request.md#fields













