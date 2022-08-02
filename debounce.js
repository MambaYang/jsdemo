function debounce(fn, delay) {
    let timer = null

    return function () {
        if (timer) {
            clearTimeout(timer)
            timer = null
        }
        timer = setTimeout(() => {
            return fn.apply(this, [...arguments])
        }, delay)
    }
}
