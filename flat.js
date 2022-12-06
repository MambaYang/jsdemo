var arr1 = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]]
function flatDeep(arr, depth = 1) {
    if (!depth) return arr.slice()
    return arr.reduce(
        (acc, val) =>
            acc.concat(Array.isArray(val) ? flatDeep(val, depth - 1) : val),
        []
    )
}

console.log(flatDeep(arr1, 1))
