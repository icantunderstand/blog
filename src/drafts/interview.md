
---
title: 相关资料总结
date: 2018-10-10 07:30:00  
tags: 
categories: 
---

## 函数节流

### 防抖函数
    
    // debounce 多次触发只有最后一次执行  如果第一次点就执行
    function debounce(fn, delay, mustRun) {
      let timer = null
      let lastTime = null
      let realDelay = 0
      return function debounced(args) {
        const curr = + new Date()
        const context = this
        if(!lastTime) {
          lastTime = curr
        }
        clearTimeout(timer)
        if(curr - lastTime >= mustRun) {
          lastTime = curr
          return fn.apply(context, args);
        }
        timer = setTimeout(() => { return fn.apply(context, args) }, realDelay)
        if(realDelay === 0) {
          realDelay = delay
        }
      }
    }

### 节流
    // 多长时间必须执行对应的函数  限制目标函数的执行频率
    function throttle(func, wait = 50) {
      let lasttime = 0;
      return function(...agrs) {
        let now = +new Date();
        if(now - lasttime > wait) {
          lasttime = now;
          return func.apply(this, args);
        } 
      }
    }


### 深拷贝  
  function isObject(value) {
    if(!!value &&(typeof value === 'function' || typeof value === 'object')) {
      return true;
    }
    return false;
  }
  Function.prototype.clone = function clone() {
    const that = this;
    const temp = function(...args) { return that.apply(this,...args) };
    for(let key in this) {
      temp[key] = this[key];
    }
    return temp;
  }
  // 传递过去hash是为了防止迭代到同样的变量 解决环的问题 加快
  function deepClone(obj, hash = new WeakMap()) {
    if(hash.has(obj))  return hash.get(obj);
    const type = Object.prototype.toString.call(obj);
    let result = null;
    if(type === '[object Function]') {
      result = obj.clone();
    } else {
      if(type === '[object Array]') {
        result = [...obj];
      }
      if(type === '[object Object]') {
        result = {...obj};
      }
    }
    hash.set(obj, result);
    for(let key in obj) {
      result[key] = isObject(obj[key]) ? deepClone(obj[key], hash)  : obj[key]; 
    }
    return result;
  }

### 判断两个值是否相等
    
    // 判断两个值是否相等
    function isSameValue(x, y ) {
      if(x === y) {
        return x !== 0 || 1/x === 1/y;
      } else {
        return x !== x && y !== y
      }
    }
    // 两个对象是否相等
    function shallEqual(objA, objB) {
      if(is(objA, objB)) {
        return true;
      }

      if(typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
        return false;
      }
      const keysA = Object.keys(objA);
      const keysB = Object.keys(objB);
      if(keysA.length !== keysB.length) {
        return false;
      }

      for(let i = 0;i < keysA.length;i++) {
        if(!Object.hasOwnPorperty.call(objB, keysA[i]) || !is(objB[keysA[i]], objA[keysA[i]])) {
          return false;
        }
      }
      return true;
    }

## 模拟async await的实现过程

    // 通过Promise Generator来实现

    function spawn(genF) {
      return new Promise((resolve, reject) => {
        const itr = genF()
        function step(nextFn) {
            let next;
            try {
                next = nextFn()
            } catch(e) {
                reject(e)
            }
            if(next.done) {
                resolve(next.value)
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

## 实现apply call bind

### apply

    Function.prototype.myApply = function(context, args) {
      context = context || window;
      context.fn = this;
      const result = context.fn(...args); // 已传入的context调用函数 作为最后的this
      delete context.fn;
      return result;
    }

### call 

    Function.prototype.myCall = function(context, ...args) {
      context = context || window;
      context.fn = this;
      const result = context.fn(...args);
      delete context.fn;
      return result;
    }

### bind

    Function.prototype.myBind = function(context, ...args) {
      const fn = this;
      return function fnToBind(...restArgs) {
        if(this instanceof fnToBind) {
          return new fn(...args, ...restArgs);
        } else {
          return fn.apply(context,args.concat(restArgs));
        }
      }
    }

## 理解new操作符
1. 以构造器的原型为属性创建新对象
2. 将新对象作为this调用构造器
3. 如果构造器返回的是对象则返回否则返回第一步创建的对象

### 实现一个new

    function myNew(Con, ...args) {
      const obj = Object.create(Con.prototype); //创建一个新的对象__proto__指向传入的proto参数
      const ret = Con.call(obj, args);
      if(ret instanceof Object && ret !== null) {
        return ret;
      }
      return obj;
    }
    // 创建出来对象的__proto__ 是函数的prototype

    __proto__ 对象的原型
    prototype 函数的原型  Func.prototype.constructor === Func

## 实现继承的几种方式

### 原型链面试问题

    Function.prototype.a = () => console.log(1);
    Object.prototype.b = () => console.log(2); 
    function A() {}
    console.log(A.__proto__ === Function.prototype) // true
    console.log(Object.__proto__ === Function.prototype) //true
    const a = new A();
     a.a(); // 无法执行
    a.b();

### 原型链继承

    //原型链继承 将子类的原型指向父类的一个实例实现继承
    // 会导致父类的属性被所有实例所共享

    function Parent(age) {
      this.name = age
    }
    function Child(name) {
      this.name = name
    }

    Child.prototype = new Parent()

### 借用构造函数方式

    function Parent(age) {
      // 借用构造函数方式都在父类的构造函数中定义 创建实例的时候 需要创建一遍方法
      this.name = age
      this.getName = () => {
        return this.name
      }
    }
    function Child(age) {
      Parent.call(this, age)
    }
### 组合继承

    // 组合继承 将原型链和借用构造函数技术结合在一起
    function Parent(age) {
      this.name = age
    }
    function Child(age,name) {
      Parent.call(this, age)
      this.name = name
    }

    Child.prototype = new Parent()
    Child.prototype.constructor = Child


### 寄生组合式继承
    function Animal(name) {
      this.name = name;
    }

    function Cat(age) {
      // 别忘了这里的借用构造函数
      Animal.call(this,age)
      this.age = age;
    }

    Cat.prototype = Object.create(Animal.prototype, {
      constructor: {
        value: Cat,
        enumerable: false,
        writable: true,
        configurable: true,
      }
    })


## 数组操作

    function isArray(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    }
    // 数组的相关方法
    unshift(value) 在前面插入  shift() 在前面移除
    // 数组扁平化
    function flattenDeep(arr) {
      return arr.reduce((acc, val) => {
        if(Array.isArray(val)) {
          return  acc.concat(flattenDeep(val));
        } else {
          return acc.concat(val)
        }
      }, [])
    }

    // null === null undefined === undefined true
    Array.prototype.includes(value) // 是否存在某个值
    Array.prototype.every(callback) // 检查所有元素 有一个返回false 就返回false 
    Array.prototype.some(value) // 检查至少有一个通过测试
    Array.prototype.reduce((accumulator, currentValue, index, array) => {}, initValue)
    Array.prototype.rightReduce((accumulator, currentValue, index, array) => {}, initValue)

## 实现compose函数

    function compose(...funcs) {
      if(funcs.length === 0) {
        return arg => arg
      }
      if(funcs.length === 1) {
        return func[0]
      }
      return funcs.reduce((a,b) => (...args) => a(b(...args)))
    }

## 实现get函数

    function get (source, path, defaultValue = undefined) {
      const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.')
      let result = source
      for (const p of paths) {
        result = Object(result)[p]
        if (result === undefined) {
          return defaultValue
        }
      }
      return result
    }

### 实现一个jsonp
* 标签的移除 
* callback注册到window上 需要进行移除(冲突) 和 callback的返回

    function jsonp ({url, data, callback}) {
      const container = document.getElementsByTagName('head')[0];
      const fnName = `jsonp_${new Date().getTime()}`;
      const script = document.createElement('script');
      script.src = `${url}?${objectToQuery(data)}&callback=${fnName}`;
      script.type = 'text/javascript';
      container.appendChild(script);

      window[fnName] = function (res) {   
          callback && callback(res);
          container.removeChild(script);
          delete window[fnName];
      }

      script.onerror = function() { // 异常处理，也是很多人漏掉的部分
          window[fnName] = function() {
          callback && callback(
            'something error hanppend!'
          )
          container.removeChild(script);
          delete window[fnName];
        }
      }
    }


## promise

1. then 和 catch 期望接收函数做参数，如果非函数就会发生 Promise 穿透现象，打印的是上一个 Promise 的返回

    const promise = new Promise(function(resolve, reject){
      setTimeout(function() {
        resolve(1);
      }, 3000)
    })

    promise.then(2).then((n) => {
      console.log(n)
    });




