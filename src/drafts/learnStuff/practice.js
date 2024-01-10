/* eslint-disable no-extend-native */
Function.prototype.clone = () => {
    const that = this
    const temp = function (...args) {
        return that.apply(this,...args)
    }
    for(const key in this) {
        temp[key] = this[key]
    }
    return temp
}


function deepClone(obj, hash = new WeakMap())