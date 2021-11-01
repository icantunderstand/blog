---
title: 深入理解javascript系列之执行环境
date: "2019-01-15"
tags: JavaScript
path: /javascript-call
---

## 引言
当javascript代码执行从一个函数进入到另一个函数的时候,语言在实现上为当前执行函数保存外部的执行环境(变量),在当前函数进行变量标识符查找的时候,查找的规则是首先在当前的执行环境中查找对应的变量,然后逐步从上级的执行环境中查找.这种对变量实现的存储和查找机制就是javascript中的作用链域.下面先从一些js执行环境的基础知识说起,然后从ECMA的规范上理解javascript的执行环境.

## 基础知识
### 执行栈
执行栈是存储javascript执行上下文的一种结构,它具有先入先出的特点.javascript在执行的时候会创建全局的执行上下文.在执行到函数代码的时候,会创建新的执行上下文,执行完对应函数的时候,会退出当前的上下文回到之前的执行上下文继续代码的执行.
### 声明提升
javascript在创建执行上下文的时候,会对当前执行环境声明的变量进行绑定(初始化存储位置),这个在一定程度上也解决了函数声明的先后顺序问题,下面这段代码是可以正常执行的

    console.log(a);// undefined
    var a = 0;
    // let const与var的区别是在创建对应的之后环境的时候是let const不会为变量绑定初始值,var会绑定初始值(undefined),引用一个没有初始值的变量会报错
    test();
    function test() { test2(); }
    function test2() { console.log(1); }

## 从ECMA规范理解js执行环境

在javascript进入到函数的执行代码的时候,会创建新的执行上下文,将当前的上下文推入执行栈进行代码的执行.下面先简单的理解执行上下文的基本组件:

    Execution Contexts = {
      code evaluation state // 代码执行的状态 用户代码的执行暂停和恢复
      Realm // realm是对javascript执行边界的一些限制
      LexicalEnvironment:{
        this  // 会进行this的bind  理解this是当前函数的caller
        Environment Record  // 用于初始化和存储当前上下文声明的函数声明,变量
        outer LexicalEnvironment  // 用于从外部的作用域查找标识符(作用域链)
      }
      VariableEnvironment: {} // VariableEnvironment和LexicalEnvironment是相似的概念下面会单独进行讲解
    }
### this
this是指调用函数的caller.在进入函数执行的时候会创建新的执行上下文并且对this进行绑定(**箭头函数使用的是Lexical this，即这个函数被创建时的this就是函数内部的this** **箭头函数不能通过new地调用**).
#### 如何确定this
    const obj = {
      name: 100,
      test: function() {
        console.log(this.name);
      }
    };
    obj.test(); // 100

    const obj2 = {
      name: 200,
      test: () => {
        console.log(this.name);  // 这段代码的执行环境是全局的环境 所以箭头函数中this的指向是window
      }
    }
    obj2.test(); // undefined 
上面的代码块中obj是一个引用类型,在ECMA规范中有引用类型的定义,可以理解成下面的形式  

    Reference {
      the base value component // 引用类型的值 对于上面的例子来说就是obj本身
      the referenced name component // 引用类型的名字
      the Boolean-valued strict reference flag
    } 

在执行上下文中确认this的指向可以使用如下的规则:
![this](./LE/this.png)  
### 理解VariableEnvironment和LexicalEnvironment
VariableEnvironment是创建执行上下文的时候进行变量的初始化绑定和存储,LexicalEnvironment(LexicalEnvironment在进行变量初始化后会复制一份VariableEnvironment)主要用于在代码执行阶段对标识符的解析并且随着代码执行(例如产生with语句)会创建新的LexicalEnvironment到当前的LexicalEnvironment之前.可以通过下面的例子来加深对上面例子的理解:

    function test() {
      var a = 10
      var obj = {a:20}
      with(obj) {
        var test2 = function() {
          console.log(a)
        }
        function test3() {
          console.log(a)
        }
      }
      return {test2,test3}
    }
    var hah = test()
    hah.test2() //log 20
    hah.test3()//log 20  

### 理解闭包
当前的函数存在对外部作用域变量的访问会形成闭包.闭包保存的是生成闭包时候的执行上下文的LexicalEnvironment.
(Closure is when a function remembers and accesses variables from outside of its own scope, even when that function is executed in a different scope.)
## 参考   
[VariableEnvironment和LexicalEnvironment的区别](https://stackoverflow.com/questions/15031667/clarity-on-the-difference-between-lexicalenvironment-and-variableenvironment)  

[lexical-environments-ecmascript-implementation](http://dmitrysoshnikov.com/ecmascript/es5-chapter-3-2-lexical-environments-ecmascript-implementation/)  

[ECMAScript2017](https://www.ecma-international.org/ecma-262/8.0/index.html#sec-intro) 

[how-to-understand-js-realms](https://stackoverflow.com/questions/49832187/how-to-understand-js-realms)