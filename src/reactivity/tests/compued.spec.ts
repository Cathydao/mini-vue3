import { reactive } from "../reactive";
import { computed } from "../computed";

describe("computed",()=>{
    it("happy path",()=>{
        const user = reactive({
            age:2
        })
        const age = computed(()=>{
            return user.age;
        })
        expect(age.value).toBe(2)
    })

    it ("should compute lazily",()=>{
        const user = reactive({
            age:1
        });
        const getter = jest.fn(()=>{
            return user.age;
        })
         const cValue = computed(getter);
         //lazy
         expect(getter).not.toHaveBeenCalled();

         expect(cValue.value).toBe(1);
         expect(getter).toHaveBeenCalledTimes(1);

         cValue.value;
         expect(getter).toHaveBeenCalledTimes(1);

         user.age=2;
         expect(getter).toHaveBeenCalledTimes(1);

         expect(cValue.value).toBe(2);
         expect(getter).toHaveBeenCalledTimes(2);

         cValue.value;
         expect(getter).toHaveBeenCalledTimes(2);

    })
})