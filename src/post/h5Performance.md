---
title: web性能优化总结
date: 2021-7-25
tags: 跨端技术
path: /h5-performance
---

h5性能优化可以总结为如下的几个方向:
* 将请求时间线上的行为提前执行
* 将请求时间线上不紧急的后置
* 将资源从最近的位置提供给页面
在讨论h5加载性能的时候主要有以下角色:
* Native容器
* 用户(开发的视角)
* 服务端(数据 页面)
* h5页面
本文会结合优化的方向从不同角色的角度总结h5优化的一些通用方案。

## Native容器优化
* Webview池 通过提前初始Webview和Webview复用降低Webview初始化时间
* [数据预取](https://icantunderstand.cn/cross-platform-prefetch) 容器侧提供数据预取能力，提前数据加载
* DNS连接 容器提前建立与h5页面相同域名的DNS链接
* [离线包](https://icantunderstand.cn/cross-platform-offline) 通过离线包可以直接加载提前下载好的本地资源展示

## h5页面内优化
* 预连接 dns-pretch, preconnect
* 资源包拆分 框架和业务代码进行拆包，框架层使用更长的缓存策略来减少框架代码的请求
* 页面资源加载 图片懒加载、路由懒加载、小图内联
* js执行优化 缓存计算结果、WebWorker、GPU渲染、长列表  

## 服务端优化
* api聚合服务 前端侧可以通过一个请求聚合多个后端请求，后端在内网完成数据的聚合
* CDN容灾策略
* 服务端渲染 可以完成数据请求组装和页面html的流式返回(renderToNodeStream)

## 用户
* 功能取舍 低端机放弃一些功能保证页面更流畅
* 骨架屏 使用骨架屏在数据未返回时给用户更好的体验
* [同层渲染](https://blog.ihanai.com/2020/12/comparison-of-solution-for-same-layer-render.html)

## 参考
[WebView性能、体验分析与优化](https://tech.meituan.com/2017/06/09/webviewperf.html)
[渲染页面：浏览器的工作原理](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work)
[同层渲染方案比较](https://blog.ihanai.com/2020/12/comparison-of-solution-for-same-layer-render.html)