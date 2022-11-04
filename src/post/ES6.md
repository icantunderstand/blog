---
title: ES6基础语法
date: "2018-03-19"
tags: JavaScript
path: /es6-basic
---

## 变量
在javascript中声明变量有下面的几种方式: var  / const(let)  下面来梳理下这几种声明变量方式的区别。  

| 声明方式 | 声明提升 | 作用域| 
| ------ | ------ | ------ |  
| let/const | Temporal Dead Zone | 块级作用域 |  
| var | 提升 | 函数作用域, 进入到声明该变量的函数作用域分配空间并且初始化值为undefined,执行到赋值语句后进行赋值 |  

### var
在进入声明该变量的函数作用域的时候,会为其分配空间并且初始化值为undefined,在执行到对var赋值的语句的时候会对该变量进行赋值(如果没有赋值就是undefined)  
### let 
在进入声明该变量的块级作用域的时候,会为其分配空间此时这个变量是未初始化的(引用一个未初始化的变量会导致引用错误),到达对该变量的赋值语句的时候进行变量的赋值(否则为undefined)。  
### const
跟let的行为类似,但是需要进行初始化的值(不允许修改指向)  

下面是一些简单的例子来帮助理解上面的点  

    let tmp = true;
    if (true) {
        // 引用未初始化的变量引用错误
        //  console.log(tmp); // ReferenceError
    
        let tmp; // 初始化为undefined
        console.log(tmp); // undefined
    
        tmp = 123;
        console.log(tmp); // 123
    }
    console.log(tmp);// true

    if (true) {
      const func = function () {
        console.log(myVar); // 3
      };
      let myVar = 3; 
      func();  
    }
在循环中var和let/const的表现  

    const arr = [];
    for (var i=0; i < 3; i++) {
        arr.push(() => i);
    }
    arr.map(x => x()); // [3,3,3]  每个变量都指向一个绑定i 所以都为3
    
    const arr = [];
    for (var i of [0, 1, 2]) {
        arr.push(() => i);
    }
    arr.map(x => x()); // [2,2,2]

    const arr = [];
    for (let i=0; i < 3; i++) {
        arr.push(() => i);
    }
    arr.map(x => x()); // [0,1,2]   每次为let创建一个当前值的绑定 所以为[0,1,2]
    
    const arr = [];
    for (const i of [0, 1, 2]) {
        arr.push(() => i);
    }
    arr.map(x => x()); // [0,1,2]

### var和let声明变量对参数的影响

| 声明方式 | 表现 | 
| ------ | ------ |
| var    | 声明的变量会覆盖函数的参数 |
| let/const | 重复定义 |

####  理解默认参数的行为
默认参数可以理解成let的行为  默认参数的访问范围是与函数体内部相隔离开的,只能访问到外部的变量  

    // OK: `y` accesses `x` after it has been declared
    function foo(x=1, y=x) {
        return [x, y];
    }
    foo(); // [1,1]
    
    // 在初始化x=y的时候 y处于TDZ 出现引用错误
    function bar(x=y, y=2) {
        return [x, y];
    }
    bar(); // ReferenceError
    
    
    const foo = 'outer';
    function bar(func = x => foo) {
        const foo = 'inner';
        console.log(func()); // outer
    }
    bar();  //  如果在这个例子的外部不存在foo 会引用错误

    function noParameter() {
        throw new Error('no parameter');
    }
    function test(a = noParameter()) {
        return a;
    }  // 使用默认参数来做参数的校验

## 解构
解构是跟变量的操作关联到一起的,主要用于变量的声明,赋值,函数参数的定义以及提供默认值。对象解构的时候,会把右边的操作值转化成对象。数组解构的时候相当于调用数组的迭代器实现

    const { length } = 'aaa';
    console.log(length) // 3
    const [x, y] = new Set([1,2]);
    console.log(x,y); // 1 2  
在对数组进行解构的时候,还可以通过越过某些数组项或者通过剩余参数获取数组后面的值

    const [,, x, y] = ['a', 'b', 'c', 'd']; // x = 'c'; y = 'd'
    const [x,...y] = [1,2,3] // x 1 y [2,3]

    const num = [1,2,3];
    const b = [];
    b.push(...num); // 扩展符
也可以通过解构来进行赋值(解构的声明和赋值不能同步进行并且解构的赋值需要在外边包上括号)  

    const arr = [];
    ({ bar: arr[0] } = { bar: true });
    console.log(arr); // [true]  

## ES6 模块
ES6模块本质上是一种规定静态化的加载和导出代码的方式,通过编译时加载使基于代码的静态分析成为可能(webapck中的tree Shaking).CommonJs的模块(运行时加载)就是对象.

### ES6模块的特点和CommonJs的对比

不能动态的引入并且引入是有提升的 

    // 不能动态的引入
    if (Math.random()) {
      import 'foo'; // SyntaxError
    }  
    {
      import 'foo'; // SyntaxError
    }
    // 引入的提升
    foo();
    import { foo } from 'my_module';

引入是只读的引用

    // a.js 
    export let a = 100;
    export const count = () => {
      a++;
    }
    // b.js
    import { a, count } from './a.js'
    console.log(a); // 100
    count();
    console.log(a); // 101
    a = 100; // error  a是只读的

    // CommonJs是值的复制,相当于修改一个值.

ES6的模块可以导出单个值,CommonJS必须导出一个对象.ES6的引入是只读的引用,CommonJs的引入对于基本类型是值的复制,复杂类型是引用. 

    // a.js  CommonJS值拷贝的例子
    let a = 100;
    module.exports = { 
      a,
      count: () => { a++ },
    };
    // b.js
    let { a, count } = require('./a.js')
    console.log(a); //100
    count();
    console.log(a); //100
    a++; // 相当于对本模块的a变量进行了赋值
    console.log(a);  // 101
    const b = require('./a.js'); // 会使用第一次require的结果
    console.log(b.a);  // 100

    // a.js  CommonJs 引用的例子
    let a = {
      name: 'haha',
    };
    module.exports = { 
      a,
      setStr: (str) => { a.name = str; },
    };
    // b.js  
    let { a, setStr } = require('./a.js')
    console.log(a); // { name: 'haha' }
    setStr('ss');
    console.log(a); // { name: 'ss' }
    a.name = 100;
    console.log(a);  // { name: 100 }
    const b = require('./a.js');  // 仍然使用的是第一次的缓存结果 但是由于引用的设置 导致原来的值被修改了
    console.log(b);  // { a: { name: 100 }, setStr: function() {} }

CommonJs循环加载时,属于加载时执行.即脚本代码在require的时候,就会全部执行.一旦出现某个模块被循环加载,就只输出已经执行的部分,还未执行的部分不会输出.ES6模块属于动态只读引用. CommonJs在引用同一个模块的时候存在会使用第一次的缓存.
    
    // b.js
    exports.done = false
    let a = require('./a.js')
    console.log('b.js-1', a.done)
    exports.done = true
    console.log('b.js-2', '执行完毕')
    // a.js
    exports.done = false
    let b = require('./b.js')
    console.log('a.js-1', b.done)
    exports.done = true
    console.log('a.js-2', '执行完毕')
    // c.js
    let a = require('./a.js')
    let b = require('./b.js')
    console.log('c.js-1', '执行完毕', a.done, b.done)

    输出:
    node c.js
    b.js-1 false
    b.js-2 执行完毕
    a.js-1 true
    a.js-2 执行完毕
    c.js-1 执行完毕 true true

    // ES6 循环依赖 a.js
    import { bar } from './b.js';
    bar(); // 'bar'
    export function foo() {
        console.log('foo');
    }
    bar(); // 'bar'

    // b.js
    import {foo} from './a.js'; 
    export function bar() {
       console.log('bar');
    }

    // CommonJs循环依赖  a.js
    const { bar } = require('./b.js');
    module.exports = {
      test: 1,
    }
    // b.js
    const { test } = require('./a.js')
    console.log(test); // undefined

### 动态引入  
可以通过按需引入模块来优化首屏代体积


        import("module").then(module => {
            module.default();
            module.namedExport();
        });

        // Or with async/await
        (async () => {
            const module = await import("module");
            module.default();
            module.namedExport();
        })();


## iterator(迭代器)
   在ES6中的可以使用数组解构,for of等语句遍历数组、Map、Set是因为在ES6中默认为这些结构创建了[Symbol.iterator]方法.通过这个方法的调用返回一个可以遍历该数据结构的对象(iterator),通过这个对象来遍历数据结构的属性.
  ![iterator](./ES6/iterator.png)  

    const iterable = {
      [Symbol.iterator]() {
          let step = 0;
          const iterator = {
              // iterators that are iterable
              [Symbol.iterator]() {
                return this;
              }
              next() {
                  if (step <= 2) { step++;}
                  switch (step) {
                      case 1:
                          return { value: 'hello', done: false };
                      case 2:
                          return { value: 'world', done: false };
                      default:
                          // done表示是否到尾
                          return { value: undefined, done: true };
                  }
              }
          };
          return iterator;
      }
    };
    const iterator = iterable[Symbol.iterator]();
    iterator.next();  // {  done: false, value: 'hello' }
    iterator === iterator[Symbol.iterator]() // true
    iterator.next();  // { done: false, value: 'world' }
## generator
生成器对象是由一个 generator function 返回的,并且它符合可迭代协议和迭代器协议。  

### generator方法
| 方法 | 含义 |
| ------ | ------ | 
| Generator.prototype.next(value) | 返回一个{ done: true/false, value: 执行结果 }的对象,value是当次执行的入参 | 
| Generator.prototype.return(value) | 返回给定的value值并结束生成器 | 
| Generator.prototype.throw(exception) | 向生成器抛出异常，并恢复生成器的执行 | 

生成器函数有如下特性:
1. 当一个generator函数被调用，函数体内代码并不立即执行。它返回一个遵循了迭代器协议的迭代器对象:它有next方法.
2. 执行生成器函数体内代码的唯一方法就是在返回的迭代器对象上调用next方法.每一次调用next，函数体内代码就执行到一个yield表达式处，这个表达式的右值赋值给迭代器。
3. next方法也可以接受参数，使用参数调用将会用参数值替换上一条yield表达式的左值，然后执行并返回当前yield表达式的右值  


    function* func() {
      const y = yield 1;
      yield 2 + y;

    }
    const generator = func();
    generator.next() // { value: 1, done: false }
    generator.next(100) // { value: 102, done: false }  

## async function
async function是ES7提出的对异步调用的一种解决方案.通常可以通过下面的方式生成async function

    async function foo() {
    }
    const a = async function() {}
    let obj = { async foo() { return 1; }}
    const b = async () => { return 1 }

async函数执行结果返回**promise**.在async函数体内可以使用await来等待一个promise的状态变成settled(fulfilled or rejected)

    async function foo() {
      console.log('async func');
      // await已经是一个微任务  
      const ret = await 1
      // const ret = await Promise.resove(1)
      return ret;
    }
    foo().then(value => {
      console.log(value)
    })
    console.log('main')
    // 上面代码的输出是  async func  main 1

### async function实现原理
async function可以通过generator + promise来模拟。


    function spawn(genF) {
      return new Promise((resolve, reject) => {
        const itr = genF()
        function step(nextFn) {
            let next;
            try {
                next = nextFn()
            } catch(e) {
                return reject(e)
            }
            if(next.done) {
                return resolve(next.value)
            }
            Promise.resolve(next.value).then(function(v) {
                step(function(){ return itr.next(v) });
            }, function(v) {
                step(function() { return itr.throw(v); })
            })
        }
        step(function() { return itr.next(undefined); })
      })
    }

## Reflect
Reflect是一个内置对象，提供了一些方法来完成javascript的操作。  
 
| 方法 | 含义 |
| ------ | ------ | 
| Reflect.apply(target, thisArg, args ) | 用户给函数绑定this并执行 | 
| Reflect.get(target, name, receiver) | 返回target上的name属性，没有undefined，如果name在target上设置了getter，则读取函数的this绑定receiver | 
| Reflect.set(target, name, value, receiver) | 设置target对象的name属性的值为value, 如果name属性有setter函数，则setter函数的this绑定receiver | 
| Reflect.has(obj,name) | 判断对象上是否有对应的属性 相当于 name in obj | 
| Reflect.deleteProperty(obj,name) | 删除对象的属性 相当于 delete obj[name] | 
| Reflect.construct(target, args) | target是对象的构造函数，args是参数数组，相当于new target(...args) | 
| Reflect.getPrototypeOf(obj) | 返回对象的__proto__属性, 相当于Object.getPrototypeof(obj) | 
| Reflect.setPrototypeOf(obj,newProto) | 设置对象的原型， 相当于Object.setPrototypeOf(obj, newProto)  | 
| Reflect.defineProperty(target,propertyKey, attributes) | 相当于Object.defineProperty, 定义对象的属性  | 

    const myObject = {
        foo: 1,
        get name() {
            return this.name
        }
    }
    const test = {
        name: 'haha'
    }
    Reflect.get(myObject, 'name', test) // haha 

## Set和Map

### Set
Set对象是值的集合，可以按照拆入的顺序迭代它的元素且Set中的元素是唯一的。

| 方法(属性) | 含义 |
| ------ | ------ | 
| Set.prototype.size | 返回Set对象中的值的个数 | 
| Set.prototype.add(value) | 在set对象尾部添加一个元素，**返回该set对象** | 
| Set.prototype.clear() | 移除set对象内的所有元素 | 
| Set.prototype.delete(value) | 移除set中与这个值相等的元素 | 
| Set.prototype.has(value) | 返回一个布尔值, 表示该值是否在set中 | 
| Set.prototype.keys() | 返回键值的遍历器 **遍历顺序是插入顺序** | 
| Set.prototype.values() | 返回键值的遍历器 | 
| Set.prototype.entries() | 返回键值对的遍历器 | 
| Set.prototype.forEach() | 使用回调函数遍历每个成员 | 

### WeakSet
WeakSet与Set类似
1. WeakSet的成员只能是对象不能是其他类型的值。
2. WeakSet对对象的引用是弱引用,不能阻止垃圾回收机制。
3. WeakSet不支持遍历

| 方法(属性) | 含义 |
| ------ | ------ | 
| WeakSet.prototype.add(value) | 在WeakSet对象尾部添加一个元素，**返回该WeakSet对象** | 
| WeakSet.prototype.delete(value) | 移除WeakSet对象内的所有元素 | 
| WeakSet.prototype.has(value) | 返回一个布尔值, 表示该值是否在WeakSet中 | 

### Map
Map对象可以保存键值对并且能够记住键的原始插入顺序，任何值(对象或者原始值)都可以作为Map的一个键或者值。在频繁删除键值或者对键值对的顺序有要求的场景，使用Map对象更加合适。

| 方法(属性) | 含义 |
| ------ | ------ | 
| Map(new Map(args)) | 构造函数, 具有Iterator接口且每个成员都是一个双元素数组的数据结构可以作为Map的构造函数参数 | 
| Map.prototype.size | 返回Map对象中的值的个数 | 
| Map.prototype.set(key,value) | 设置键名对应的键值为value(存在键名则更新键值), **返回当前的Map对象**  | 
| Map.prototype.get(key) | 读取对应key的键值，没有key返回undefined | 
| Map.prototype.has(key) | 返回布尔值，判断该键是否存在Map中 | 
| Map.prototype.delete(key) | 如果Map对象中存在该元素，则移除它并返回true否则返回false |  
| Map.prototype.clear() | 移除Map对象内的所有元素 | 
| Map.prototype.keys() | 返回键名的遍历器**遍历顺序是插入顺序** | 
| Map.prototype.values() | 返回键值的遍历器 | 
| Map.prototype.entries() | 返回键值对的遍历器 | 
| Map.prototype.forEach() | 使用回调函数遍历每个成员 | 

### WeakMap
WeakMap与Map类似。
1. WeakMap的键值只能是对象不能是其他类型的值。
2. WeakMap对对象的引用是弱引用,不能阻止垃圾回收机制。
3. WeakMap不支持遍历

| 方法(属性) | 含义 |
| ------ | ------ | 
| WeakMap.prototype.set(key,value) | 在WeakMap对象尾部添加一个元素，**返回该WeakSet对象** | 
| WeakMap.prototype.delete(value) | 移除WeakMap对象内的所有元素 | 
| WeakMap.prototype.has(value) | 返回一个布尔值, 表示该值是否在WeakMap中 | 
| WeakMap.prototype.get(key) | 读取对应key的键值，没有key返回undefined | 


## 参考
[Async functions](http://exploringjs.com/es2016-es2017/ch_async-functions.html)
[async函数的实现原理](https://es6.ruanyifeng.com/#docs/async#async-%E5%87%BD%E6%95%B0%E7%9A%84%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86)