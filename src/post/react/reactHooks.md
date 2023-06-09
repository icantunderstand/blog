---
title: React Hooks源码解读
date:  "2021-03-17"
tags: React
path: /react-hooks
---

React在函数组件中引入了Hooks机制使函数组件拥有了类组件的生命周期能力(本质上有差异),本文主要通过源码和图文的方式用最简化的方式来阐述React Hooks的实现原理.

## 前置知识
### Fiber
React为了实现时间切片,将页面的组件节点都进行了新的抽象-Fiber.通过引入Fiber结构React可以更好的实现组件更新的调度.Fiber结构主要有以下几种类型的结构:
1. Fiber节点的连接结构,在组件更新时候需要依赖这些属性
2. 动态的运行数据(updateQueue,memoizedState)等,在渲染更新的时候会利用这些属性存储需要更新的操作和数据.Hooks的实现就是依赖这块的结构.
3. Lanes 这里主要定义任务的优先级,Fiber Reconciler实现了一套新的优先级更新机制,这块在之后的文章会再介绍.
![Fiber结构](./reactStatic/reactHooks/Fiber.png)

### update
react在处理更新中引入了update的概念,在触发更新的时候React将update插入到对应的updateQueue中然后调度页面的渲染更新.最后通过updateQueue的执行来完成更新. 

### React Fiber Reconciler
React为了实现更新可中断等特性,在具体的渲染过程中会维护两个数据结构:
1. current Fiber树结构  当前展示的页面结构
2. workInprogress树结构 在更新中添加了更新但是没有渲染到页面的结构  

在具体的渲染过程中主要分为:
1. render阶段 render阶段主要根据已有的Fiber节点构造对应的workInProgress节点 这个阶段实现了任务的中断,优先级任务处理等逻辑
2. commit阶段 commit阶段主要根据Fiber节点的类型不同来执行对应的更新操作(更新Dom等)

### Hook的数据结构
[hook的数据结构](https://github.com/facebook/react/blob/0203b6567c6fd6274866c853ef938241d24551ec/packages/react-reconciler/src/ReactFiberHooks.new.js#L140)如下:  
![hook的数据结构](./reactStatic/reactHooks/hook.png)

## Hooks实现思路
Hooks在组件初次挂载和组件更新阶段是调用的不同的[实现逻辑](https://github.com/facebook/react/blob/1d1e49cfa453b58769e87c3c8d321024d58c948f/packages/react-reconciler/src/ReactFiberHooks.new.js#L389)
![挂载不同的hook](./reactStatic/reactHooks/different_hook.png)
![mount阶段hook](./reactStatic/reactHooks/mountHookCode.png)
![update阶段hook](./reactStatic/reactHooks/updateHookCode.png)
下面先整体的介绍不同阶段Hooks的实现过程然后在深入到源码中看具体的实现.

### 图解hooks的实现思路
Mount阶段Hooks的实现逻辑
![Mount阶段hook逻辑](./reactStatic/reactHooks/MountHook.jpg)  
Update阶段Hooks的实现逻辑  
![Mount阶段hook逻辑](./reactStatic/reactHooks/updateHook.jpg)  

### 源码解析hooks的实现思路
以下主要以useState这个hook来分析React在mount阶段和update阶段的源码实现.

#### mount阶段源码分析
在mount阶段组件,useState调用的[mountState](https://github.com/facebook/react/blob/1d1e49cfa453b58769e87c3c8d321024d58c948f/packages/react-reconciler/src/ReactFiberHooks.new.js#L1235)  
![mountState代码逻辑](./reactStatic/reactHooks/mountState.png)  
mountState主要做了:
1. 根据initialState初始化memoizedState和更新queue
2. 返回memoizedState和更新函数(绑定了当前的hook的queue)

#### update阶段源码分析
在使用useState返回的回调触发页面更新的时候是调用的[dispatchAction函数](https://github.com/facebook/react/blob/1d1e49cfa453b58769e87c3c8d321024d58c948f/packages/react-reconciler/src/ReactFiberHooks.new.js#L1901)  
![dispatchAction代码逻辑](./reactStatic/reactHooks/dispatchAction.png)  
在组件更新执行到对应的函数组件的时候,会执行对应hook的update阶段对应的hook逻辑.useState对应的就是[updateState](https://github.com/facebook/react/blob/1d1e49cfa453b58769e87c3c8d321024d58c948f/packages/react-reconciler/src/ReactFiberHooks.new.js#L1262).从updateState的代码可以看出useState底层是使用的useReducer代码逻辑.这样具体的更新逻辑就在[updateReducer](https://github.com/facebook/react/blob/1d1e49cfa453b58769e87c3c8d321024d58c948f/packages/react-reconciler/src/ReactFiberHooks.new.js#L710)中了!!!
![dispatchAction代码逻辑](./reactStatic/reactHooks/updateReducer.png)   
updateReducer主要逻辑如下:
1. 根据fiber上存储的hook链表获取到当前的hook,hook的更新queue
2. 循环执行hook的更新queue,将执行结果保存到hook的数据结构上
3. 返回处理结果和更新函数

以上梳理完了React Hook的源码执行流程,也能解决开发中的一些疑问:
1. 比如hook的添加为什么不能使用条件语句  因为前后会导致hook的链表无法对应

## 参考
[React技术揭秘](https://react.iamkasong.com/hooks/prepare.html#%E4%BB%8Elogo%E8%81%8A%E8%B5%B7)