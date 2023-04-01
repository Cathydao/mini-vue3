import { extend } from './shared/index';
let activeEffect: any;
let shouldTrack: any;
class ReactiveEffect {
    private _fun: Function;
    public scheduler: Function | undefined;
    active: any = true;
    onStop?: () => void;
    public deps: any = [];
    public stopFlag: Boolean = false;
    constructor(fn: Function, scheduler?: Function) {
        this._fun = fn;
        this.scheduler = scheduler
    }
    run() {
        if (!this.active) {
            return this._fun()
        }
        activeEffect = this;
        shouldTrack = true;
        const result = this._fun();
        shouldTrack = false;

        return result
    }
    stop() {
        if (this.active) {
            clearupEffect(this)
            if (this.onStop) {
                this.onStop()
            }
            this.active = false;
        }

    }
}

function clearupEffect(effect: any) {
    effect.deps.forEach((dep: any) => {
        dep.delete(effect)
    });
}
let targetsMap = new Map();
export function track(target: any, key: any) {
    
    if (!isTracking()) return;
    let depsMap = targetsMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetsMap.set(target, depsMap)
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep)
    }
     
    if (dep.has(activeEffect)) return;
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
}

function isTracking() {
    return shouldTrack && activeEffect!==undefined;
}

export function trigger(target: any, key: any) {
    let depsMap = targetsMap.get(target);
    // console.log('targetsMap',targetsMap)
    // console.log('demp',depsMap)
    // console.log('target',target)
    // console.log('key',key)
    let dep = depsMap.get(key);
    for (const _effect of dep) {
        if (_effect.scheduler) {
            _effect.scheduler()
        } else {
            _effect.run()
        }

    }
}
export function stop(runner: any) {
    runner.effect.stop()
}
export function effect(fn: Function, options?: any) {
    const scheduler = options && options.scheduler;
    const _effect = new ReactiveEffect(fn, scheduler);
    //挂载传进来的属性
    extend(_effect, options)
    // _effect.onStop=options.onStop
    _effect.run();
    const runner: any = _effect.run.bind(activeEffect);
    runner.effect = _effect;
    return runner
}