---
title: 从http.createServer看node是如何提供网络请求服务的
date: "2018-03-22"
tags: Node
path: /node-basic
---
## 简介  
  在初学node的时候,都会在学习到下面的这个例子:  

    const http = require('http');
    const server = http.createServer(function(req,res) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('okay');
    });
    server.listen(8080,function() {
      console.log('server is on');
    });  

上面的例子就创建了一个最简单的web服务,当通过浏览器访问本地的8080端口的时候页面就会输出okay。下面主要从两个方面来理解node如何加载和运行这段代码来提供服务的。

## node代码结构(基于node V6.11.0)  
下面就是node的代码结构,在lib中主要是node提供的标准库(例如http等模块),在src模块主要是node的入口文件和node提供给lib的C++接口.在deps中主要包含了DNS解析,http解析,事件循环和跨平台的异步IO的实现等.
![node代码结构](./nodeStatic/nodeBasic/nodeSrc.png)  

## node如何加载我们的代码  
通过都是通过命令行 node server.js来启动一个简单的服务,下面来简单的看node如何加载和执行这个server.js文件  
在node的启动文件src/node_main.cc中有如下这段代码,它调用了node.cc的node的Start方法
![main](./nodeStatic/nodeBasic/nodeMain.png)  
在Start方法先对平台进行了初始化操作 主要关注下面的代码  
![init](./nodeStatic/nodeBasic/init.png)  
这创建了一个node的实例并且传递了一系列的参数(v8_thread_pool_size uv_default_loop 后续会对这些参数进行讲解) 最后调用StartNodeInstance开启了node的实例,然后顺着这个方法往下走发现node继续这行了LoadEnvironment()和下面这段代码 
![exec](./nodeStatic/nodeBasic/execNode.png)  
这段代码拿到lib/internal/bootstrap_node.js文件,将它编译解析并且转换成C++的函数最后执行。在lib/internal/bootstrap_node.js中其实就是一个匿名函数  
![runCode](./nodeStatic/nodeBasic/runOurJs.png)  
这里面先做一些挂载的操作(例如给js调用C++代码的挂载), 然后从命令行中获取到文件的名字并且读取文件进行warp,这个函数会被上面提到的位置去执行,这样node就加载并且执行了传入的server.js文件。

## http.createServer()如何对网络请求提供服务  
通过对上面代码的理解,node对网络请求提供服务其实是通过lib下的基础模块调用C++模块的代码来实现的,下面跟着http.createServer()来梳理下这个流程
http.createServer(requestListener),它通过调用_http_server.js下的Server(requestListener)方法创建了一个net.Server(继承EventEmitter)并且将传入的构造函数绑定到request事件同时绑定了connection事件  
上面的代码部分主要完成了一个server的创建.最后调用listen()方法的时候才能监听器对应的端口来对外提供服务.server.listen([port],[host],[backlog],[callback])其实调用的是net.Server的listen方法.  
![listen](./nodeStatic/nodeBasic/listen.png) 
在net.Server的方法中主要对参数进行了判断,例如是否存在IP,port以及是否传出handle,通常的调用方法都是server.listen(port,callback) 这样会在特定的端口监听来自IPV4或者IPV6的网络请求,在listening事件触发的时候响应callback.下面在继续跟进listen方法.
![listen2](./nodeStatic/nodeBasic/listen2.png)  
继续跟进_listen2方法
![handle](./nodeStatic/nodeBasic/handle.png)
在这个方法中主要创建了一个server的handle并且绑定在之前传入的port并且在这个handle上添加onconnection的监听函数并且在nextTick的时候触发listening事件.createServerHandle其实做的是调用的C++层的接口,创建了一个TCP实例,并且将它监听到IPV4或者IPV6端口。node处理网络请求实际是通过触发这个handle的connection事件实现的
![connection](./nodeStatic/nodeBasic/connection.png) 
在上面的代码中,底层的C++代码会在connetion的时候传入clientHandle,然后node会创建一个Socket实例并且在通过connection事件将这个Socket实例传入对应的回调函数。这样就用回到了lib/_http_server.js中对connection的监听函数中  
![request](./nodeStatic/nodeBasic/request.png) 
这个方法主要对之前创建的Socket进行一些解析处理和方法绑定最后将生成的req,res通过request事件传入到回调函数中.这样就回到了http.createServer(requsestListener)中来完成特定业务的处理  

## 总结
  从以上的两部分，主要从两方面来整理了下node启动和执行服务代码,node如何处理网络请求，但是node中还有很多有意思的东西还没有说清和弄明白.例如backlog 事件循环 v8_thread_pool_size(node的线程池)等等.

