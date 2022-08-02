function myInstanceof(object, constructor) {
    let proto = Object.getPrototypeOf(object)
    while (proto) {
        if (proto === constructor.prototype) return true
        proto = Object.getPrototypeOf(proto)
    }
    return false
}

class Person {}
const obj = new Person()

console.log(obj instanceof Person)
console.log(myInstanceof(obj, Person))
