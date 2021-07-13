---
title: redux学习
date: 2018 - 12 - 02
tags: React
path: /redux
---

## 简介
本文主要从redux的设计哲学开始逐步的介绍redux的使用并且深入到源码中对reudx进行系统的学习
## redux的设计哲学
### 单一数据源  
redux是应用状态管理的容器,提供单一的数据源来维护应用的状态.
### 状态是只读的  
redux通过对应用的状态的变更的方式进行了一定的约定,应用的状态只能通过action来单向的更改  
### 通过纯函数接受action来改变应用的状态
纯函数使得应用的状态变化是可以预测的,可以更加方便开发者调试(时间旅行)  
## 为什么使用redux
  1. redux提供的状态管理解决了组件间状态共享的问题并且一定程度的解耦了组件之间的关联.
  2. 单向数据流动对开发者来说应用的状态变的可控.  
  
## redux简单使用  

    import { createStore } from 'redux';
    const action_type = 'test';
    const init = {
      count : 1,
    }
    const reducer = (state = init, action) => {
      switch(action.type) {
        case action_type: {
          return { count: state.count + 1  }; 
        }
        default: {
          return state;
        }
      }
    }
    const store = createStore(reducer);
    store.subscribe(() => {
      console.log(store.getState()); // { count: 2 }
    })
    store.dispatch({
      type: action_type,
    })
* redux通过createStore(reducer, preloadState, storeEnhancer)函数来生成状态管理的store.  
* store提供getState()来获取当前的状态  
* dispath(action)更新应用的状态  
* subscribe(listener)来订阅状态变更时触发的事件.
通过上面的分析可以看出redux实现了一套发布订阅的机制来实现状态的变更和通知,下面将深入redux的源码来了解redux的具体实现
## redux源码学习
以下源码部分基于redux@4.0.1,为了整体介绍redux的整体流程,只保留了关键的部分并且进行了一部分修改.
### createStore
createStore(reducer, preloadedState, enhancer)接受reducer,状态初始值,store增加函数来生成应用的store

    export default function createStore(reducer,preloadedState, enhancer) { 
      let currentReducer = reducer;
      let currentState = preloadedState;
      let currentListeners = [];
      let nextListeners = currentListeners;
      // 如果存在enhancer函数,通过enhancer函数创建store
      if (typeof enhancer !== 'undefined') {
        if (typeof enhancer !== 'function') {
          throw new Error('Expected the enhancer to be a function.')
        }
        return enhancer(createStore)(reducer, preloadedState)
      }

      // 获取当前应用的状态
      function getState() {
        return currentState;
      }
      
      // 订阅当状态更新的监听函数.
      // 返回取消当前监听函数的方法,用于取消订阅对应监听函数
      function subscribe(listener) {
        nextListeners.push(listener);
        return () {
          const index = nextListeners.indexOf(listener);
          nextListeners.splice(index, 1);
        }
      }

      // 执行action的变更并且执行监听函数
      function dispatch(action) {
        currentState = currentReducer(currenState, action);
        const listeners = (currentListeners = nextListeners)
        for (let i = 0; i < listeners.length; i++) {
          const listener = listeners[i]
          listener();
        }
        return action;
      }

      return {
        getState,
        cubscribe,
        dispatch,
      }
    }

### combineReducer
combineReucer(reducer)可以将多个reducer函数组合起来,接受action并改变状态.combineReducer解决了将所有的更新逻辑写到一个文件的问题,通过reducer的组合应用也更加灵活

    export default function combineReducers(reducers) {
      const reducerKeys = Object.keys(reducers);
      const finalReducers = {};
      // 生成finalReducers
      for (let i = 0; i < reducerKeys.length; i++) {
        const key = reducerKeys[i]
        if (typeof reducers[key] === 'function') {
          finalReducers[key] = reducers[key]
        }
      }
      const finalReducerKeys = Object.keys(finalReducers);
      //  返回的函数是实际调用creaStore()的第一个入参,这样就能接受action来改变应用的状态了
      return function combination(state = {}, action) {

        let hasChanged = false;
        const nextState = {};
        // 对action执行所有的传入的reducer函数
        for (let i = 0; i < finalReducerKeys.length; i++) {
          const key = finalReducerKeys[i]
          const reducer = finalReducers[key]
          const previousStateForKey = state[key]  // 对应reducer之前的state
          const nextStateForKey = reducer(previousStateForKey, action) // 对应reducer接受action之后的状态
          nextState[key] = nextStateForKey  // 将处理过后的值存储
          hasChanged = hasChanged || nextStateForKey !== previousStateForKey
        }
        // 如果改变返回nextState, 否则返回之前的状态
        return hasChanged ? nextState : state
      }
    }

### applyMiddleware
applyMiddleware是redux提供对外部进行扩展的途径,通常情况下dispacth只能接受一个对象来对状态进行修改,通过添加不同的中间件,对dispatch进行增强,可以使它接受更多的类型(function, promise)和实现更多的功能, 下面先从一个使用中间件的实例来了解appleMiddleware到底做了什么.

    function thunkMiddleware({ dispatch, getState }) {
      return  next => action => {
        if (typeof action === 'function') {
          return action(dispatch, getState);
        }

        return next(action);
      };
    }
    const store = createStore(reducer, { count: 1 }, applyMiddleware(thunkMiddleware))
    store.subscribe(() => {
      console.log(store.getState());
    })
    store.dispatch(() => {
      console.log(1);
      return { type: action_type };
    });
通过上面的例子,dispatch就能接受函数类型并且执行对应的函数,下面来了解appleMiddleware的源码是怎样实现的.applyMiddleware返回的是store的enhancer,通过对createStore代码部分的学习,在传入enhancer的时候,执行的是enhancer(createStore)(reducer, preloadedState).
    
    function compose(...funcs) {
      if (funcs.length === 0) {
        return arg => arg;
      }

      if (funcs.length === 1) {
        return funcs[0];
      }

      return funcs.reduce((a, b) => (...args) => a(b(...args)));
    }

    export default function applyMiddleware(...middlewares) {
      return createStore => (...args) => {
        // ..args 是传入的reducer, proloadedState 来生成store
        const store = createStore(...args);
        const middlewareAPI = {
          getState: store.getState,
          dispatch: (...args) => dispatch(...args)
        }

        // 将middlewareAPI注入到每个middleware
        const chain = middlewares.map(middleware => middleware(middlewareAPI));
        // next的注入,将多个中间件关联,返回的dispatch已经被增强
        dispatch = compose(...chain)(store.dispatch);
        return {
          ...store,
          dispatch
        }
      }
    }

## 总结
通过以上简单理解了redux的实现原理,但是在具体使用的过程中还要思考为什么要使用redux并且对比redux跟其他状态管理(例如mobx)等的优缺点.其实重要的是理解所使用的库到底解决了本身应用的痛点才能选择合适的库并且发挥它的最大功能.





