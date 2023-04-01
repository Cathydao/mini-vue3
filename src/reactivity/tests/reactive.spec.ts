import {reactive, isReactive, isProxy} from '../reactive'
describe('reactive',()=>{
   it('happy path',()=>{
       const original = {foo:1};
       const observed=reactive(original);
       expect(observed).not.toBe(original);
       expect(observed.foo).toBe(1);
       expect(isReactive(original)).toBe(false)
       expect(isReactive(observed)).toBe(true)
       expect(isProxy(observed)).toBe(true)
   })

   it('nested reactive',()=>{
      const original={
         foo:{bar:2},
         array:[{age:10}]
      }
      const observed=reactive(original);
      expect(isReactive(observed.foo)).toBe(true)
      expect(isReactive(observed.array)).toBe(true)
      expect(isReactive(observed.array[0])).toBe(true)
      expect(isProxy(observed.array[0])).toBe(true)

   })
})