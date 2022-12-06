function curry(fn, args = []) {
    // 传入curry的 函数fn 的参数的数量
    const length = fn.length
    return function () {
        // 拷贝传入 curry() 的所有参数 args
        const _args = args.slice()
        // 将curry返回的函数参数合并到args上
        _args.push(...arguments)
        // 如果目前参数总数未到达 length总数量，说明还有参数没有上传
        if (_args.length < length) {
            return curry.call(this, fn, _args)
        } else {
            return fn.apply(this, _args)
        }
    }
}

const fn = curry(function (a, b, c) {
    console.log([a, b, c])
})

fn("a", "b", "c") // ["a", "b", "c"]
fn("a", "b")("c") // ["a", "b", "c"]
fn("a")("b")("c") // ["a", "b", "c"]
fn("a")("b", "c") // ["a", "b", "c"]

// 总结：判断参数数量，如果未达到函数总数量，则继续带着已传参数执行curry函数
