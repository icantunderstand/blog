---
title: 5分钟速读系列-提供者模式/原型模式
date: "2022-11-02"  
tags: 设计模式
path: /2022-11-provider
---

这个系列是[Improve how you architect webapps](https://www.patterns.dev/)上文章的读书笔记。

## 提供者模式
提供者模式通过封装方法给予应用订阅不同数据源的能力。react中通过外层的Provider来提供全局的store，在组件内部通过useContext来获取相关的Context值。


        // 根组件通过Provider的value绑定全局store
        export const ThemeContext = React.createContext();
        const themes = {
            light: {
                background: "#fff",
                color: "#000"
            },
            dark: {
                background: "#171717",
                color: "#fff"
            }
        };
        export default function App() {
            const [theme, setTheme] = useState("dark");
            function toggleTheme() {
                setTheme(theme === "light" ? "dark" : "light");
            }
            const providerValue = {
                theme: themes[theme],
                toggleTheme
            };
            return (
                <div className={`App theme-${theme}`}>
                    <ThemeContext.Provider value={providerValue}>
                        <Toggle />
                    </ThemeContext.Provider>
                </div>
            );
        }
        // Toggle组件
        import React, { useContext } from "react";
        import { ThemeContext } from "./App";

        export default function Toggle() {
            const theme = useContext(ThemeContext);
            return (
                <label className="switch">
                    <input type="checkbox" onClick={theme.toggleTheme} />
                </label>
            );
        }

在React应用中通过全局的context可以解决组件属性的传递问题，便于组件的设计。但是全局Context的更新会导致消费对应Context组件的更新，造成需要不必要的渲染。这里就需要对全局Context进行更细粒度的拆分。

## 原型模式  
JavaScript通过原型完成对象间属性的共享。通过原型能减少相同属性或者方法的创建，相同类型的实例可以共享实例原型上的属性和方法。对于原型模式需要理解几下的几点:
* 实例对象的__proto__指向构造函数的prototype(实例与原型的关系).构造函数的prototype的constructor(构造函数与原型的关系).


        class Dog {
            constructor(name) {
                this.name = name;
            }
            bark() {
                return `Woof!`;
            }
        }
        const dog1 = new Dog("Daisy");
        dog1.__proto__ === Dog.prototype // true
        Dog.prototype.constructor === Dog // true
* 对象属性的获取是顺着对象__proto__沿着原型链查找，会一直查找到Object.prototype(Object.prototype.__proto__是null)

* 理解new关键字中原型的处理方式，new操作符主要做了如下的操作:
    1. 以构造器的原型为属性创建新对象
    2. 将新对象作为this调用构造器
    3. 如果构造器返回的是对象则返回否则返回第一步创建的对象


            function myNew(Con, ...args) {
                const obj = Object.create(Con.prototype);
                const ret = Con.call(obj, args);
                if(ret instanceof Object && ret !== null) {
                    return ret;
                }
                return obj;
            }