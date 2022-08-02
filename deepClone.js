const isComplexDataType = (obj) =>
    (typeof obj === "object" || typeof obj === "function") && obj !== null
// const deepClone = function (obj, hash = new WeakMap()) {
//     if (obj.constructor === Date) return new Date(obj)
//     if (obj.constructor === RegExp) return new RegExp(obj)

//     // 用weakmap 解决引用循环
//     if (hash.has(obj)) {
//         return hash.get(obj)
//     }
//     // 获取所有属性描述信息
//     let allDesc = Object.getOwnPropertyDescriptors(obj)
//     // 根据新原型对象创建 新对象
//     let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc)

//     hash.set(obj, cloneObj)
//     // Reflect.ownKeys(obj) 可以返回 Symbol属性，和 不可枚举属性
//     for (let key of Reflect.ownKeys(obj)) {
//         cloneObj[key] =
//             isComplexDataType(obj[key]) && typeof obj[key] !== "function"
//                 ? deepClone(obj[key], hash)
//                 : obj[key]
//     }
//     return cloneObj
// }

const deepclone = function (obj, hash = new WeakMap()) {
    if (obj.constructor === Date) return new Date(obj)
    if (obj.constructor === RegExp) return new RegExp(obj)

    if (hash.has(obj)) {
        return hash.get(obj)
    }

    let allDesc = Object.getOwnPropertyDescriptors(obj)
    let cloneObj = Array.isArray(obj)
        ? []
        : Object.create(Object.getPrototypeOf(obj), allDesc)

    hash.set(obj, cloneObj)
    for (let key of Reflect.ownKeys(obj)) {
        let typeCheck = typeof obj[key] === "object" && obj[key] !== null
        cloneObj[key] = typeCheck ? deepclone(obj[key], hash) : obj[key]
    }
    return cloneObj
}

// 演示
let obj = {
    num: 0,
    str: "",
    boolean: true,
    unf: undefined,
    nul: null,
    obj: { name: "我是一个对象", id: 1 },
    arr: [0, 1, 2],
    func: function () {
        console.log("我是一个函数")
    },
    date: new Date(0),
    reg: new RegExp("/我是一个正则/ig"),
    [Symbol("1")]: 1,
}
Object.defineProperty(obj, "innumerable", {
    enumerable: false,
    value: "不可枚举属性",
})
obj = Object.create(obj, Object.getOwnPropertyDescriptors(obj))
obj.loop = obj // 设置loop成循环引用的属性
let cloneObj = deepclone(obj)
cloneObj.arr.push(4)
console.log("obj", obj)
console.log("cloneObj", cloneObj)
console.log(cloneObj.arr.length)
console.log(Object.prototype.toString.call(obj.arr))
