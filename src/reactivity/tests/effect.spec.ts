import {effect,stop} from '../effect'
import { reactive } from '../reactive';
describe('effect',()=>{
    it('happen path',()=>{
        const user = reactive({age:10});
        let nextAge;
        effect(()=>{
            nextAge= user.age+1;
        });
        expect(nextAge).toBe(11);

        // 更新
        user.age++;
        expect(nextAge).toBe(12)
    })

    it('effect return runner function',()=>{
        let foo=10;
        let runner = effect(()=>{
            foo++;
            return 'foo'
        });
        expect(foo).toBe(11);
        const r =runner();
        expect(foo).toBe(12);
        expect(r).toBe('foo')
    })

    it('scheduler',()=>{
        // scheduler是一个函数
        // 初始化时，scheduler不会执行，但会执行fn
        // 当响应式对象的值发生变化（即调用reactive的set函数时）会调用scheduler,不会调用fn
        // 当手动执行effect返回函数时，执行的是fn
        let dummy;
        let run;
        const scheduler=jest.fn(()=>{
           run =runner
        })
        const obj =reactive({foo:1});

        const runner =effect(()=>{
            dummy=obj.foo;
        },
        {scheduler});

        expect(dummy).toBe(1);
        expect(scheduler).not.toHaveBeenCalled();

        obj.foo++;
        expect(scheduler).toHaveBeenCalledTimes(1);
        expect(dummy).toBe(1);
        runner()
        expect(dummy).toBe(2);

    })

    it('stop',()=>{
        // 调用stop之后，响应式对象更新时，effect不再自动更新（即调用stop时将deps中的依赖删除
        // 接收参数runner
        // 可以手动执行runner,但不会恢复自动更新

        const user = reactive({age:1});
        let dump;
        const runner = effect(()=>{
            dump = user.age;
        });
        expect(dump).toBe(1);
        stop(runner);
        user.age=2;
        expect(dump).toBe(1);
        user.age++;// get的时候收集以来
        expect(dump).toBe(1);
        runner();
        expect(dump).toBe(3);
        user.age++;
        expect(dump).toBe(3);
    })

    it('onStop',()=>{
        let dump;
        const user=reactive({age:1});
        const onStop=jest.fn()
        const runner=effect(()=>{
            dump=user.age;
        },{
            onStop
        });

        stop(runner);
        expect(onStop).toHaveBeenCalledTimes(1)
    })
})