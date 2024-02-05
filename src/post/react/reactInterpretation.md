---
title: 图说React渲染流程
date:  "2024-02-05"
tags: React
path: /react-render-interpretation
---

本文通过图解的方式尝试生动的叙述React渲染组件的过程.

## 前置知识
### react渲染模式
1. Concurrent 模式  异步渲染模式,实现了基于任务的时间切片等特性
2. legacy 模式 同步渲染模式,现在主要的渲染模式

### react渲染阶段
1. render阶段  基于已有的Fiber树(current)构建workInprogress树 在workInprogress记录了需要进行更新的操作(effectList)
2. commit阶段  commit分为以下三个阶段:
  * before mutation  此时dom节点还没有渲染到页面中,执行getSnapshotBeforeUpdate周期函数和useEffect钩子函数
  * mutation  渲染DOM 根据effectList的tag标注进行dom元素的更新,删除,替换等
  * layout 执行useLayoutEffect等相关逻辑  进行current和workInprogress的替换  
  
## 图解渲染
我们先假设我们的身份是React的好友,React是前端世界里面的一个一流的画师,我们希望他给我们画这样一幅画.  

![画的模板](./reactStatic/reactInterpretation/draft.png)  
React大师稍加思索(babel)就把画的模板构想出下面的两张蓝图:  
元素的语言表达
![语言表达](./reactStatic/reactInterpretation/structDraft.png)
元素结构
![元素结构](./reactStatic/reactInterpretation/draw.png)
React真的是一个画术大师,他有两个最出色的技能:
1. 在脑海里面构想画图(workInprogress)然后一次画到画板上,画出的画大家都称赞道奇(首次渲染)
2. 在已有的画上修改(current => workInprogress) 画出的画既有原来画的痕迹又有新的神韵(触发更新)  

React欣然接受了这次的绘画任务,因为他很喜欢每次作画后大家对他的称赞,于是他开始作画了.  
### 构思([render阶段](https://github.com/facebook/react/blob/148f8e497c7d37a3c7ab99f01dec2692427272b1/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L991))
React大师看了下自己空白的画布,决定先在脑海里面构造画的样子.React看到画的模板的时候第一时间是看到了各个节点之间的联系于是他对画的模板有了重新的构想.
![fiber结构](./reactStatic/reactInterpretation/fiberStruct.png)
这个是React画师特有的作画方式,还是我上次跟他一起喝醉他说漏的,哈哈我就这样把他的秘密告诉大家了,大家还是装作不知道让React来给大家讲他作画的过程把.  
React: 我在作画的时候主要思考了两件事:
* 怎么把画的模板对应成更好解读的结构([Fiber结构](https://github.com/facebook/react/blob/148f8e497c7d37a3c7ab99f01dec2692427272b1/packages/react-reconciler/src/ReactFiber.new.js#L110) [performUnitOfWork](https://github.com/facebook/react/blob/148f8e497c7d37a3c7ab99f01dec2692427272b1/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1543) [completeWork](https://github.com/facebook/react/blob/148f8e497c7d37a3c7ab99f01dec2692427272b1/packages/react-reconciler/src/ReactFiberCompleteWork.new.js#L782))
* 如何在构思的过程中把绘画的思路记录下来在画的过程一蹴而就(effectList 创建节点)
经过一番构思,React想好了绘画的思路
![render阶段](./reactStatic/reactInterpretation/renderPhase.png)

### 挥墨([commit阶段](https://github.com/facebook/react/blob/148f8e497c7d37a3c7ab99f01dec2692427272b1/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1008))
在挥墨这个阶段对于React大师其实是小菜一碟了,因为费心的事情已经在构思阶段解决了,他主要根据之前的构思思路(effectList等)去作画就好,不过大师的作画方式还是不同于一般画师的
* 在开始作画之前他要喝一杯酒,他私下跟我说这杯酒会影响之后的作画([before mutation](https://github.com/facebook/react/blob/148f8e497c7d37a3c7ab99f01dec2692427272b1/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1800)阶段 周期函数钩子),我心想也是喝多了肯定不能画了吧  
* 在作画中,他又老能搞出一些新花样([mutation](https://github.com/facebook/react/blob/148f8e497c7d37a3c7ab99f01dec2692427272b1/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1818) [layout](https://github.com/facebook/react/blob/148f8e497c7d37a3c7ab99f01dec2692427272b1/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1842) 组件添加到视图 生命周期函数执行),正是这些每次不同的新奇花样让他成为一个出色的画师
* 在绘画后脑海中那个构思图成为了真实的画([workInprogress => current](https://github.com/facebook/react/blob/148f8e497c7d37a3c7ab99f01dec2692427272b1/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1829))


## fiber链表结构
fiber单链表结构的一些优点:
* 可中断和恢复的任务 单链表结构允许React在多个帧中中断和恢复渲染任务，通过将任务切分小的单元，这样有助于提高用户界面响应性和避免出现卡顿
* 优先级控制 可以通过链表实现高优先级任务的优先执行
* 轻量化和内存管理 单链表对比双链表相对轻量，降低内存的占用


## 参考
[React Fiber不就是个链表么](https://juejin.cn/post/7159118990999191582)