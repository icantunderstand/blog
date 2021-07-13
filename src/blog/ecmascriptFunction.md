---
title: ECMAScript规范-函数对象
date: 2019 - 05 - 29  
tags: JavaScript
path: /ecmascript-function
---

本文主要对EcmaScript规范中函数对象解读。

## 函数对象
函数对象是对外部的词法环境和有一定入参的代码进行封装后的对象.函数对象的调用支持动态的绑定执行环境.在javascript函数执行的时候,实际上是调用当前函数对象的一些内置方法来实现的.下面是函数对象的一些内部实现:

| 内部实现 | 类型 | 描述 |
| ------ | ------ | ------ |
| [[Environment]] | Lexical Environment(词法环境) | 词法环境定义当前函数对象生成时候的外部环境,例如引用的外部变量等 |
| [[FormalParameters]] | Parse Node | 定义函数的参数列表 |
| [[FunctionKind]]     |  String    | 函数类型(normal, classConstructor, generator, async, async generator)   |  
| [[ECMAScriptCode]]   |  Parse Node | 代码体 |  
| [[ConstructorKind]]  |  String   | 构造类型,当函数通过new操作符进行调用的时候,会用到这个属性.(base derived) |  
| [[Realm]]  | Realm Record |  当前函数对象的Realm记录,在函数执行的时候需要将函数与Realm进行绑定,由Realm提供全局的环境对象等 |  
| [[ScriptOrModule]] | Script Record or Module Record | 记录当前函数对象不同创建方式的记录 |  
| [[ThisMode]] | (lexical, strict, global) | this会在进入函数的执行环境时进行绑定.lexical代表着this的确定规则是由外部的词法环境决定的(箭头函数),strict代表this是由函数的调用者提供的,global代表着this由外部的全局对象指定(需要区分严格和非严格模式). |
| [[Strict]] | Boolean | 确定当前函数是否是一个在严格模式下执行的函数 |  
| [[IsClassConstructor]] | Boolean | 是否是构造函数，如果是构造函数通过[[Call]]方式会报类型错误 |  

## 规范详细解读

### [[Call]]
当通过指定this调用函数对象的时候，实际上会执行内部定义的[[Call]]方法。  
![Call步骤](./ecmascriptFunction/Call.png)  
1. 将执行上下文切换到当前的执行上下文并对当前的执行上下文做基础的设置
2. 如果当前函数是类构造函数报错并退出
3. 在执行上下文上绑定this
4. 执行函数
5. 恢复执行上下文，如果有返回值返回结果

### [[Construct]]
当通过new操作符调用一个函数对象的时候,实际上会执行内部定义的[[Construct]]方法,下面从规范上理解[[Construct]]方法从而理解调用构造函数的实际行为.  
在通过new调用构造函数的时候会进行一些参数的修正然后调用构造函数的[[Construct]]
![newBefore](./ecmascriptFunction/newBefore.png)  
![new](./ecmascriptFunction/new.png)
![objCreate](./ecmascriptFunction/createObj.png)
[[Construct]]主要分为一下几个步骤:  

1. 将执行上下文定义为当前的执行上下文
2. 获取当前函数对象的[[ConstructorKind]], 如果是base类型, 将当前的执行环境的this设置为以构造函数为原型创建的对象
3. 创建新的执行上下文将2中的this绑定到当前的执行上下文
4. 在当前的词法环境和环境记录上执行构造函数
5. 退出当前的执行上下文,返回到上次的执行上下文
6. 如果执行构造函数的结果是有返回值的,当返回一个对象的时候直接将执行结果返回.当有返回结果但是不是对象的时候返回之前创建的this
7. 没有返回值的时候,返回之前创建的this.

#### 简单实现一个new的调用过程

    function myNew(Con, ...args) {
      const obj = Object.create(Con.prototype);
      const ret = Con.call(obj, args);
      if(ret instanceof Object && ret !== null) {
        return ret;
      }
      return obj;
    }

### Object.create
![Object.create](./ecmascriptFunction/ObjectCreate.png)  
1. 判断传入的原型是否是Object/Null，不是的话抛出异常
2. 根据传入的原型创建对象(如果传入的原型参数是空那么创建的对象没有原型)
3. 在创建的对象上定义属性并返回结果

### 规范示例
[[Environment]]定义函数对象创建时候的外部词法环境.实际上在javascript中函数就是闭包的概念.函数在创建的时候就已经跟外部的词法环境进行了绑定,在调用的时候并不会改变函数的外部的词法环境.

    const a = 100;
    function test() {
      console.log(a);
    }
    function test2() {
      const a = 200;
      test();
    }
    const obj = {
      a: function() {
        test();
      }
    }
    test2() // 100
    obj.a(); // 100

在一个构造函数中返回一个非对象:

    function Person(name) {
      this.name = name;
      return 1;
    }
    const person = new Person('ss'); // { name: 'ss' }

对于this的确定,可以参考下面的确定规则:
![this](./ecmascriptFunction/this.png)

## 参考
[ECMAScript2020](https://tc39.github.io/ecma262/#sec-ecmascript-function-objects)  
[ECMAScript2016规范理解（8）-new表达式的执行过程](http://ldllidonglin.github.io/blog/2019/04/26/2019-04-26-ECMAScript2016%E8%A7%84%E8%8C%83%E7%90%86%E8%A7%A3%EF%BC%888%EF%BC%89-new%E8%A1%A8%E8%BE%BE%E5%BC%8F%E6%89%A7%E8%A1%8C%E8%BF%87%E7%A8%8B/)  
[深入理解javascript系列之执行环境](https://icantunderstand.cn/2019/01/15/LE/)



