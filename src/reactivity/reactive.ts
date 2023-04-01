
import { readonlyHandles, mutableHandles, shallowReadonlyHandles } from "./baseHandles";

export enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly'
}

function createActiveObject(target: any, baseHandlers: any) {
    return new Proxy(target, baseHandlers)
}
export function reactive(raw: any) {
    return createActiveObject(raw, mutableHandles)
}

export function readonly(raw: any) {
    return createActiveObject(raw, readonlyHandles)
}

export function shallowReadonly(raw:any){
    return createActiveObject(raw, shallowReadonlyHandles)
}
// 检测是否是一个reactive--核心：定义一个key，取值即调用get即可判断
export function isReactive(value: any) {
    return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value: any) {
    return !!value[ReactiveFlags.IS_READONLY]
}

export function isProxy(value:any) {
    return isReactive(value) || isReadonly(value)
}