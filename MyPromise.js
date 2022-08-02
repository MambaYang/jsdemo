const PENDING = "pending"
const FULFILLED = "fulfilled"
const REJECTED = "rejected"

class MyPromise {
    constructor(executor) {
        try {
            // 立即执行器
            executor(this.resolve, this.reject)
        } catch (error) {
            // 如果有错误，就直接执行 reject
            this.reject(error)
        }
    }

    // 状态
    status = PENDING

    // 成功之后的值
    value = null
    // 失败之后的值
    reason = null
    // 存储成功回调函数
    onFulfilledCallback = []
    // 存储失败回调函数
    onRejectedCallback = []

    // 用箭头函数是因为this指向的是当前实例对象
    resolve = (value) => {
        if (this.status === PENDING) {
            // 修改状态
            this.status = FULFILLED
            // 保存成功之后的值
            this.value = value
            // 循环调用成功的回调
            while (this.onFulfilledCallback.length) {
                this.onFulfilledCallback.shift()(value)
            }
        }
    }
    reject = (reason) => {
        if (this.status === PENDING) {
            this.status = REJECTED
            this.reason = reason
            while (this.onRejectedCallback.length) {
                this.onRejectedCallback.shift()(reason)
            }
        }
    }

    then(onFulfilled, onRejected) {
        // 如果不传，就使用默认函数
        const realOnFulfilled =
            typeof onFulfilled === "function" ? onFulfilled : (value) => value
        const realOnRejected =
            typeof onRejected === "function"
                ? onRejected
                : (reason) => {
                      throw reason
                  }

        const promise2 = new MyPromise((resolve, reject) => {
            const fulfilledMicrotask = () => {
                // 创建一个微任务等待 promise2 完成初始化
                queueMicrotask(() => {
                    try {
                        // 获取成功回调函数的执行结果
                        const x = realOnFulfilled(this.value)
                        // 传入 resolvePromise 集中处理
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                })
            }

            const rejectedMicrotask = () => {
                // 创建一个微任务等待 promise2 完成初始化
                queueMicrotask(() => {
                    try {
                        // 调用失败回调，并且把原因返回
                        const x = realOnRejected(this.reason)
                        // 传入 resolvePromise 集中处理
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                })
            }

            if (this.status === FULFILLED) {
                fulfilledMicrotask()
            } else if (this.status === REJECTED) {
                rejectedMicrotask()
            } else if (this.status === PENDING) {
                this.onFulfilledCallback.push(fulfilledMicrotask)
                this.onRejectedCallback.push(rejectedMicrotask)
            }
        })
        return promise2
    }

    static resolve(parameter) {
        // 如果传入是 promise 直接返回
        if (parameter instanceof MyPromise) {
            return parameter
        }

        return new MyPromise((resolve) => {
            resolve(parameter)
        })
    }
    static reject(reason) {
        return new MyPromise((resolve, reject) => {
            reject(reason)
        })
    }
    // static all(promises) {
    //     return new MyPromise((resolve, reject) => {
    //         const result = []
    //         let index = 0
    //         if (promises.length === 0) {
    //             resolve(result)
    //             return
    //         }

    //         for (let promise of promises) {
    //             MyPromise.resolve(promise).then(
    //                 (value) => {
    //                     result[index] = value
    //                     index++
    //                     if (index === promises.length) resolve(result)
    //                 },
    //                 (error) => {
    //                     reject(error)
    //                 }
    //             )
    //         }
    //     })
    // }

    static all(promises) {
        return new MyPromise((resolve, reject) => {
            if (promises.length === 0) resolve([])
            const result = []
            promises.forEach((promise, index) => {
                MyPromise.resolve(promise).then(
                    (value) => {
                        result[index] = value
                        if (index === promises.length - 1) resolve(result)
                    },
                    (reason) => {
                        reject(reason)
                    }
                )
            })
        })
    }

    static allSettled(promises) {
        return new MyPromise((resolve, reject) => {
            const result = []
            let count = 0
            if (!promises.length) resolve(result)
            const addData = (status, i, value, reason) => {
                result[i] =
                    status === "fulfilled"
                        ? { status, value }
                        : { status, reason }
                count++
                if (count === promises.length) resolve(result)
            }

            promises.forEach((promise, i) => {
                MyPromise.resolve(promise).then(
                    (value) => {
                        addData("fulfilled", i, value, null)
                    },
                    (reason) => {
                        addData("rejected", i, null, reason)
                    }
                )
            })
        })
    }

    static race(promises) {
        return new MyPromise((resolve, reject) => {
            for (let promise of promises) {
                MyPromise.resolve(promise).then(
                    (value) => {
                        resolve(value)
                    },
                    (reason) => {
                        reject(reason)
                    }
                )
            }
        })
    }

    static any(promises) {
        return new MyPromise((resolve, reject) => {
            let count = 0
            for (let promise of promises) {
                MyPromise.resolve(promise).then(
                    (value) => {
                        resolve(value)
                    },
                    (reason) => {
                        count++
                        if (count === promises.length) {
                            reject(
                                "[AggregateError: All promises were rejected]"
                            )
                        }
                    }
                )
            }
        })
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(
            new TypeError("Chaining cycle detected for promise #<Promise>")
        )
    }
    // 判断x 是不是 MyPromise 实例对象
    if (x instanceof MyPromise) {
        // x 是新的promise，执行并调用then
        x.then(resolve, reject)
    } else {
        resolve(x)
    }
}

// test

const promise1 = MyPromise.resolve(-3)
const promise2 = 42
const promise3 = new MyPromise((resolve, reject) => {
    setTimeout(resolve, 100, "foo")
})

MyPromise.all([promise1, promise2, promise3]).then(
    (values) => {
        console.log(values)
    },
    (reason) => {
        console.log(reason)
    }
)
