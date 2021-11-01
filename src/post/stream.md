---
title: node中Stream流基础
date: "2018-02-04"
tags: Node
path: /node-stream
---
## 简介
node中的Stream模块在很多基础的模块都有使用下面就从官网的文档和源码上学习下Steam模块的基础知识
## 基础
1. node.js 中有四种形式的流 可读(Readable)  可写(Writable)  可读可写(Duplex)   转换流(Transform)
2. 流在内部维护了一个链表来完成缓存数据的读取,流继承了EventEmitter,通过事件的监听来完成数据的获取
3. 在进行流的初始化的时候通过设置highWaterMark来控制缓存区的大小 当读写速度出现差异，存储的数据到达highWaterMark的时候，就会出现背压。这样读写流就会停止读或者写入  

## 可写流 
可写流是可以写入数据的目的地的抽象 
### 事件
drain  stream.write(chunk) 会返回true false来通知当前流是否可写。当它返回false的时候  当前流再次可用的时候 会触发drain事件  
error  读写数据出现error的时候会触发这个事件 但是不会关掉流  
finish  在stream.end(chunk,encoding,callback)的时候在数据发送完毕后会触发finish事件，传入的callback作为监听函数  
### 方法
writable.cork()/writable.uncork() 
buffer缓存和清除缓存 调用的次数必须一致,在使用writable.uncork()的时候 推荐使用process.nextTick()  
writable.write(chunk,encoding,callback)  返回的true /false 通知当前是否可写
结合drain事件来完成持续的写入(即使return false 仍然能完成数据的写入造成内存的占用 给垃圾回收造成压力)  
writable.destory(error) 关掉这个流  
writable.end(chunk,encoding,callback) 通知不会在有其他的写入,callback会变成finish事件的回调函数    

## 可读流  

可读流是可以被消耗的数据源的抽象
可读流有两种状态: flowing paused 
  1. 在flowing状态下通过对data事件的监听获取数据。
  2. 在paused状态下通过对_read(size)方法的调用来完成数据的读取.
在node的lib/_stream_readable.js中,在构造函数中会通过传入的options来初始化流的状态  

      this.buffer = new BufferList(); //  链表 
      this.length = 0;  // 存储的长度
      this.pipes = null;  //  pipe 数组 目的地 (初始的时候是null) 
      this.pipesCount = 0; // pipe 长度
      this.flowing = null;  //  state  null true false (flowing paused) 
      this.ended = false;   
      this.endEmitted = false; // 是否发送end事件
      this.reading = false;   // 是否正在读取  
    
  在上面的代码中this.flowing就是控制stream的状态是否是flowing或者paused 通过pipe unpipe 或者data事件的监听能切换状态 (当this.flowing为false的时候通过data事件的监听不会造成this.flowing变成true 必须调用stream.resume()) 
  在实现可读流的时候,需要实现_read(size)方法触发底层数据的读取.可以使用size(size会根据背压动态变化)来完成读取的流量控制
  
### 事件  
data  当流准备发送数据的时候会触发data事件( 切换成flowing 或者read() 方法的调用)
end 当可读流的数据都被消费后会触发end事件 通知无数据可读取
readable  通知当前有数据可以读取或者流数据的结尾会触发 通过监听readable然后通过read事件来完成数据的读取  

### 方法  
readable.isPaused() 返回流当前的状态(对应上面的this.flowing)  
readable.pause() 切换this.flowing = false  
readable.pipe(dest)  
(1)可以一个src多个dest(对应上面代码的this.pipes)  
(2)返回dest支持链式调用  a.pipe(a).pipe(b)   
(3)背压的控制 通过在src上注册drain事件并且在write的时候根据dest的状态来写入完成背压的控制  

        src.on('data', ondata);
        function ondata(chunk) {
          increasedAwaitDrain = false;
          var ret = dest.write(chunk);
            if (false === ret && !increasedAwaitDrain) {
              // If the user unpiped during `dest.write()`, it is possible
              // to get stuck in a permanently paused state if that write
              // also returned false.
              // => Check whether `dest` is still a piping destination.
              if (((state.pipesCount === 1 && state.pipes === dest) ||
                   (state.pipesCount > 1 && state.pipes.indexOf(dest) !== -1)) &&
                  !cleanedUp) {
                debug('false write response, pause', src._readableState.awaitDrain);
                src._readableState.awaitDrain++;
                increasedAwaitDrain = true;
              }
              src.pause();
          }
        }

    
当src接受到drain事件后会触发drain事件的监听函数重新完成数据的写入  

    //  pipe  end flag
    function pipeOnDrain(src) {
      return function() {
        var state = src._readableState;
        debug('pipeOnDrain', state.awaitDrain);
        if (state.awaitDrain)
          state.awaitDrain--;
        if (state.awaitDrain === 0 && EE.listenerCount(src, 'data')) {
          state.flowing = true;
          flow(src);
        }
      };
    }

  
### 实现一个可读流  

    const { Readable } = require('stream');
    // Stream 实现
    class MyReadable extends Readable {
      constructor(dataSource, options) {
        super(options);
        this.dataSource = dataSource;
      }
      // 继承了 Readable 的类必须实现这个函数
      // 触发系统底层对流的读取
      _read() {
        const data = this.dataSource.makeData();
        this.push(data);
      }
    }
    // 模拟资源池
    const dataSource = {
      data: ['1','2','3','4','5','6','7','8'],
      // 每次读取时 pop 一个数据
      makeData() {
        if (!dataSource.data.length) return null;
        return dataSource.data.pop();
      }
    };
    const myReadable = new MyReadable(dataSource);
    myReadable.setEncoding('utf8');
    myReadable.on('data', (chunk) => {
      console.log(chunk);
    });

#### 从源码上理解上面的例子  
通过data事件的监听 

        Readable.prototype.on = function(ev, fn) {
            const res = Stream.prototype.on.call(this, ev, fn);
    
            if (ev === 'data') {
            if (this._readableState.flowing !== false)
              this.resume();
            } else if (ev === 'readable') {
            const state = this._readableState;
            if (!state.endEmitted && !state.readableListening) {
              state.readableListening = state.needReadable = true;
              state.emittedReadable = false;
              if (!state.reading) {
                process.nextTick(nReadingNextTick, this);
              } else if (state.length) {
                emitReadable(this, state);
              }
            }
          }
          return res;
        };

当注册data事件的时候,会调用this.resume() 最后调用flow(stream) 来完成数据的持续读取
  

        function flow(stream) {
          const state = stream._readableState;
          debug('flow', state.flowing);
          while (state.flowing && stream.read() !== null);
        }  
        
## 总结  
上面就简单的介绍了下node中stream模块的基础知识,通过对流模块的学习能更好的帮助我们理解node中数据的发送处理过程,也可以尝试着去阅读一些简单的模块(send)来加深对Stream的理解.

## 参考
[Node.js可读流和可写流](https://juejin.cn/post/6844903588649500679)