import { shallowReadonly, isReadonly } from "../reactive"


describe('shallowReadonly',()=>{
    it('should not make non-reactive properties reactive',()=>{
        const wrapped = shallowReadonly({foo:{bar:2}});
        expect(isReadonly(wrapped)).toBe(true)
        expect(isReadonly(wrapped.foo)).toBe(false)
    })

    it('warn then call set',()=>{
        console.warn=jest.fn()
       const wrapped= shallowReadonly({foo:1});
       wrapped.foo=2;
       expect(console.warn).toBeCalled()
    })
})