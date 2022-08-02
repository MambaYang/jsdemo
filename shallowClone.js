const shallowClone = (target) => {
    if (typeof target === "object" && target !== null) {
        const cloneTarget = Array.isArray(target) ? [] : {}
        for (let prop in target) {
            if (target.hasOwnProperty(prop)) {
                cloneTarget[prop] = target[prop]
            }
        }
        return cloneTarget
    } else {
        return target
    }
}

const shallowclone = (target) => {
    if (typeof target === "object" && target !== null) {
        const cloneObj = Array.isArray(target) ? [] : {}
        for (let prop in target) {
            if (target.hasOwnProperty(prop)) {
                cloneObj[prop] = target[prop]
            }
        }
        return cloneObj
    } else {
        return target
    }
}

const arr = [1, 2, { a: "a" }]

const newArr = shallowClone(arr)
newArr[1] = 3
newArr[2].a = "b"
console.log(arr)
console.log(newArr)
