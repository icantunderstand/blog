---
title: React Native系统学习
date: 2020-4-16 09:00:00
tags: 跨端开发
categories: 
---

## react native新架构


## react native启动流程
1. 加载js bundle 代码
2. 初始化Native Modules、JSCExecutor  
3. 创建Module配置表
4. 注入Module信息到JSCExector
5. 执行JS Bundle代码

## React Native新增一个原生组件的方式
模块需要实现RctBridgeModule 插入RCT_EXPORT_MODULE宏(收集暴露给js的类) 
* RCT_EXPORT_METHOD暴露方法
* RCT_EXPORT_VIEW_PROPERTY暴露属性

## React Native渲染过程 


## React Native通信过程

// 准备工作

1. 收集暴露给js的module(native module 注册表)
2. 在js context中设置nativeModuleProxy和nativeFlushQueueImmediate
3. 初始化相关的类  NativeToJsBridge JsToNativeBridge以及JSCExecutor等

// js调用native 
1. 通过NativeModules(nativeModuleProxy)调用对应的nativeModule  ModuleRegistry::getConfig->RCTNativeModule::getMethods->RCTModuleData.methods
2. 将js调用native的调用信息入队 enqueueNativeCall(moduleId, methodId来完成回调的映射) 最后通过nativeFlushQueueImmediate刷新调用队列执行native方法

// native调用js
1. 通过JSCExecutor callFunction 启动native到js的调用(moduleId)
2. 根据moduleId从js注册的方法表中找到对应的方法执行

双方负责通信  Native的JSCExecutor和js的MessageQueue


## 拆包
* 解析（Resolution）构建依赖树
* 转义（Transformation）语法转换
* 序列化（Serialization）打包 将模块合并到一个文件中输出
    1. createModuleIdFactory(path)  根据绝对路径path返回模块唯一id 这里需要调整 打标 标记出common和business
    2. processModuleFilter(module) 根据打标将公共模块拆分，只打business包






