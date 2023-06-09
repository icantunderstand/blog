---
title: 页面滚动
date: "2018-08-26"
tags: JavaScript
path: /js-scroll
---

## 简介
在不同的场景下,需要页面实现不同的滚动效果例如滚动到最底部、滚动到最顶部。以下首先对滚动的几个基本的属性进行总结并给出实现滚动的一些方案

## 基础属性简介
当元素的子元素比元素高且overflow=scroll时,元素会scroll.此时移动滚动条出触发本元素的scroll事件  

| 属性 | 定义 | 操作| 
| - | :-: | -: | 
| clientHeight | 与元素的高度有关,代表元素的高度加上padding(不包括border、水平滚动条的高度、margin),对于inline元素该属性的值为0 | 只读 | 
| clientWidth | 与clientHeight相似 | 只读 |
| offsetHeight | 与元素的高度有关,不同于clientHeight,它包括border、水平滚动条的高度,不包括margin.对于inline元素该属性为0 |  只读 |
| offsetWidth | 与offsetWidth相似 | 只读 |  
| scrollHeight | 当出现滚动时,scrollHeight代表元素内容的高度(包括在不在内容区域的内容)  当一个元素出现滚动, 它的相关属性 判读元素是否滚动到底部 scrollHeight - scrollTop === clientHeight | 只读 |
| scrollTop | 当元素出现滚动的时候,scrollTop代表元素可见内容距离该元素顶部的高度.不存在滚动条的时候,scrollTop为0 | 可读可写 |
|offsetTop | 获取当前元素跟offsetParent父元素顶部(position不为static的父元素)的距离 | 只读 |

## 实现滚动的几种思路
在实现滚动上首先要确定的一个点是你需要知道此刻这个元素的子元素已经绘制完成(高度确定)。比如在react的项目中可以在didUpdate中触发元素的scroll事件,下面介绍下实现滚动的几种方法:
1. 锚点 通过在页面中设置锚点能在实现跳转到页面相应位置的目的,这种方式也比较好操作.缺点是需要在url中添加其他信息
2. offsetTop, scrollTop  
  * offsetTop 可以在页面隐藏一个元素 通过获取这个元素的offsetTop来设置滚动元素的scrollTop 
  * scrollTop 直接设置scrollTop来实现定位 当scrollTop设置的值超出元素的最大值(scrollHeight) 会被设置成最大值(定位到最底部)  
3. scrollIntoView(alignToTop)   
  * alignToTop默认是true 通过item.scrollIntoView()/item.scrollIntoView(true)会使元素的顶部跟可视区域的顶部对齐
  * item.scrollIntoView(false)会使元素的底部跟可视区域的底部对齐