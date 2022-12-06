Function.prototype.myCall = function (ctx = window, ...args) {
    const key = Symbol("key");
    Object.defineProperty(ctx, key, {
        value: this,
    });
    const result = ctx[key](...args);
    delete ctx[key];
    return result;
};

Function.prototype.myApply = function (ctx = window, args) {
    const key = Symbol("key");
    Object.defineProperty(ctx, key, {
        value: this,
    });
    const result = ctx[key](...args);
    delete ctx[key];
    return result;
};

Function.prototype.myBind = function (ctx, ...args) {
    if (typeof this !== "fucntion") {
        throw TypeError("类型错误");
    }
    const _this = this;
    return function F() {
        if (this instanceof F) {
            return new _this(...args, ...arguments);
        }
        return _this.apply(ctx, args.concat(...arguments));
    };
};

function debounce(fn, delay) {
    let timer = null;
    return function () {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(() => {
            return fn.apply(this, [...arguments]);
        }, delay);
    };
}

function throttle(fn, delay) {
    let preTime = Date.now();
    return function () {
        let nowTime = Date.now();
        if (nowTime - preTime >= delay) {
            preTime = Date.now();
            return fn.call(this, ...arguments);
        }
    };
}

function flat(arr, depth) {
    if (!depth) return arr.slice();
    return arr.reduce((acc, val) => {
        acc.concat(Array.isArray(val) ? flat(arr, depth - 1) : val);
    }, []);
}

function myInstanceof(obj, constructor) {
    let proto = Object.getPrototypeOf(obj);
    while (proto) {
        if (proto === constructor.prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
    return false;
}

function shallowClone(target) {
    if (target === "object" && target !== null) {
        const cloneTarget = Array.isArray(target) ? [] : {};
        for (let prop in target) {
            if (target.hasOwnproperty(prop)) {
                cloneTarget[prop] = target[prop];
            }
        }
        return cloneTarget;
    } else {
        return target;
    }
}

function deepClone(obj, hash = new WeakMap()) {
    if (obj.constructor === Date) return new Date(obj);
    if (obj.constructor === RegExp) return new RegExp(obj);

    if (hash.has(obj)) return hash.get(obj);

    const allDesc = Object.getOwnPropertyDescriptors(obj);
    const cloneObj = Array.isArray(obj)
        ? []
        : Object.create(Object.getPrototypeOf(obj), allDesc);

    hash.set(obj, cloneObj);

    for (let key of Reflect.ownKeys(obj)) {
        const typeCheck = typeof obj[key] === "object" && obj[key] !== null;
        cloneObj[key] = typeCheck ? deepClone(obj[key], hash) : obj[key];
    }
    return cloneObj;
}
