---
title: React 事件系统源码解读
date:  "2021-03-28"
tags: React
path: /react-event
---

本文主要结合源码梳理React事件系统的实现过程.React事件系统通过模拟浏览器的事件系统实现事件触发逻辑从而实现不同浏览器的兼容.本文从事件的注册和响应两个阶段梳理具体的实现过程

## 前置知识

### 浏览器事件
事件的触发阶段
1. 捕获阶段(根元素最先接收到事件) 
2. 目标阶段(目标元素捕获事件)
3. 冒泡阶段(从触发事件的元素向上往根节点传递)  

![浏览器事件模型](./reactStatic/reactEvent/eventBrowser.png)
### [浏览器监听事件api](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)

    target.addEventListener(type, listener, options)
    options
    * caputre Boolean true 在捕获阶段触发 false 在冒泡阶段触发 默认是冒泡阶段触发
    * once Boolean true表示该listener在添加之后只会被调用一次并且在调用之后会被移除
    * passive Boolean true表示该listener不用调用preventDefault()方法

    target.addEventListener(type, listener, useCapture)
    * useCapture Boolean true 在捕获阶段触发 false 在冒泡阶段触发
    
### 事件委托
事件委托是实现事件处理的一种通用手段.通过浏览器事件冒泡(或者捕获)过程在目标元素的父元素实现对应事件的处理逻辑,能一定程度上减少内存的消耗.React正是基于事件委托来实现事件的处理的.
* event.target 获取实际触发事件的元素
* event.currentTarget 指向绑定事件处理程序的当前元素

## React中的事件系统
一句话概括React事件系统就是基于事件委托机制模拟浏览器事件系统实现事件处理.
### [合成事件](https://github.com/facebook/react/blob/master/packages/react-dom/src/events/SyntheticEvent.js)
React通过SyntheticEvent来模拟底层事件实现,通过React传入对象的nativeEvent可以获取到底层的事件对象.
1. React通过SyntheticEvent可以更好是实现跨平台逻辑,通过不同平台的React Renderer来实现具体SyntheticEvent的封装.
2. React能更好的做性能的优化.比如React在17之前的事件复用,需要主动调用persist才能持久化React的SyntheticEvent.在React 17中已经去掉了这部分逻辑.

### 事件监听
在react 17中,事件委托的绑定节点是React应用的Root元素,在创建Root元素的时候完成的React对事件的监听逻辑.  
[ReactDom.render](https://github.com/facebook/react/blob/5f21a9fca455069bc1e986e1528963a5055a8f21/packages/react-dom/src/client/ReactDOMLegacy.js#L287) => [legacyRenderSubtreeIntoContainer](https://github.com/facebook/react/blob/5f21a9fca455069bc1e986e1528963a5055a8f21/packages/react-dom/src/client/ReactDOMLegacy.js#L175) => [legacyCreateRootFromDOMContainer](https://github.com/facebook/react/blob/5f21a9fca455069bc1e986e1528963a5055a8f21/packages/react-dom/src/client/ReactDOMLegacy.js#L113) => [createLegacyRoot](https://github.com/facebook/react/blob/5f21a9fca455069bc1e986e1528963a5055a8f21/packages/react-dom/src/client/ReactDOMRoot.js#L164) => [createRootImpl](https://github.com/facebook/react/blob/5f21a9fca455069bc1e986e1528963a5055a8f21/packages/react-dom/src/client/ReactDOMRoot.js#L110) => [listenToAllSupportedEvents(rootContainerElement)](https://github.com/facebook/react/blob/5f21a9fca455069bc1e986e1528963a5055a8f21/packages/react-dom/src/client/ReactDOMRoot.js#L140)  
以上梳理的React在首次渲染事代码的调用逻辑,重点关注listenToAllSupportedEvents的处理逻辑,这里完成了页面根元素对相应事件的封装逻辑.  
#### [注册支持的事件](https://github.com/facebook/react/blob/5f21a9fca455069bc1e986e1528963a5055a8f21/packages/react-dom/src/events/DOMPluginEventSystem.js#L88)
![事件注册](./reactStatic/reactEvent/registerEvent.png)  
#### [在root元素绑定对应事件的回调函数](https://github.com/facebook/react/blob/5f21a9fca455069bc1e986e1528963a5055a8f21/packages/react-dom/src/events/DOMPluginEventSystem.js#L384)
![绑定事件](./reactStatic/reactEvent/rootListener.png)  
#### [绑定事件逻辑](https://github.com/facebook/react/blob/5f21a9fca455069bc1e986e1528963a5055a8f21/packages/react-dom/src/events/DOMPluginEventSystem.js#L412)
![绑定事件逻辑](./reactStatic/reactEvent/addTrappedEvent.png)  
在具体的绑定事件逻辑中,主要做了两件事:
1. 根据事件名的优先级生成不同分发事件的响应逻辑
2. 在捕获阶段绑定1中生成的回调函数

### 事件响应
React的事件响应过程其实就是在冒泡阶段处理不同优先级事件分发逻辑的过程,假设我们有下面这样的页面结构:  
![绑定事件逻辑](./reactStatic/reactEvent/pageStruct.png)  
在上面的页面结构中,App组件的div中绑定了click点击事件.那下面从这个div的click事件响应的触发逻辑来梳理react事件系统的响应过程.  
click事件在响应过程中的优先级对应的是[DiscreteEventPriority](https://github.com/facebook/react/blob/5f21a9fca455069bc1e986e1528963a5055a8f21/packages/react-dom/src/events/ReactDOMEventListener.js#L368),对应的事件分发函数是[dispatchDiscreteEvent](https://github.com/facebook/react/blob/5f21a9fca455069bc1e986e1528963a5055a8f21/packages/react-dom/src/events/ReactDOMEventListener.js#L122),在dispatchDiscreteEvent中调用[dispatchEvent](https://github.com/facebook/react/blob/5f21a9fca455069bc1e986e1528963a5055a8f21/packages/react-dom/src/events/ReactDOMEventListener.js#L160)来完成对事件的派发处理.在dispatchEvent中主要调用[attemptToDispatchEvent](https://github.com/facebook/react/blob/5f21a9fca455069bc1e986e1528963a5055a8f21/packages/react-dom/src/events/ReactDOMEventListener.js#L195)来实现事件的派发处理
![触发事件逻辑](./reactStatic/reactEvent/dispatcheEvent.png)  
[attemptToDispatchEvent](https://github.com/facebook/react/blob/5f21a9fca455069bc1e986e1528963a5055a8f21/packages/react-dom/src/events/ReactDOMEventListener.js#L250)主要通过原生的事件对象获取到实际触发事件的元素和fiber节点然后发起事件处理逻辑. 
[dispatchEventForPluginEventSystem](https://github.com/facebook/react/blob/5f21a9fca455069bc1e986e1528963a5055a8f21/packages/react-dom/src/events/DOMPluginEventSystem.js#L534)中最后调用dispatchEventsForPlugins完成事件的触发逻辑.  
![触发事件逻辑](./reactStatic/reactEvent/dispatchEventSystem.png)  
[dispatchEventsForPlugins](https://github.com/facebook/react/blob/5f21a9fca455069bc1e986e1528963a5055a8f21/packages/react-dom/src/events/DOMPluginEventSystem.js#L273)主要是从触发元素中获取相应的事件监听函数然后依次执行.  
![执行逻辑](./reactStatic/reactEvent/executeEvent.png)  

### 图说React事件

#### 事件绑定
![绑定事件](./reactStatic/reactEvent/listenEvent.png)  
#### 事件响应  
![事件触发](./reactStatic/reactEvent/eventSimulation.png)  


### React中的合成事件和原生事件的关系
React的事件系统是基于原生事件系统在捕获阶段事件触发事件的回调处理逻辑,原生事件的处理逻辑会影响合成事件的触发逻辑,我们通过几个例子来看他们之间的关系.
1. 原生事件的stopPropagation会影响合成事件的触发逻辑.  
2. 在事件更新中开启了isBatchingEventUpdates,同一次事件处理过程的中更新逻辑会被合并.

