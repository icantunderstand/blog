---
title: 事件循环
date: "2018-09-17" 
tags: JavaScript
path: /event-loop
---

## 简介 
  事件循环是不同的宿主环境(浏览器或node)对javascript任务进行调度的一种机制,在讨论事件循环的时候首先应该区分node和浏览器(不同宿主环境实现的事件循环机制不同).下面通过介绍一些javascript的基础知识,进而简单的介绍浏览器中的事件循环和node中事件循环.
## 基本概念
1. javascript程序的执行机制是通过栈来管理的.当进入一个函数,就创建了这个函数的执行环境并将这个执行环境推入栈顶,执行完当前的函数后,从栈顶移除对应的执行环境,进入到外层的执行环境.
![stack](./eventloop/stack.gif) 
2. javascript的执行是单线程的.但是由于整个事件循环的调度,赋予了javascript对异步任务的强大处理能力.对于异步任务(网络请求,按钮点击)javascript代码调用宿主环境提供的api,将异步任务交给其他的线程去完成.当对应的异步任务完成的时候,将回调函数添加到回调函数的队列中,由事件循环来实现会回调函数的调用.
![loop](./eventloop/loop.png)

## marcotasks microtasks
将macrotasks和micortasks单拉出来讲解,是因为理解好这点能更好的理解浏览器或node的任务队列.在实际的实现环境中不同的任务可以放置在不同的任务队列中,然后通过对多个任务队列的调用来完成整个事件循环.

1. macrotasks:
  * 定时器(timer) setTimeout setInterval setImmediate
  * message channel  (message channel执行的优先级高于timer)
  * I/O
  * UI rendering

2. microtasks:
  * Promises
  * MutationObserver(监听DOM)  

3. 其他api
  * queueMicrotask(fn)
    将Fn推入微任务执行队列
  * requestAnimationFrame  
    通知浏览器在下次重绘之前调用传入的回调函数，回调函数默认传入函数执行的时间戳.requestAnimationFrame不属于宏任务和微任务，在微任务执行之后执行
  * process.nextTick
    process.nextTick是node上的api，具体的执行时机是在微任务之前执行。
    ![nextTick](./eventloop/nextTick.png) 


        setTimeout(function(){
          console.log(1);
        });
        new Promise(function(resolve){
          console.log(2)
          for( var i=100000 ; i>0 ; i-- ){
              i==1 && resolve()
          }
          console.log(3)
        }).then(function(){
          console.log(4)
        });  

        console.log(5);
        process.nextTick(() => { console.log('nextTick'); })
        输出的顺序依次是 2 3 5 nextTick 4 1 

  * requestIdleCallback
    window.requestIdleCallback(callback[, options]) 
    1. callback是一个在事件循环空闲时即将被调用的函数的引用，接收一个IdleDeadline参数，通过该参数可以获取当前空闲时间(timeRemaining())以及回调是否在超时时间前已执行的状态(didTimeout)
    2. options 可选参数 可以配置timeout  表示超时毫秒数未调用回调函数，回调函数将在下一次空闲期间被强制执行。


在具体的实现中只会有一个microTasks队列,简单的理解事件循:
1. 浏览器或者node会按照顺序执行自己环境的多个macrotasks队列
2. 每执行完一个macrotask队列就会拿出micortasks队列的任务全部执行，然后继续执行下一个macrotask队列  

![runTask](./eventloop/runTask.jpg)

## event loop in browser
  其实通过对上面相关的知识的介绍,已经可以大致的了解浏览器中事件循环的任务队列 主要有以下几种macrotasks队列
  1. 事件callback
  2. I/O(xhr)
  3. timers
  4. UI渲染  

![loop](./eventloop/loop.png)

## event loop in node
  ![node](./eventloop/node.png)  

## 注意点
1. 在浏览器或者node中某些代码的执行会导致event loop失效(停留在处理一个事件队列导致无法进入其他的事件队列的处理).比如浏览器中javascript的长时间执行会导致UI无法交互,node中process.nextTick的递归调用  

## 相关资料
[通过microtasks和macrotasks看JavaScript异步任务执行顺序](https://tuobaye.com/2017/10/24/%E9%80%9A%E8%BF%87microtasks%E5%92%8Cmacrotasks%E7%9C%8BJavaScript%E5%BC%82%E6%AD%A5%E4%BB%BB%E5%8A%A1%E6%89%A7%E8%A1%8C%E9%A1%BA%E5%BA%8F/)  
[libuv Design overview](http://docs.libuv.org/en/v1.x/design.html)
[How JavaScript works in browser and node?](https://itnext.io/how-javascript-works-in-browser-and-node-ab7d0d09ac2f)
[Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/?utm_source=html5weekly&utm_medium=email)  
[Further Adventures of the Event Loop - Erin Zimmer - JSConf EU 2018](https://www.youtube.com/watch?v=u1kqx6AenYw) 
[菲利普·罗伯茨：到底什么是Event Loop呢？ | 欧洲 JSConf 2014](https://www.youtube.com/watch?v=8aGhZQkoFbQ&t=55s)  