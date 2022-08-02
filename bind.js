Function.prototype.mybind = function (context = window, ...args) {
    if (typeof this !== "function") {
        return new TypeError("类型错误！")
    }
    var _this = this
    return function F() {
        if (this instanceof F) {
            return new _this(...args, ...arguments)
        }
        return _this.apply(context, args.concat(...arguments))
    }
}

const obj = {
    a: "a in obj",
}

function bar(b, c) {
    // this.a = "a in bar"
    console.log(this.a)
    console.log(b, c)
}

let fn = bar.mybind(obj, "bb")
fn("cc")
// let newFn = new fn("cc")
// console.log(newFn.a)
