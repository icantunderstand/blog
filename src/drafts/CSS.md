
---
title: CSS复习资料总结
date: 2019-04-11 14:20:00  
tags: CSS
categories: CSS
---

## 文本溢出

### 单行

    text-overflow: ellipsis:
    overflow: hidden;
    white-space: nowrap;

### 多行

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;

## 三列布局

### 流体布局
左右浮动,中间模块设置margin实现自适应.缺点主要内容无法最先加载.

    <div>
      <div id="left">left</div>
      <div id="right">right</div>
      <div id="main">main</div>
    </div>

    #left {
      width: 100px;
      background: red;
      float: left;
    }
    #right {
      width: 100px;
      background: green;
      float: right;
    }

    #main {
      margin: 0 100px;
      background: blue;
    }

### flex

    <div id="container">
      // 调整order
      <div id="main">main</div>
      <div id="left">left</div>
      <div id="right">right</div>
    </div>

### BFC
BFC区域不与float区域重合

    <div class="container">
      <div class="left">left</div>
      <div class="right">right</div>
      <div class="main">main</div>
    </div>

    .left {
      float: left;
      background: red;
      width: 100px;
    }

    .right {
      float: right;
      width: 100px;
      background: blue
    }

    .main {
      background: yellow;
      overflow: hidden;
    }

### 双飞翼布局
使用负margin可以让主体先加载

    <div class="container">
      <div class="content">
        <div class="main">main</div>
      </div>      
      <div class="left">left</div>
      <div class="right">right</div>
    </div>

    .content {
      float: left;
      background: red;
      width: 100%
    }
    .right {
      float: right;
      width: 100px;
      background: blue;
      margin-left: -100px;
    }
    .main {
      margin-left: 100px;
      margin-right: 100px;
    }
    .left {
      float: left;
      width: 100px;
      background: yellow;
      margin-left: -100%;
    }

### 圣杯布局

    <div class="container">
      <div class="main">main</div>  
      <div class="left">left</div>
      <div class="right">right</div>
    </div>

    .container {
      margin-left: 100px;
      margin-right: 100px;
    }
    .main {
      float: left;
      width: 100%;
      background: red;
    }

    .left {
      width: 100px;
      margin-left: -100%;
      position: relative;
      left: -100px;
      background: blue;
      float:left;
    }

    .right {
      width: 100px;
      float: left;
      margin-left: -100px;
      position: relative;
      right: -100px;
      background: yellow;
    }

### table布局

    <div class="container">
      <div class="left">left</div>  
      <div class="main">main</div>
      <div class="right">right</div>
    </div>

    .container {
      display: table;
      width: 100%;
    }

    .main, .left, .right {
      display: table-cell;
    }
    .left {
      width: 100px;
      background: red;
    }
    .right {
      width: 100px;
      background: blue;
    }

### 绝对定位布局

    <div class="container">
      <div class="main">main</div>  
      <div class="left">left</div>
      <div class="right">right</div>
    </div>

    .container {
      width: 100%;
      position: relative;
    }
    .left {
      position: absolute;
      left: 0;
      top: 0;
      width: 100px;
      background: red;
    }
    .right {
      position: absolute;
      right: 0;
      top: 0;
      background: blue;
      width: 100px;
    }
    .main {
      background: yellow;
      margin: 0 100px;
    }

## 两列布局

### calc
#### 双inline-block方案

    <div class="container">
      <div class="left">left</div>
      <div class="right">right</div>
    </div>

    .container {
      font-size: 0;
    }
    .left {
      display: inline-block;
      width: 100px;
      background: red;
      font-size: 14px;
    }
    .right {
      display: inline-block;
      width: calc(100% - 100px);
      background: blue;
      font-size: 14px;
    }

#### 双float

    <div class="container">
      <div class="left">left</div>
      <div class="right">right</div>
    </div>

    .left {
      float: left;
      background: red;
      width: 100px;
    }
    .right {
      float: left;
      background: blue;
      width: calc(100% - 100px);
    }

### float + margin-left(absolute margin-left)

    <div class="container">
      <div class="left">left</div>
      <div class="right">right</div>
    </div>

    .left {
      float: left;
      background: red;
      width: 100px;
    }
    .right {
      background: blue;
      margin-left: 100px;
    }

### float + BFC

### flex

## CSS优先级
 
!important > 行内样式 > id > class(伪类 属性) > 标签 > * > 继承 > 默认


### CSS画出各种图形

    <div id="container">
    </div>

    // css画出个圆形
    #container {
      width: 100px;
      height: 100px;
      background: blue;
      border-radius: 50%;
    }

    // css画一个半圆

    #container {
      width: 100px;
      height: 50px;
      border-radius: 100px 100px 0 0;
    }

    // 画一个四分之一圆
      #container {
        width: 100px;
        height: 100px;
        border-radius: 100px 0 0 0;
        background: red;
      }

    // 椭圆
    #container {
      width: 100px;
      height: 50px;
      background: blue;
      border-radius: 100px/50px;
    }

    // 画一个三角形
    #container {
      width: 0px;
      height: 0px;
      border-left: 50px solid transparent;
      border-right: 50px solid transparent;
      border-bottom: 100px solid black;
    }

    // 画一个左上三角
    #container {
      width: 0px;
      height: 0px;
      border-top: 100px solid red;
      border-right: 100px solid transparent; 
    }



### css 伪类选择器

  td:nth-child(2n+1) // 奇数行
  td:nth-child(2n) // 偶数行


### 移动端适配方案
https://juejin.cn/post/6847902224740253709
#### rem布局方案

1. 设置viewport 
<meta name="viewport" content="width=device-width; initial-scale=1; maximum-scale=1; minimum-scale=1; user-scalable=no;">

2. 调整跟字体
function setRemUnit () {
    var rem = document.documentElement.clientWidth / 10
    // 375/10 = 37.5  基准值  可以结合postcss-pxtorem来实现px到rem的转换
    docEl.style.fontSize = rem + 'px'
}
缺点
1. viewport对pc端无效
2. 改变fontSize的代码必须放到css样式之前
3. 不想适配 


#### 媒体查询

@ media all (min-width: 30em) and (max-width: 50em) { ... }

#### vw适配
vw是根据视口的长度和宽度进行适配  
1vw等于window.innerWidth的1%  如果设计稿是750 1vw相当于7.5px

结合rem和vw实现是适配
给根元素大小设置随着视口变化而变化的vw单位，这样就可以实现动态改变其大小。 在根元素设置vw单位
限制根元素字体大小的最大最小值，配合body加上最大宽度和最小宽度

// rem 单位换算：定为 75px 只是方便运算，750px-75px、640-64px、1080px-108px，如此类推
 $vm_fontsize: 75; // iPhone 6尺寸的根元素大小基准值
 @function rem($px) {
    @return ($px / $vm_fontsize ) * 1rem;
 }
 // 根元素大小使用 vw 单位
 $vm_design: 750;
 html {
    font-size: ($vm_fontsize / ($vm_design / 2)) * 100vw; //可以直接写20vw （1rem == 20vw）
    // 同时，通过Media Queries 限制根元素最大最小值
    @media screen and (max-width: 320px) {
        font-size: 64px;
    }
    @media screen and (min-width: 540px) {
        font-size: 108px;
    }
}
// body 也增加最大最小宽度限制，避免默认100%宽度的 block 元素跟随 body 而过大过小
body {
    max-width: 540px;
    min-width: 320px;
}

// 存在问题是视口过小的时候 字体也太小




