---
title: 如何构建一个WEB同构应用
date: 2019 - 4 - 24
tags: 工程化
path: /iosmorphism
---

## 简介
　　WEB同构应用指的是通过代码的编译转换手段(通常借助于babel)来让代码在不同端client(浏览器), server(服务器)运行.同构的web应用主要有以下的优点:
1. 一套代码多处运行减少维护成本
2. 任务拆分,通过同构可以实现更多的功能(SSR, fetchData)

![isomorphism](./isomorphism/isomorphism.png)

## 简单的实现思路
1. 将client端的代码转换成server可以执行的代码(es6 => commonjs).
2. 在两端组合出一套模式相同的代码逻辑.下面的例子中在server和client端使用不同的react-router提供的组件.
![App](./isomorphism/app.png)   
3. server端路由匹配,组装资源(css, js, data), 可以通过不同的中间件根据请求信息来组装.  
4. client端路由匹配,匹配资源(data, 检查页面渲染结果是否正确).

## 过程

### 代码转换
　　在进行代码转换的时候,首先要明白代码转换的目的才能明确对不同文件的转换策略.比如为了实现同构将client端的代码转换成server端可以运行的代码,对不同类型CSS文件的不同处理策略.通常借助于webpack来实现代码的转换功能.webpack会根据入口文件依次的解析引用的各种文件类型,通过配置的webpack loader可以实现对应文件类型的转换.以下主要从不同类型文件处理的角度进行介绍:
#### javascript
转换的目标是client端的代码(排除node_modules).
将client转换成server端可以运行的代码
![srcToLib](./isomorphism/srctolib.png)
#### css
对于CSS可以有以下两种的处理方法:
1. css-in-js (css-loader style-loader)处理,包括node_modules,client端不需要提取的CSS
2. client端全局样式或者通过mini-css-extract-plugin提取的样式  

#### 代码转换优化
##### 公有代码提取
可以使用DllPlugin对使用的基础组件库进行统一的提取和引用.提取公有模块代码主要有以下的好处:  
1. 通过DllPlugin对公有代码的提取,能一定程度上加快webpack构建代码的速度
2. 公有部分的逻辑相对来说是变化的较少,可以充分的利用缓存
3. 减少其他bundle的体积,页面加载的资源更少  
![dll](./isomorphism/dll.png)  

##### 加快编译速度
可以使用happyPack加快编译速度,happyPack通过多进程的方式来加快代码的打包过程.
使用happyPack的例子:
![happyPack](./isomorphism/happy1.png)
![happyPack](./isomorphism/happy2.png)  

### 资源匹配
#### 静态资源(CSS js)
可以通过webpack-manifest-plugin生成资源的位置信息文件,然后通过该文件查找资源的位置.
资源位置文件
![manifest](./isomorphism/manifest1.png)
通过manifest查找资源的位置
![manifest](./isomorphism/manifest2.png)
#### data
1. server端执行匹配到组件的获取数据的方法(返回promise),primose执行完毕获取到最新的数据储存.将数据通过脚本挂载到window上的属性上.
2. client端通过window属性的获取,生成存储数据.
服务端获取数据和注入数据
![serverStore](./isomorphism/serverStore.png)
client端提取数据
![clientStore](./isomorphism/clientStore.png) 

## 扩展性

### 配置单页是否支持服务端渲染
通过中间项配置是否支持服务端渲染
![configServerRender](./isomorphism/configServerRender.png)

## 思考
在是否在项目中使用同构应用的时候,还是要结合具体的场景.可以有以下的几点考虑:
1. 项目中是否需要进行服务端渲染 => 使用者角度
2. 是否有引入node中间层(api转发)的必要, 其他的替代方案是否可行(nginx) => 整体设计的角度
