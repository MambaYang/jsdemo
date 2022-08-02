Function.prototype.myCall = function (ctx, ...args) {
    ctx = ctx === null || ctx === undefined ? globalThis : Object(ctx)
    var key = Symbol("key")
    Object.defineProperty(ctx, key, {
        enumerable: false,
        value: this,
    })
    var result = ctx[key](...args)
    delete ctx[key]
    return result
}

const obj = {
    a: 1,
}

function bar(b) {
    console.log(this)
    console.log(this.a)
    console.log(b)
}

bar.myCall(obj, "b")
