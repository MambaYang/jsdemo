function throttle(fn, delay) {
    let preTime = Date.now()
    return function () {
        let nowTime = Date.now()
        if (nowTime - preTime >= delay) {
            preTime = Date.now()
            return fn.call(this, ...arguments)
        }
    }
}
