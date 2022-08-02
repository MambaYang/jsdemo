Function.prototype.myapply = function (context = window, args) {
    let key = Symbol("key")
    context[key] = this
    var result = context[key](...args)
    delete context[key]
    return result
}

const obj = {
    a: "a in obj",
}

function bar(b, c) {
    console.log(this.a)
    console.log(b, c)
}

bar.myapply(obj, ["b", "c"])
