// 组合继承
function Parent(val) {
    this.val = val
}

Parent.prototype.getValue = function () {
    console.log(this.val)
}

function Child(val) {
    Parent.call(this, val) // 继承父类属性
    this.b = "a"
}

// 子类原型指向 父类实例，继承父类函数
// Child.prototype = new Parent()

// 改造为寄生组合继承
Child.prototype = Object.create(Parent.prototype, {
    constructor: {
        value: Child,
        enumerable: false,
        writable: true,
        configurable: true,
    },
})

const child = new Child(1)
child.getValue()
console.log(child instanceof Parent)

/* **************************************** */
