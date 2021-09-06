---
title: 函数式编程学习
date: 2021-8-18  
tags: JavaScript
path: 
---

## 入参处理

    // 多对一
    function unary(fn) {
      return function OnlyOneArg(arg) {
        return fn(arg)
      }
    }
    function identity(v) {
      return v
    }
    // apply 参数扩展
    function spreadArgs(fn) {
      return function spreadFn(argsArr) {
        return fn(...argsArr)
      }
    }
    // unapply 参数收集
    function gatherArgs(fn) {
      return function gatheredFn(...argsArr){
          return fn( argsArr );
      };
    }  
    // partial  partialRight
    function partial(fn, ...presetArgs) {
      return function partialApplied(...laterArgs) {
        return fn(...presetArgs, ...laterArgs)
      }
    }
    // 柯里化 实现将一个高阶函数转换为链式的一元函数 每次调用可以接收多个参数
    function curry(fn, arity = fn.length) {
      return (function nextCurried(prevArgs) {
        return function curried(...nextArg) {
          const args = [...prevArgs, ...nextArg]
          if(args.length >= arity) {
            return fn(...args)
          } else {
            return nextCurried(args)
          }
        }
      })([])
    }

## 函数组合
  性能  函数执行的性能  每次都需要做的操作 减少
  我们不是为了隐藏细节而抽象;我们正在分离细节以提高对其他的注意 管理副作用
  compose
  pipe
  function pipe(...fns) {
      return function piped(result) {
        const list = [...fns]
        while(list.length > 0) {
          result = list.shift()(result)
        }
        return result
      }
    }

    function getData() {
      return [1,2,3,4,5];
    }

    // 命令式
    var tmp = getData();
    var a = tmp[0];
    var b = tmp[3];

    // 声明式 从how到what
    var [ a ,,, b ] = getData();
    // 纯函数 之前的确在代码里面做了好多不纯的东西
    值不变性意味着当我们需要更改程序中的状态时，我们必须创建并跟踪一个新值，而不是更改一个现有值
    从函数式的角度去思考编程的方式 数据流转 语义
    性能(纯不纯 是考量)
    如果真有这种东西，同构JS会是什么？它可能是一组JS代码被转换成另一组JS代码，而且（重要的是）如果有需要，可以将后者转换回前者

    尾调用优化  PTC
    持续传递式  CPS 
    
    通过使代码更可靠和更可预测来使代码更易于阅读