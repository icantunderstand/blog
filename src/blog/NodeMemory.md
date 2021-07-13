---
title: 聊聊Node的内存管理
date: 2021 - 7 - 1  
tags: Node
path: /node-memory
---

应用程序在运行时需要占用系统的存储空间来实现加载代码运行、存储运行时数据等功能。理解内存空间的管理策略能让我们更好的理解代码在系统中运行的机制。本文从代码运行时存储开始逐步介绍V8的垃圾回收机制。

## 运行时存储
### 堆存储
* 主要存储全局变量,引用类型
* 动态分配，可分配动态空间，有垃圾回收机制参与空间管理
* 总存储空间大(通常分配给应用的空间有限制)，查找效率低
* 堆空间被应用的线程间共享

### 栈存储
* 主要存储局部变量(基础数据类型)、指针、函数执行片段(function frames)
* 由系统分配，通常存储限定大小的数据，栈片段弹出后空间释放
* 栈结构后进先出(LIFO),访问效率高
* 多线程应用每个线程都有一个栈存储空间

## 内存管理
通常说的内存管理都是指对堆内存空间的管理，以下介绍V8中的内存管理方式。  
在V8中运行的程序会被分配如下的内存空间(Resident Set)
![V8内存结构](./NodeMemory/V8.png)  

### V8堆内存结构

* (New Space)新生区
新分配对象或者存活期较短的对象都会存储到新生区
* (Old Space)老生区
新生区经过垃圾回收会晋升到老生区
  * Old pointer space 保存有指向其他对象的对象
  * Old data space 存放只包含原始数据对象(无指向其他对象指针)、字符串、封箱的数字以及未封箱的双精度数字数组
* (Large object space)大对象区
存储超过超过1MB大小的对象，垃圾回收不会处理大对象区。
* (Code-space)代码区
存储代码，唯一有运行权限的存储空间
* Cell space, property cell space, and map space
这些空间保存大小一致的对象

### V8垃圾回收
V8的垃圾回收机制只作用于内存空间的新生区和老生区，由于在新生区和老生区存储数据的类型(大小，存活时间)等不同，垃圾回收在新生区和老生区使用不同的策略实现。
### 新生区垃圾回收
新生使用Scavenger算法
* 新生区内存一分为二,每部分空间称为semispace. 在运行时只有一个semispace处于使用中,使用状态的semispace称为From空间,空闲状态的semispace称为To空间
* 在分配对象的时候会先从From空间分配对象，当From空间无法存储没有足够的空间存储新对象的时候触发垃圾回收
* 在进行垃圾回收的时候会检查From空间的存活对象将存活对象复制到To空间,完成复制后From空间和To空间会进行角色互换

#### 新生区晋升到老生区
在新生区的垃圾回收中满足以下两个条件，可以移动到老生区存储。
* 当对象从From空间复制到To空间的时候,如果它经历过一次Scavenge回收会把该对象从From空间复制到老生区
* 当对象从From空间复制到To空间的时候如果To空间使用超过25%则这个对象直接复制到老生区

### 老生区垃圾回收
老生区由于存活占比较大,使用Scavenge算法并不科学。在老生区使用Mark-Sweep-Compact来实现垃圾回收。
* Mark
只标记存活的对象，如果循环引用但是无法被标也会被清除(解决循环引用问题)
  * 垃圾回收器会在内部创建一个根列表(全局对象,本地函数的局部变量和参数,当前嵌套调用链上的其他函数的变量和参数),用于从根节点出发去寻找可以被访问的变量
  * 垃圾回收器从所有根节点出发遍历其可以访问到的子节点标记为活动节点,不能到达的节点为非活动节点
* Sweep 释放非活动节点空间
* Compact 整理内存空间，将存活对象占用的空间移动到一起，减少内存间隙  

由于垃圾回收会暂停应用的执行，V8的垃圾回收机制又通过增量回收(incremental GC)、并行标记(Concurrent marking)、并行清除整理(Concurrent sweeping/compacting)、(懒整理)Lazy sweeping等手段结合优化回收效率。  

## 参考
[Demystifying memory management in modern programming languages](https://deepu.tech/memory-management-in-programming/)  
[Visualizing memory management in V8 Engine (JavaScript, NodeJS, Deno, WebAssembly)](https://deepu.tech/memory-management-in-v8/)  
[一文搞懂V8引擎的垃圾回收](https://juejin.cn/post/6844904016325902344)
