---
title: React Fiber Architecture(译)
date: 2019 - 5 - 9
tags: React
path: /react-fiber
---

## 前言
在react最新的reconciliation使用的是Fiber架构.Fiber使用的增量渲染的模式,具体的实现是渲染的任务可以被拆分,在页面更新的时候具体的任务可以被打断,复用.这些特性无疑对页面交互是有很大的提升.下面通过React Fiber Architecture这篇文章来对Fiber有个大体的认识.之后的系列我会深入react的源码来仔细学习Fiber的具体实现.  

## 基础知识
### What is reconciliation?
#### reconciliation
react通过Virtual Dom和真实Dom之间建立缓冲,通过diff出变化前后virtual Dom的差异来将差异更新到真实Dom上.reconciliation正是对比Virtual Dom差异的实现.

#### update(更新)
渲染页面的数据发生变化导致页面更新

在没有reconciliation(调和)的情况下,数据的变动将会导致整个页面重新绘制.通过Virtual Dom来代表将要渲染的页面,将Virtual Dom交给对应的renderer(react-dom, react native)来进行页面的绘制.在页面更新的时候通过调和来生成前后Virtual Dom树的差异来进行页面的更新.这样一定程度上提高了页面的性能.React的更新策略是在下面的假设下进行的:
1. 组件很少进行跨层级的移动
2. 不同类型的组件生成的结构是不同的
3. 相同类型的列表元素可以通过唯一的标识来进行复用

### Scheduling(调度)
#### scheduling
确定哪些更新的任务需要执行  
#### work(更新任务)
需要执行的任务,通常是页面的更新
React的构建UI的库,它采取pull(拉)的模式来处理页面的更新交互.在push(推)的模式中数据(更新)推动整个页面的更新.React对更新的任务进行了一定的调度,来达到更好的页面交互.React采用这种策略主要有以下的原因:
1. 在处理UI界面的时候,通常上不是所有的更新都需要立刻被执行的.(可以类比图片的懒加载)
2. 不同的类型更新应该有优先级.为了更好的交互体验,通过优先级可以提供更好的页面交互.(比如动画的优先级更高,页面会更加流畅)
3. push的模式需要开发者组织页面的更新,pull的模式使得React可以帮助开发者实现更好的页面交互.

## what is Fiber?
通过Fiber使得React可以更好的调度任务.主要有以下的功能:

1. 暂停任务并且在之后继续执行
2. 对不同的任务设置优先级
3. 复用之前完成的任务的结果
4. 丢弃不需要的任务

在这里可以简单的将fiber理解为需要做的任务.在进行页面绘制的时候组件更新和函数执行的任务都会被推进执行的栈结构.这种模式当太多任务需要执行的时候会导致页面的交互变的卡顿.浏览器提供了两个api来处理上面的问题.
1. requestIdleCallback 通过requestIdleCallback可以在空闲的时候执行一个低优先级的任务
2. requestAnimationFrame 可以在浏览器下次重绘之前执行一个较高优先级的任务  


为了利用上面的函数来实现页面的更新,就需要将渲染的任务拆分成多个任务.Fiber架构可以理解为重新实现的栈而fiber节点是一个虚拟的栈帧.Fiber架构通过调度帧的执行逻辑来完成页面的更新.

### fiber结构
一个fiber节点代表一个栈帧,也代表一个组件的实例.下面是fiber结构一些重要的属性:

#### type  key
type和key对于fiber节点的作用跟type和key对React element的作用一致. type可以判断fiber节点对应的是React组件还是宿主环境的组件(div).key用于调和的时候复用fiber.

#### child sibling  return 
fiber是通过单链表进行关联的.fiber节点的return指向它的parent.child指向fiber第一个子节点.sibling指向当前fiber节点的兄弟节点.

    function Parent() {
      return [<Child1 />, <Child2 />]
    }

上面的结构Child1是Parent的child,Child2是Child1的sibling,Parent是Child1和Child2的return.
#### pendingWorkPriority
优先级

### alternate
一个组件至多有两个fiber结构与它对应: 当前的fiber(正在处理的fiber),flushed fiber(处理完毕,准备渲染(commit)的fiber), alternate(当前fiber的替身).

## 参考
[React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture)
[完全理解React Fiber](http://www.ayqy.net/blog/dive-into-react-fiber/)
