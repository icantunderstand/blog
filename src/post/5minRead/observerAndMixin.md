---
title: 5分钟速读系列-观察者模式/Mixin模式
date: "2022-11-03"  
tags: 设计模式
path: /2022-11-observable
---

这个系列是[Improve how you architect webapps](https://www.patterns.dev/)上文章的读书笔记。

## 观察者模式
观察者模式(发布订阅模式)是定义对象间一种一对多的依赖关系，使得当每一个被观察方改变状态，则所有依赖于它的观察者都会得到通知并自动更新。  


    // 被观察者提供观察者通知逻辑、订阅逻辑
    class Observable {
        constructor() {
            this.observers = [];
        }
        // 观察者订阅入口
        subscribe(func) {
            this.observers.push(func);
        }

        unsubscribe(func) {
            this.observers = this.observers.filter(observer => observer !== func);
        }
        // 通知观察者
        notify(data) {
            this.observers.forEach(observer => observer(data));
        }
    }
    function logger(data) {
        console.log(data)
    }
    const observable = new Observable() 
    // 订阅操作
    observable.subscribe(logger);
    // 通知操作
    observable.notify('this is a test!')

观察者模式的优点是可以做到逻辑的分离，做到单一职责。缺点是当观察者数目较多的时候会有性能的问题  

## Mixin模式
Mixin模式可以在不通过继承的方式实现为类(对象)增加复用的能力。当你需要将一个特定的feature添加到不同的类或者为类提供可插拔能力的时候可以考虑Mixin模式。  

    // 基础类 只有name能力
    class Dog {
        constructor(name) {
            this.name = name;
        }
    }
    // mixin方法 可以为基础类提供复用的能力
    const dogFunctionality = {
        bark: () => console.log("Woof!"),
        wagTail: () => console.log("Wagging my tail!"),
        play: () => console.log("Playing!")
    };
    // 通过方法的拷贝 在Dog的原型上就有了对象的方法
    Object.assign(Dog.prototype, dogFunctionality);
    const pet1 = new Dog("Daisy");
    pet1.bark(); // Woof!

可以在mixin函数中通过指定__proto__实现mixin的继承能力

    const sayMixin = {
        say(phrase) {
            alert(phrase);
        }
    };
    const sayHiMixin = {
        // 设置原型 实现mixin的继承
        __proto__: sayMixin, // (可以在这儿使用 Object.setPrototypeOf 来设置原型)
        sayHi() {
            // 调用父类方法
            super.say(`Hello ${this.name}`); // (*)
        },
        sayBye() {
            super.say(`Bye ${this.name}`); // (*)
        }
    };
    class User {
        constructor(name) {
            this.name = name;
        }
    }
    // 拷贝方法
    Object.assign(User.prototype, sayHiMixin);

    // 现在 User 可以打招呼了
    new User("Dude").sayHi(); // Hello Dude!


mixin模式会存在覆盖功能和增加项目代码复杂度的问题