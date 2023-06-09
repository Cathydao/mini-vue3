import { readonly, isReadonly, isProxy } from "../reactive";

describe("readonly",()=>{
    it('should make nested values readonly',()=>{
        const original={foo:1};
       const wrapped= readonly(original);

       expect(wrapped).not.toBe(original);
       expect(wrapped.foo).toBe(1);
       expect(isReadonly(wrapped)).toBe(true)
       expect(isReadonly(original)).toBe(false)
       expect(isProxy(original)).toBe(false)
    })

    it('warn then call set',()=>{
        console.warn=jest.fn()
       const wrapped= readonly({foo:1});
       wrapped.foo=2;
       expect(console.warn).toBeCalled()
    })
})