---
title: webpack资料总结 
date: 2021-4-1 11:30:00  
tags: webpack
categories: webpack
---

## webpack基础

* 模块打包 将不同模块的文件整合在一起,保证引用顺序正确
* 编译兼容 通过loader可以实现polyfill
* 能力扩展 通过plugin扩展模块打包和编译兼容的能力

## webpack打包流程  

* 初始化 webpack会从配置文件中读取配置参数，生成compiler对象(插件注册)
* 编译 从入口模块开始递归构建整个依赖关系图
* 解析 根据模块的依赖关系，解析模块的路径
* 生成chunk 将模块组合成一个或者多个chunk,每个chunk包含了一组模块的代码和模块之间的依赖关系
* 模块的转换与代码生成 对模块使用相应的加载器进行转换，将其转换成浏览器可以执行的代码
* 输出 将生成的chunk输出到指定路径，生成静态资源文件
* 完成构建

### compiler && compilation
compiler是一个全局单例,负责把控整个webpack打包的构建流程
compilation对象是每一次构建的上下文对象,包含当次构建的所有信息

### Loader
loader可以将不同类型的文件转换成JavaScript模块
webpack只能处理js模块代码,Loader可以将非js文件类型的文件转化成js进行后续的打包逻辑

#### Loader的执行顺序

Loader是通过数组进行配置的,loader-runner会从配置的末尾依次执行对应loader的处理逻辑(compose)
[a,b,c]
a pitch => b pitch => c pitch =>  c loader normal execution => b loader normal execution => a loader normal execution
[a,b,c] 如果b loader的pitch返回了结果
a pitch => b pitch => a loader normal execution

1. pitch能对loader进行顺序调整
2. loader协同工作
3. 请求重写 pitch可以返回新的请求，从而修改模块的请求
4. 支持异步 

#### Loader开发
* this.callback 一个可以同步或者异步调用的可以返回多个结果的函数

      this.callback(
        err: Error | null,
        content: string | Buffer,
        sourceMap?: SourceMap,
        meta?: any
      );

* this.async 告知loader-runner这个loader将会异步回调返回this.callback

##### 同步loader

    // content 内容
    module.exports = function(content, map, meta) {
      return someDealFunc(content) // 直接返回同步执行逻辑
    }
    module.exports = function(content, map, meta) {
      // 通过callback触发
      this.callback(null, someDealFunc(content), map, meta)
      return 
    }
##### 异步loader


    module.exports = function(content, map, meta) {
    // 告知loader-runner是一个异步loader
      var callback = this.async();
      someAsyncOperation(content, function(err, result) {
        if (err) return callback(err);
        callback(null, result, map, meta);
      });
    };

### Plugin
Plugin主要职责 基于webpack构建的hooks来增强构建能力
* compiler暴露的webpack整个生命周期相关的钩子
  * beforeRun 在开始构建任务之前触发
  * run 在开始构建任务时触发
  * beforeCompile 在开始编译之前触发
  * compile 在创建新的Compilation对象之前触发
  * make 在开始创建chunk之前出发
  * emit 输出文件前hook
  * afterEmit 在完成资源输出之后触发


#### 开发plugin
* 插件必须是一个函数或者一个包含apply方法的对象
* 传递给插件的compiler和compilation对象是同一个引用,修改对应的对象会对后面的插件有影响
* 异步事件需要插件调用回调函数通知webpack进入下一个流程

      // 同步钩子
      class MyPlugin {
        apply (compiler) {
          // 找到合适的事件钩子，实现自己的插件功能
          compiler.hooks.emit.tap('MyPlugin', compilation => {
              // compilation: 当前打包构建流程的上下文
              console.log(compilation);
              // do something...
          })
        }
      }
      // 异步钩子
      class MyPlugin {
        apply (compiler) {
          // 找到合适的事件钩子，实现自己的插件功能
          compiler.hooks.run.tapAsync('MyPlugin', (compilation, callback) => {
              // compilation: 当前打包构建流程的上下文
              console.log(compilation);
              // do something...
              callback()
          })
          compiler.hooks.run.tapPromise('MyPlugin', (compilation) => {
          // compilation: 当前打包构建流程的上下文
          return new Promise((resolve, reject) => {
            resolve(11)
          })
      })
        }
      }


## webpack性能优化

### 优化构建速度
* 减少文件的查找  
  * resolve.modules: [path.resolve(__dirname, 'node_modules')]
  * resolve.extensions: ['.js', '.jsx'] 会添加后缀进行查找匹配
  * module.noParse  noParse: /jquery|lodash/
  * 配置loader的时候 exclude include

* 编译速度
  * dllplugin 提前把dll打包好 (能否在开发阶段使用dll  在上线阶段使用splitChunk)
  * Happypack  thread-loader
  * parallelUglifyPlugin 开启多进程压缩文件

### 输出质量
  * splitchunkplugin 拆分公共模块
  * 区分环境 definePlugin  
    plugins:[
      new DefinePlugin({
          'process.env': {
              NODE_ENV: JSON.stringify('production')
          }
      })
    ]
  * url-loader 将小图直接base64到js或者css中
  * css-loader?minimize 开启cssnano压缩
  * 使用Tree Shaking  保留es6模块化语法
  * 使用CDN资源 
    * css mini-css-extract-plugin 配置cdn的前缀



## 相关文章
[webpack源码解读](https://juejin.cn/post/6844903987129352206)  
[dive into webpack](https://github.com/lihongxun945/diving-into-webpack) 这个不错
[当面试官问Webpack的时候他想知道什么](https://juejin.cn/post/6943468761575849992)
[三十分钟掌握Webpack性能优化](https://juejin.cn/post/6844903651291447309)

## 相关概念
parcel 内置插件 + 并行编译  小型项目,缺乏灵活性
rollup tree shaking 适合打包es6模块
webpack 大型项目

## webpack中chunk的概念


### sourceMap
//# sourceMappingURL=xxx.js.map
 浏览器会通过sourceURL获取映射文件,通过解析器解析后实现源码和混淆代码之间的映射.



    