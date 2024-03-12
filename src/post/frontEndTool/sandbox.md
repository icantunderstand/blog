---
title: 前端沙盒的实现方式 
date: "2022-01-18"  
tags: JavaScript
path: /sandbox
---


不同的微前端框架会提供沙盒环境来实现不同微前端应用的隔离.本文梳理JavaScript中沙盒的实现方式，有助于学习微前端方案的技术细节.

## 前置概念

### 沙盒
沙盒是一种安全机制可以为程序提供隔离的执行环境，沙盒中提供用后即回收的磁盘及内存空间，在沙盒中对网络访问、对真实系统的访问、对输入设备的读取通常被禁止或是被严格限制的.JavaScript沙盒是通过语法层面的限制来实现代码执行的隔离.

### Proxy
[Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)可以实现对对象属性访问的代理，通过Proxy的使用可以实现JavaScript代码执行的沙盒模式

### with  
[with](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/with)语句可以扩展当前的执行上下文

    const a = { name: 1111 }
    with(a) {
        console.log(name) // 1111
    }


## 沙盒的实现方式
沙盒的实现方式上主要分为:
* 单实例沙盒: 同一个时刻只有一个微应用实例存在，当前资源被这个应用独占，需要解决的主要问题是应用切换的时候变量污染清理和再次启动时的变量恢复  
* 多实例沙盒: 资源不是应用独占，需要解决资源共享、通信等问题

### ProxySandbox(单实例沙盒)
基于Proxy的拦截和设置功能，通过Proxy拦截对全局对象的修改记录，在应用切换的时候还原全局对象


        /** 设置全局对象属性 */
        const setWindowProp = (prop, value) => {
            window[prop] = value
        }

        class SandBox {
            name;
            /** 代理对象 需要通过该对象操作沙盒 */
            proxy = null;
            /** 新增的修改 */
            addedPropsMap = new Map();
            /** 沙盒期间更新的修改 */
            modifiedOriginValueProps = new Map();
            /** 当前沙盒所做的修改 用于还原当前的沙盒 */
            currentUpdatedProps = new Map();
            /** 激活沙盒 */
            active() {  
                this.currentUpdatedProps.forEach((v, p) => {
                    setWindowProp(p, v)
                })
            }
            /** 沙箱卸载 */
            inactive() {
                /** 修改的属性还原 */
                this.modifiedOriginValueProps.forEach((v, p) => {
                    setWindowProp(p, v)
                })
                /** 增加的属性清空 */
                this.addedPropsMap.forEach((_, p) => {
                    setWindowProp(p, undefined)
                })
            }
            constructor(name) {
                this.name = name;
                const fakeWindow = Object.create(null)
                const {
                    addedPropsMap,
                    modifiedOriginValueProps,
                    currentUpdatedProps,
                } = this
                const proxy = new Proxy(fakeWindow, {
                    get(target, prop) {
                        return window[prop]
                    },
                    set(_, prop, value) {
                        if(!window.hasOwnProperty(prop)) {
                            /** window上没有该属性 新增 */
                            addedPropsMap.set(prop, value)
                        } else if(!modifiedOriginValueProps.hasOwnProperty(prop)) {
                            /** window上有该属性且未更新,记录 */
                            const originValue = window[prop] 
                            modifiedOriginValueProps(prop, originValue)
                        }
                        /** 记录当前沙盒的更新 */
                        currentUpdatedProps.set(prop, value)
                        /** 更新全局属性 */
                        setWindowProp(prop, value)
                        return true
                    }
                })
                this.proxy = proxy
            }
        }

        const newSandBox = new SandBox('app')
        const proxyWindow = newSandBox.proxy
        proxyWindow.appName = 'app'
        console.log(window.appName, proxyWindow.appName) // app app
        newSandBox.inactive()
        console.log(window.appName, proxyWindow.appName) // undefined undefined
        newSandBox.active()
        console.log(window.appName, proxyWindow.appName) // app app

### snapshotSandbox(单实例沙盒)
快照沙盒是在不支持Proxy的环境下，通过将window对象属性都复制到快照对象上然后再激活和卸载的时候对激活期间的diff进行添加或者回退.这个方案的对比方案较复杂，比如考虑到原型链的修改与还原问题，一般不作为沙盒方案的首选.


    class SnapshotSandbox {
        constructor(name) {
            this.name = name;
            this.proxy = window;
            this.type = 'Snapshot';
            this.sandboxRunning = true;
            this.windowSnapshot = {};
            this.modifyPropsMap = {};
            this.active();
        }
        //激活
        active() {
            // 记录当前快照
            this.windowSnapshot = {};
            iter(window, (prop) => {
                this.windowSnapshot[prop] = window[prop];
            });

            // 恢复之前的变更
            Object.keys(this.modifyPropsMap).forEach((p) => {
                window[p] = this.modifyPropsMap[p];
            });

            this.sandboxRunning = true;
        }
        //还原
        inactive() {
            iter(window, (prop) => {
                if (window[prop] !== this.windowSnapshot[prop]) {
                    // 记录变更，恢复环境
                    this.modifyPropsMap[prop] = window[prop];
                
                    window[prop] = this.windowSnapshot[prop];
                }
            });
            this.sandboxRunning = false;
        }
    }
   
    const sandbox = new SnapshotSandbox();
    const proxyWindow = sandbox.proxy
    sandbox.active();
    proxyWindow.appName = 'app'
    console.log(proxyWindow.appName, window.appName) // app app
    sandbox.inactive();
    console.log(proxyWindow.appName, window.appName) // undefined undefined

### 多实例沙盒
多实例沙盒是Proxy实现的单实例的变种版，在Proxy实现的单实例沙盒中，Proxy的handler的get/set是直接操作的全局对象,多实例版本在handler的get/set中操作沙盒自己维护的对象，从而实现多实例模式


    class MultiProxySandbox {
        name;
        proxy = null;
        /** context 传入多实例沙盒共享数据 */
        constructor(name, context={}){
            this.name = name;
            const fakeWindow = Object.create({});
            const proxy =  new Proxy(fakeWindow,{
            set(target, name, value){
                /** 返回共享属性  */
                if(Object.keys(context).includes(name)){
                    context[name] = value;
                }
                target[name] = value;
            },
            get(target,name){
                // 优先使用共享对象
                if(Object.keys(context).includes(name)){
                    return context[name];
                }
                if( typeof target[ name ] === 'function' && /^[a-z]/.test(name)){
                return target[ name ].bind && target[ name ].bind( target );
                } else {
                return target[ name ];
                }
            }
            })
            this.proxy = proxy
            return proxy
        }
    }

    const context = { document: window.document, globalData:'abc'};
    const newSandBox1 = new MultiProxySandbox('app1',context);
    const newSandBox2 = new MultiProxySandbox('app2',context);
    newSandBox1.appName = 'app1'
    newSandBox2.appName = 'app2'
    console.log(newSandBox1.appName, newSandBox2.appName, window.appName) // app1 app2 undefined
    console.log(newSandBox1.globalData, newSandBox2.globalData) // abc abc

## css隔离方案
* css模块化 将CSS的作用域隔离
* css-in-js 样式代码直接内嵌到JavaScript代码中
* Shadow Dom 实现样式隔离


## 附录
[字节跳动的微前端沙盒实践](https://juejin.cn/post/6844904066225537037)  
[前端微服务在字节跳动的打磨与应用](https://mp.weixin.qq.com/s/iLdAH9p2-S8pFyZrNzYaNg)  
[谈谈微前端领域的js沙箱实现机制](https://cloud.tencent.com/developer/article/1748172)






