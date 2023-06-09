---
title: CSS基础总结
date: "2018-10-18"  
tags: CSS
path: /css-basic
---
## 简介
  作为web开发者,CSS是必备的一项基础技能,下面将从CSS的盒模型开始,来展开了解CSS的相关基础知识.
## 盒模型
  当对一个元素进行布局的时候,渲染引擎会根据CSS-Box模型(box-sizing)将对应元素表示为一个矩形盒子.理解好盒模型能让我们更好的理解生成元素的大小和布局.生成布局的盒子由以下的属性决定
  ![盒模型](./javascriptbasestatic/css/box.png) 
  box-sizing是设置盒模型的属性，分为IE盒模型(border-box)和W3C标准盒模型(content-box).
   1. W3C标准盒模型: 属性width和height只包含content, 不包含 padding border 也就是标准盒模型的实际宽度 = border-left + padding-left + content(width) + padding-right + border-right 在实际布局的时候还需要将margin考虑在内
   2. IE盒模型:  属性width 包含content, padding, border. IE盒模型的实际宽度 = content(width)   

## 布局
### Box
Box是CSS布局的基本单位.元素的类型和display共同决定着这个Box类型.不同的Box类型会参与到不同的格式化上下文中.
1. block-level: display属性为 block, table, list-item.
2. inline-level: display属性为 inline-block, inline-table,inline

### 布局模式
在进行布局的时候，浏览器采用一种dirty位系统，如果某个呈现器（需要渲染布局的元素）发生了更改，将其自身或者子代标记为dirty，则需要布局，在进行布局的时候，元素会确认自己宽度和高度.
  1. 父呈现器确认自己的宽度
  2. 父呈现器依次处理子呈现器  
      1. 放置子呈现器（设置x y 坐标)  
      2.  如果有必要，调用子呈现器的布局  
  3. 父呈现器根据子呈现器的累加高度以及边距和补白的高度来设置自身高度，此值也可供父呈现器的父呈现器使用
  4. 将dirty设置为false 

### 布局上下文
布局上下文决定在渲染容器中各种盒子的布局方式,主要有以下几种(本文简单介绍BFC和FFC):
1. 块级格式化上下文(BFC) 
2. 行级格式化上下文(IFC)
3. 网格布局格式化上下文(GFC)
4. 自适应格式化上下文(flexbox)

#### BFC(Block formatting context)
  通过为元素进行一些属性的设置,可以生成块级格式化上下文,其中的块级元素会按照BFC的规则进行布局
##### 生成规则
1. 根元素，即HTML元素
2. float的值不为none
3. overflow的值不为visible
4. display的值为inline-block、table-cell、table-caption
5. position的值为absolute或fixed

##### 布局规则
1. 内部的Box会在垂直方向，一个接一个地放置。
2. Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠
3. 每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
4. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。不与float box重叠.
5. 计算BFC的高度时，浮动元素也参与计算 


##### 作用
关于BFC的作用和例子可以阅读下这边文章,博主写的很详细.[关于CSS-BFC深入理解](https://juejin.im/post/5909db2fda2f60005d2093db) 
 
#### FFC(flexbox)
FFC就是CSS3所说的弹性盒子布局. 详细的使用指南可以参考这篇[A Complte Guide to Flexbox ](https://css-tricks.com/snippets/a-guide-to-flexbox/)

## 定位
  Box一共有以下三种定位方式:
  1. Normal flow: 包括块级的格式上下文, 行级的格式化上下文, 相对定位的(position relative)的块级和inline-block
  2. Float: 这种情况脱离了文档流,但是会影响之后元素的content(环绕)
  3. 绝对定位(position absolute): 脱离文档流, 不会影响之后元素的位置和内容
  
### position
position相关属性及含义

| 值 | 含义 |  
| - | :-: |  
| absolute | 绝对定位,相对于static以外的第一个父元素进行定位  | 
| fixed | 绝对定位,相对于浏览器窗口进行定位 |  
| relative | 相对定位,相对与正常位置进行定位 |  
| static | 默认值,没有定位. |  
| sticky | 粘性布局 可以认为是固定定位和相对定位的结合.元素在跨越特定阈值前为相对定位,之后为固定定位 |  

### float
浮动是一种脱离文档流，对之后或者之前的盒子中的content flow产生影响的一个属性(区别于定位  例如position absolute 也是脱离文档流 但是它不会对之后之前的盒子产生影响),浮动元素会产生一个块级框,即使它本身是一个行内元素  

#### 浮动规则
  1. 浮动元素的左右外边界不能超出其包含块的左右内边界
  2. 浮动元素的左(或右)外边界必须是源文档中之前出现的左浮动的(或右浮动)元素的右（或左)边界，除非后出现的浮动元素的顶端在先出现浮动元素的底端下面（防止浮动元素之间的覆盖）
  3. 左浮动元素的右外边界不会在其右边右浮动元素的左外边界的右边 右浮动元素的左外边界不会在其左边左浮动元素的右外边界的左边
  4. 一个浮动元素的顶端不能比其父元素的内顶端更高   浮动元素的顶端不能比之前所有的浮动元素的顶端或块级元素更高
  ![float示例1](./javascriptbasestatic/css/float1.png)  
  这里例子中三个元素均为浮动元素,包含块的宽度固定,由于规则2 导致第二个浮动元素bbb移动到aaa下面.由于4的限制，浮动元素ccc的顶端是跟bbb一致的，不能超过bbb或者跟aaa平齐.  
  5. 如果源文档中一个浮动元素之前出现了另一个元素 浮动元素的顶端不能比包含该元素所生成框的任何行框的顶端更高  
  6. 左浮动元素必须向左尽可能的远 右浮动元素必须向右尽可能的远 位置越高 就会向左或者向右尽可能的远  
  7. 浮动元素与正常内容流重叠的情况:
      1. 行内框与一个浮动元素重叠的时候，其边框 背景 和内容都在该浮动元素之上显示.
      2. 块框与一个浮动元素重叠时候 其边框和背景在该浮动之下显示 内容在浮动元素之上显示  

## 居中
可以阅读下自己之前翻译的一篇文章[CSS居中完全指南翻译](https://www.cnblogs.com/tiantianwaigong/p/5291370.html)  

## 参考链接
[浏览器的工作原理:新式网络浏览器幕后揭幕](https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork/#4_1)
[css脱离文档流是什么意思](https://www.zhihu.com/question/24529373/answer/29135021)
CSS权威指南
[Visual formatting model](https://www.w3.org/TR/CSS21/visuren.html)





 

