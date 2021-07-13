---
title: koa
date: 2017 - 3 - 24
tags: JavaScript
path: /koa
---
## 简介
koa利用生成器来解决回调函数的嵌套问题，实现的十分巧妙，下面跟着官网的例子逐步学习下koa的实现原理  
官网 [koa](http://koa.bootcss.com/)  
## 使用
    
    var koa = require('koa');
    var app = koa();
    app.use(function *(){
        this.body = 'hello world';
    });
    app.listen(8080);  
这个例子很像在Node中构建HTTP服务器的例子  

    var http = require('http');
    http.createServer(function(req,res){
        res.writeHead(200,{'Content-Type':'text/plain'});
        res.end('hello world');  
    }).listen(8080);  
通过app.use()设定中间件 app.listen()监听特定的端口这样整个web服务器就启动了 那我们的关注点就到了这句话 var app = koa();  
koa的源码lib下有四个文件 application.js context.js request.js response.js  在koa的package.json中main属性的值指向的是lib/application.js 也就是整个web服务器的生成过程都在这个js中 下面我们逐步的解读下application.js的部分源码  
    
    module.exports = Application;
    function Application() {
        if (!(this instanceof Application)) return new Application;//确保不通过new调用构造函数的时候返回正确的值
        this.env = process.env.NODE_ENV || 'development';
        this.subdomainOffset = 2;
        this.middleware = [];//保存中间件的数组
        this.proxy = false;
        this.context = Object.create(context);
        this.request = Object.create(request);
        this.response = Object.create(response);//通过指定的原型创建对象
     }  
通过上面这段代码，也就是在调用这句话的时候 var app = koa()实际上就是生成了一个Application实例 在实例上有一个数组用于保存中间件 三个属性 context request response  

    var app = Application.prototype;
	app.listen = function(){
        debug('listen');
        var server = http.createServer(this.callback());//this.callback()就是请求来的处理函数
        return server.listen.apply(server, arguments);  
        //这里上文中Node构建HTTP服务的例子 似曾相识 
    };  
在http.createServer(this.callback())中this.callback()就是请求来的处理函数也就是app.callback()这个函数 正是这个函数实现了koa的中间件机制 
## 中间件  
在介绍中间件的原理之前 先上一个例子  

    var koa = require('koa');
    var app = koa();
    app.use(function *(next){
        console.log(1);
        yield next;
        console.log(2);
    });
    app.use(function *(next){
        console.log(3);
        yield next;
        console.log(4);
    });
    app.use(function *(){
        this.body = 'hello world';
    })；
    app.listen(3000);  

当对服务器发送一个请求的时候  会发现服务器的控制台log出的顺序是 1 3 4 2 下面我们来看一下这个神秘的app.callback()函数到底做了什么  

    app.use = function(fn){
        if (!this.experimental) {
          // es7 async functions are not allowed,
          // so we have to make sure that `fn` is a generator function
          assert(fn && 'GeneratorFunction' == fn.constructor.name, 'app.use() requires a generator function');
        }
        debug('use %s', fn._name || fn.name || '-');
        this.middleware.push(fn);//将每次调用的生成器函数push到中间件数组
        return this;//可以实现链式调用
    }; 
app.use()就是收集所有设定的中间件，然后存储到数组中 

	app.callback = function(){
	  var fn = this.experimental
	    ? compose_es7(this.middleware)
	    : co.wrap(compose(this.middleware));
	  var self = this;  
	  return function handleRequest(req, res){
	    res.statusCode = 404;
	    var ctx = self.createContext(req, res);
	    onFinished(res, ctx.onerror);
	    fn.call(ctx).then(function handleResponse() {
	      respond.call(ctx);
	    }).catch(ctx.onerror);
	  }
	};  
app.callback()中的返回值 function handleRequest(req,res){}就是请求来的时候的处理函数 在这个处理函数中调用fn进行事件的处理 fn是什么呢？  我们只需要搞明白这句话 co.wrap(compose(this.middleware))  

第一步 compose对生成器函数数组进行了处理  

    function compose(middleware){
      return function *(next){
        if (!next) next = noop();
        var i = middleware.length;
        while (i--) {
          next = middleware[i].call(this, next);//不断的获取后一个生成器对象 作为参数传入当前的生成器函数并且执行获得生成器对象
        }
        return yield *next;
      }
    }
    function *noop(){}  
其实理解compose的作用要理解好通过app.use(function *(next) {}) 传递的生成器函数传递的next  整个compose的作用就是生成器函数的执行后进行从头到尾的串联 然后返回一个生成器  
接下来就需要理解co的执行流程了  
## co源码解读  
co是通过生成器避免了多个异步操作的回调嵌套  

    function *test() {
      var a = yield readFile1();
	  var b = yield readFile2();
    }
简单理解co的作用就是首先获取之前执行的结果 保存下来当下次调用generator.next()的时候作为参数传入，这样就实现了异步操作的同步执行

    function co(gen) {
      var ctx = this;
      var args = slice.call(arguments, 1)
      return new Promise(function(resolve, reject) {
        if (typeof gen === 'function') gen = gen.apply(ctx, args);
        if (!gen || typeof gen.next !== 'function') return resolve(gen);
        onFulfilled();
    
	    function onFulfilled(res) {
	      var ret;
	      try {
	        ret = gen.next(res);
	      } catch (e) {
	        return reject(e);
	      }
	      next(ret);
		}
	    function onRejected(err) {
	      var ret;
	      try {
	        ret = gen.throw(err);
	      } catch (e) {
	        return reject(e);
	      }
	      next(ret);
	    }
	    function next(ret) {  //这里使用promise进行了封装 当之前的异步调用完成后 就会在调用onFullfilled将这次执行结果的返回值传入
	      if (ret.done) return resolve(ret.value);
	      var value = toPromise.call(ctx, ret.value);
	      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
	      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
	        + 'but the following object was passed: "' + String(ret.value) + '"'));
	    }
	  });
    }
通过上面的代码阶段我们就学习了koa的中间件机制 其实ES7的异步函数就是实现的co所做的事
