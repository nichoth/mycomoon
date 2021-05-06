function toMoneyFormat (num) {
    var format = (parseInt(num) / 100).toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    })
    return format
}

function withTax (products) {
    return products.reduce(function (tot, prod) {
        var subTot = (prod.price * prod.quantity) 
        var taxes = subTot * .065
        return tot + subTot + taxes
    }, 0)
}

function getTax (products) {
    return products.reduce(function (totalTax, prod) {
        var subTot = (prod.price * prod.quantity) 
        var taxes = subTot * .065
        return totalTax + taxes
    }, 0)
}


module.exports = {
    toMoneyFormat,
    withTax,
    getTax
}
