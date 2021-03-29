// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register

if ('serviceWorker' in navigator) {
    console.log('we are in')
    navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
            // registration worked
            console.log('Registration succeeded. Scope is ' + reg.scope)
        }).catch((error) => {
            // registration failed
            console.log('Registration failed with ' + error)
        })
} else {
      console.log('Service workers are not supported.')
}

