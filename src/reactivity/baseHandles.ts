import { trigger, track } from "./effect";
import { ReactiveFlags, readonly, reactive } from "./reactive";
import { isObject, extend } from "./shared";


const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)
function createGetter(isReadonly = false, shallow = false) {
    return function get(target: any, key: any) {

        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly
        } else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly
        }
        const res = Reflect.get(target, key);


        if (shallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res)
        }
        if (!isReadonly) {
            // 收集依赖
            track(target, key);
        }

        return res;
    }
}
function createSetter() {
    return function set(target: any, key: any, value: any) {
        const res = Reflect.set(target, key, value)
        // 触发依赖
        trigger(target, key);
        return res;
    }
}


export const mutableHandles = {
    get,
    set
}
export const readonlyHandles = {
    get: readonlyGet,
    set(target: any, key: any, value: any) {
        console.warn(`key:"${String(key)}" set 失败，因为 ${target} 是 readonly 类型`, target)
        return true;
    }
}

export const shallowReadonlyHandles = extend({}, readonlyHandles, {
    get: shallowReadonlyGet
}) 

