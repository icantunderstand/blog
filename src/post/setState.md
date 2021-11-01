---
title: setState源码分析
date: "2021-04-01"
tags: React
path: /react-setstate
---

在使用React进行业务开发的时候setState可以对组件的数据进行更新并且触发页面的渲染.本文从源码角度梳理在调用setState的相关处理逻辑.

## 前置知识
### React多平台渲染
React在设计上使用了依赖注入的方式,通过注入不同平台的渲染renderer来实现多平台的渲染能力.
![react renderer](./setState/reactRenderer.png)
在创建组件实例的时候,React会注入不同平台renderer最后结合react-reconciler来实现组件的渲染更新.

### 事件循环
[事件循环](https://icantunderstand.cn/event-loop)

### lane
在react新的架构中定义了lane的概念.lane用于控制不同任务的更新优先级处理逻辑,具体可以参考[lane模型](https://react.iamkasong.com/concurrent/lane.html)

## 源码梳理
基于React的多平台渲染架构,在梳理setState源码是从以下两个方面进行的:
* 注入渲染renderer(setState从哪里来)
* 发起调用(setState做了什么) 

### 注入渲染renderer
在[图说React渲染流程](https://icantunderstand.cn/react-render-interpretation)中,React会根据当前的页面结构创建workInProgress树,注入renderer的逻辑就在创建组件实例的过程中.
在创建[类组件](https://github.com/facebook/react/blob/a423a01223785a8bc4dcd55f2a0288200b033eee/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L943)的时候,会执行constructClassInstance创建组件的实例.
![constructClassInstance](./setState/constructor.png)
在[constructClassInstance](https://github.com/facebook/react/blob/a423a01223785a8bc4dcd55f2a0288200b033eee/packages/react-reconciler/src/ReactFiberClassComponent.new.js#L591)中主要做了如下两件事:
1. 执行构造函数,创建组件实例
2. 注入组件更新逻辑实现
![执行构造函数](./setState/executeConstruct.png)  

在[adoptClassInstance](https://github.com/facebook/react/blob/a423a01223785a8bc4dcd55f2a0288200b033eee/packages/react-reconciler/src/ReactFiberClassComponent.new.js#L581)中在实例上注入了updater实现了组件的更新注入能力.
![注入updater](./setState/adoptClass.png)  

### 发起调用
在组件的实例化过程中,注入了提供更新能力的updater.调用的逻辑其实就是梳理对应的updater如何触发页面的更新.通常调用setState是如下的方式:


    this.setState({  })

setState是挂载在组件实例上的方法,在创建类组件的时候会调用React[类组件的构造函数](https://github.com/facebook/react/blob/a423a01223785a8bc4dcd55f2a0288200b033eee/packages/react/src/ReactBaseClasses.js#L20)来初始化实例.
![baseComponent](./setState/baseComponent.png)  
在调用setState的时候其实是调用注入的updater(classComponentUpdater)的enqueueSetState逻辑来实现页面的渲染更新.
在classComponentUpdater中主要做了:
1. 创建update 形成update的链表结构(updateQueue) 在更新阶段会依次处理链表的update
2. 通过scheduleUpdateOnFiber触发更新  

在[scheduleUpdateOnFiber](https://github.com/facebook/react/blob/a423a01223785a8bc4dcd55f2a0288200b033eee/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L456)中获取到根节点通过ensureRootIsScheduled发起根节点更新调度.  

[ensureRootIsScheduled](https://github.com/facebook/react/blob/a423a01223785a8bc4dcd55f2a0288200b033eee/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L632)的功能是在根节点上调度任务的执行,主要功能如下:
![ensureRootIsScheduled](./setState/ensureRootIsScheduled.png)
* 根据当前任务获取优先级通过Scheduler发起不同优先级的任务调度
* 同优先级任务合并,不发起新的任务调度  

setState是SyncLanePriority优先级,在调度上就会通过微任务发起调度逻辑等主代码块执行完毕后开启微任务执行(调度更新)

### 图解setState更新逻辑
假设我们在这样一个场景中在一个函数中连续调用的两次setState


    this.setState({  })
    this.setState({  })

#### 第一次调用
在第一次调用setState的时候在fiber的根节点上创建了updateQueue添加此次的更新内容,通过微任务发起调度.
![setStateFirst](./setState/setStateFirst.png)
#### 第二次调用
第二次调用setState获取的更新优先级跟之前任务一致,这次只进行updateQueue逻辑增加任务的操作  
![setStateSecond](./setState/setStateSecond.png)  
#### 更新任务执行
微任务执行,开启更新逻辑



