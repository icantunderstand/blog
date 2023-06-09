---
title: 5分钟速读系列-单例模式/代理模式
date: "2022-11-01"  
tags: 设计模式
path: /2022-11-singleton
---

这个系列是[Improve how you architect webapps](https://www.patterns.dev/)上文章的读书笔记。

## 单例模式
单例模式通过全局维护一个实例的方式来达到全局属性的共享和减少内存的占用。单例的简单实现如下:  


        let instance;
        let counter = 0;
        class Counter {
            constructor() {
                if (instance) {
                    throw new Error("You can only create one instance!");
                }
                instance = this;
            }
            getInstance() {
                return this;
            }
            getCount() {
                return counter;
            }
            increment() {
                return ++counter;
            }
            decrement() {
                return --counter;
            }
        }
        const singletonCounter = Object.freeze(new Counter());
        // 暴露给外部的单一实例
        export default singletonCounter;

单例模式的优点也恰恰是他的缺点，由于全局属性的共享导致改动的全局污染问题、测试用例写法问题等。在react中全局的redux\context store就是应用中的单例，store通过单向的数据流来规避单例的一些问题。

## Proxy(代理)模式
代理模式通过为对象提供占位符来控制对象的访问。代理对象相当于中间人角色，可以在不改变被代理对象的接口的情况下扩展功能。在JavaScript中可以使用Proxy来实现代理的功能。


        const person = {
            name: "John Doe",
            age: 42,
            nationality: "American"
        };
        const personProxy = new Proxy(person, {
            // handler的get/set方法代理了被代理对象属性的访问方法
            get: (obj, prop) => {
                console.log(`The value of ${prop} is ${obj[prop]}`);
                // 可以用Reflect修改代理对象的属性
                Reflect.set(obj, prop);
            },
            set: (obj, prop, value) => {
                console.log(`Changed ${prop} from ${obj[prop]} to ${value}`);
                obj[prop] = value;
                return true;
            }
        });
        personProxy.name;
        personProxy.age = 43;


