---
title: 从Scheduler包来看React的任务调度
date:  2021 - 3 - 15 
tags: React
path: /react-scheduler
---

  javascript的执行是单线程的,React老的架构是利用栈(递归)来完成组件的更新渲染,这样当组件层级较深更新任务较多的时候,js线程会阻塞UI线程导致表现上页面卡顿的现象.React新的架构Fiber中将更新任务进行了[细粒度的划分](https://github.com/facebook/react/blob/f227e7f26b81cb1eba0c837ab2acd7fa7f91404f/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1472)并且实现了新的任务调度系统.这样保证了React页面更新的流畅和响应的速度.本文主要从调度React更新任务的Scheduler包入手从宏观的角度了解React中的任务调度机制.

## 前置知识

### 事件循环
  javascript中的事件循环可以参考[事件循环](https://icantunderstand.cn/2018/09/17/eventloop/) 

### isInputPenging
  isInputPending是Facebook实现的一个浏览器的新的api标准,现在只在最新的chrome版本上有对应的实现.通过调用navigator.scheduling.isInputPending方法来获取当前是否有高优先级的用户输入需要处理,从而实现打断js执行响应用户输入的目的.

## 任务调度的演进过程

![长时间执行任务](./Scheduler/scheduler_long_task.jpg)  
当js线程执行一个比较长时间的js任务的时候,会导致UI线程无法快速的响应用户的输入,造成体验卡顿等问题.
![任务分片](./Scheduler/scheduler_split_task.jpg)
将长时间执行的任务划分成多个短时间执行的任务,能有效的降低js执行线程卡死的状态,这样就引入另一个问题就是如何划分任务切片才能产生更好的UI体验.
![任务调度](./Scheduler/scheduler_continuous_task.jpg)  
基于以上两种模式的思路,js如果能在执行过程中主动的获取用户的输入(执行的deadline),主动的暂停当前js的执行并通过事件循环在下一次的事件循环中再次唤起js任务的执行，这样就能充分的利用起所有的执行时间来执行任务并且保证用户输入(高优先级任务)的响应，以上就是Scheduler在调度任务执行的实现方式，下面从源码的角度来看下Scheduler是如何实现任务调度的.

## Scheduler的实现思路
以下源码分析基于React master分支的[最新代码](https://github.com/facebook/react/blob/master/packages/src/forks/SchedulerDOM.js)  

在React进行渲染任务调度的时候,是通过调用Scheduler暴露出来的unstable_scheduleCallback将任务函数作为callback传入等待Scheduler调度执行.[源码位置](https://github.com/facebook/react/blob/00d4f95c2ad000f40ea0c774cc1ced3a0ceb6f23/packages/react-reconciler/src/SchedulerWithReactIntegration.new.js#L131)  

![Scheduler调用](./Scheduler/scheduler_call.png)
在使用Concurrent Mode的时候此处传入的callback是performConcurrentWorkOnRoot函数，这个函数是React内部调度更新的起始函数.

以下是Scheduler_scheduleCallback的代码逻辑
![Scheduler调用callback](./Scheduler/schedule_callback.png)
在unstable_scheduleCallback中主要做了如下几件事:
1. 根据传入的执行函数和优先级创建执行任务，加入异步执行队列或者同步执行队列
2. 调度任务更新

以下先只关注同步taskQueue的执行流程,requestHostCallback通过Message channel发起宏任务来执行flushWork,最终走入到workLoop整个调度的[实现逻辑](https://github.com/facebook/react/blob/00d4f95c2ad000f40ea0c774cc1ced3a0ceb6f23/packages/src/forks/SchedulerDOM.js#L200). 

![workLoop调用](./Scheduler/workloop.png)  
![任务过期处理逻辑](./Scheduler/yieldTimeout.png)
wookLoop是实现任务调用的核心逻辑,它主要实现了如下几件事:
1. 对可执行时间进行了切片(yieldInterval == 5ms) 
2. 当超时可执行时间后,进行任务队列的调整在下个事件循环中唤起任务调度逻辑.这里有区分的是同步任务队列是直接通过postMessage发起调用,延迟任务队列是通过timer(setTimeout)发起调用.

抛开源码可以简单的理解Scheduler的调度任务实现思路如下图,它正好实现了任务调度切片,优先级,高优任务插入等逻辑.
![Scheduler整体的思路](./Scheduler/how_scheduler_work.jpg)  


## 参考链接
[isInputPending的实现背景](https://engineering.fb.com/2019/04/22/developer-tools/isinputpending-api/)    
[isInputPending的使用思路](https://web.dev/isinputpending/)  
[react scheduler源码解析](https://someu.github.io/2020-11-10/react-scheduler%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90/)   
[React技术解密](https://react.iamkasong.com/concurrent/scheduler.html#%E6%97%B6%E9%97%B4%E5%88%87%E7%89%87%E5%8E%9F%E7%90%86)
