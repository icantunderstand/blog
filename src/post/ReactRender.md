---
title: React render流程梳理
date: "2019-05-10"
tags: React
path: /react-render
---

## 前言

    import React from 'react';
    import ReactDOM from 'react-dom';
    import './index.css';
    import App from './App';
    ReactDOM.render(<App />, document.getElementById('root'));

当通过create-react-app初始化一个项目的时候,上面这段代码就在浏览器中绘制出了内容.ReactDOM.render(ReactElement, Container, callback)是怎么将React组件绘制到浏览器中的呢?本文是React源码阅读系列的起始篇,在这篇文章中主要围绕以下两个方面进行介绍:
1. render()方法调用中相关函数的调用
2. render()方法调用中产生的数据结构的梳理

阅读源码是一个知其然知其所以然的过程.通过源码阅读的过程中我们能学习到一些设计,代码优化,解决方案等,通过这些来反哺实际工作的遇到的问题.这个也是这个系列想要获得并且与大家分享的内容.

## 如何阅读React源码
React仓库是一个包含多个package的仓库.在阅读源码之前需要对独立的仓库有个简单的认识.比如react通过react-reconciler和renderer(react-dom, react-native)来完成页面的渲染.
1. 下载[react源码](https://github.com/facebook/react), 打包本地文件

    yarn build react/index,react-dom/index,scheduler --type=NODE

2. 通过yarn link声明包的指向

    cd build/node_modules/react
    // 声明react指向
    yarn link
    cd build/node_modules/react-dom
    // 声明react-dom指向
    yarn link   

3. 把项目中的依赖指向设定的包

    yarn link react react-dom

4. 增加断点调试

## ReactDOM.render()调用过程中的函数调用
以下所有代码基于React 16.8.6  

![reactRenderFunc](./ReactRender/renderFunc.png)

### 走入ReactDOM.render()源码
首先定位到packages/react-dom/src/client/ReactDOM.js
![domRender](./ReactRender/domRender.png)
可以看到ReactDOM.render()方法将当前的ReactElement和Container信息传递给了legacyRenderSubtreeIntoContainer.
![containerRender](./ReactRender/containerRender.png)
由于是首次mount,这个时候还没有root节点并且是应用的根节点这里直接进行root节点的创建.最后调用root的render方法就开始进行页面的绘制.在legacyCreateRootFromDOMContainer方法中会对当前容器的内容进行清理.这里调用创建了ReactRoot节点.
![createReactRoot](./ReactRender/createReactRoot.png)
![reactRoot](./ReactRender/ReactRoot.png)
createContainer根据当前的container信息来创建根容器.
定位到packages/react-reconciler/src/ReactFiberReconciler.js
![createContainer](./ReactRender/createContainer.png)
定位到packages/react-reconciler/src/ReactFiberRoot.js(Fiber !!!!!!) 
在createFiberRoot方法中,创建了根据当前的容器信息创建了FiberRoot并且创建了一个HostRootFiber进行相互引用.
![createFiberRoot](./ReactRender/createFiberRoot.png)  
## ReactDOM.render()调用过程中的数据结构
![reactStruct](./ReactRender/renderStruct.png)
通过启动最开始create-react-app创建的项目,可以看到以下的输出.  
![showRenderStruct](./ReactRender/showRenderStruct.png)
## 后记
这篇文章只梳理了React在实际调用渲染函数之前的函数调用和数据结构.在这个过程中终于盼来了千呼万唤的fiber.之后的文章会继续深入react的渲染流程和fiber的实现来对react进行学习.
