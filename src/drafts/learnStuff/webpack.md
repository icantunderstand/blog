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

* 初始化参数 webpack会从配置文件中读取配置参数
* 开始编译 根据参数初始化Compiler对象，加载插件，执行Compiler的run方法开始编译
* 解析与编译 根据入口配置生成模块的依赖关系，解析模块的路径，编译模块内容
* 生成chunk 将模块组合成一个或者多个chunk,每个chunk包含了一组模块的代码和模块之间的依赖关系
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
* 异步事件需要插件调用回调函数通知webpack进入下一个流程(会阻塞)

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
  * HardSourceWebpackPlugin 在不同的构建之间共享模块缓存
  * thread-loader
  * parallelUglifyPlugin 开启多进程压缩文件

### 输出质量
  * split-chunk-plugin 拆分公共模块
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

## webpack的热更新原理
在浏览器和与Webpack Dev Server之间维护了一个Websocket，在监听模式下,资源变化Dev Server会向浏览器推送更新(包括构建的hash值)，当浏览器对比有差异的时候，会通过ajax获取更改内容，然后通过jsonp的方式完成更新

##  文件指纹
* Hash 整个项目的构建相关， 只要项目文件有修改整个项目的hash值就会有变化
* ChunkHash 与chunk有关 不同entry生成不同的chunk
* ContentHash 根据文件内容确定


## webpack的path

* output.publicPath
用户配置打包结果资源引用的位置

* output.path
影响生成文件存放的目录和引用 比如path设置path.resolve(__dirname, 'dist') 在html中引用的时候要使用'dist/bundle.js'

* devServer publicPath
在开发模式下，通过webpack-dev-server启动一个本地服务器，在内存中动态打包文件，用于控制开发模式下的资源访问，默认‘/’



## 打包工具对比
parcel 内置插件 + 并行编译  小型项目,缺乏灵活性
rollup tree shaking 适合打包es6模块
webpack 大型项目

## webpack中chunk的概念
chunk是由多个模块组成的代码块，比如Entry chunk,Split chunk拆分出的代码等

## sourceMap
//# sourceMappingURL=xxx.js.map
 浏览器会通过sourceURL获取映射文件,通过解析器解析后实现源码和混淆代码之间的映射.

线上环境会通过做域名的限制来避免外网访问

## webpack tree shaking的原理

Tree Shaking指在打包过程中通过静态分析的方式识别和删除没有使用过的代码，以减少最终文件的打包体积

* 识别未使用的代码  webpack会遍历整个模块依赖图，标记模块的导出和引用，并将这些信息保存到内存中
* 标记未使用的代码  通过静态分析的方式确定哪些代码没有被引用，对于没有使用的代码webpack会标记为'未使用'
* 删除未使用的代码  在打包阶段 webpack会根据标记阶段的结果，将标记为'未使用'的代码从打包的结果中删除


## webpackBootstrap 启动文件的格式


/******/ (() => { // webpackBootstrap
          // 模块的定义逻辑
/******/   var __webpack_modules__ = ({
/******/     "./src/moduleA.js":
/******/       ((__unused_webpack_module, exports) => {
/******/         exports.foo = function() {
/******/           return 'Hello from moduleA';
/******/         };
/******/       })
/******/   });
/******/
/******/   var __webpack_module_cache__ = {};
           // 指定模块加载逻辑
/******/   function __webpack_require__(moduleId) {
/******/     // Check if module is in cache
/******/     if(__webpack_module_cache__[moduleId]) {
/******/       return __webpack_module_cache__[moduleId].exports;
/******/     }
/******/     // Create a new module (and put it into the cache)
/******/     var module = __webpack_module_cache__[moduleId] = {
/******/       exports: {}
/******/     };
/******/     // Execute the module function
/******/     __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/     // Return the exports of the module
/******/     return module.exports;
/******/   }
/******/   // Load entry module and return exports
           // 模块启动
/******/   var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/   // ...
/******/ })()



## 相关文章
[webpack源码解读](https://juejin.cn/post/6844903987129352206)  
[dive into webpack](https://github.com/lihongxun945/diving-into-webpack)  
[当面试官问Webpack的时候他想知道什么](https://juejin.cn/post/6943468761575849992)  
[三十分钟掌握Webpack性能优化](https://juejin.cn/post/6844903651291447309)  
[吐血整理」再来一打Webpack面试题](https://juejin.cn/post/6844904094281236487)




    