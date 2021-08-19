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

