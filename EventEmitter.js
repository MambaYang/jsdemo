class EventEmitter {
    constructor() {
        if (!EventEmitter.instance) {
            EventEmitter.instance = this
            this.handlesMap = new Map()
        }
        return EventEmitter.instance
    }

    /**
     *
     * 订阅事件
     * @param {String} eventName 事件名
     * @param {Function} callback 回调函数
     */
    on(eventName, callback) {
        const map = this.handlesMap
        if (!map.has(eventName)) {
            map.set(eventName, [])
        }
        map.get(eventName).push(callback)
    }

    /**
     * 发布事件
     * @param {String} eventName 事件名
     * @param  {...any} args 回调函数参数
     */
    emit(eventName, ...args) {
        if (this.handlesMap.has(eventName)) {
            const handles = [...this.handlesMap.get(eventName)]
            handles.forEach((callback) => {
                callback(...args)
            })
        }
    }

    /**
     * 移除订阅的事件和回调函数
     * @param {String} eventName 事件名
     * @param {Function} callback 回调函数
     */
    remove(eventName, callback) {
        const callbacks = this.handlesMap.get(eventName)
        const index = callbacks.indexOf(callback)
        if (index !== -1) {
            callbacks.splice(index, 1)
        }
    }

    /**
     * 订阅只执行一次的事件，执行完立即删除
     * @param {String} eventName 事件名
     * @param {Function} callback 回调函数
     */
    once(eventName, callback) {
        const warpper = (...args) => {
            callback(...args)
            this.remove(eventName, warpper)
        }
        this.on(eventName, warpper)
    }
}
// 测试
const eventBus = new EventEmitter()
eventBus.once("demo", (params) => {
    console.log(1, params)
})
eventBus.on("demo", (params) => {
    console.log(2, params)
})
eventBus.on("demo", (params) => {
    console.log(3, params)
})
eventBus.emit("demo", "someData")

eventBus.emit("demo", "someData")
