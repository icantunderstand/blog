---
title: 基础知识暂无归类
date: 2019-4-11 11:20:00  
tags: 
categories: 
---


## Server Component
* server component运行在服务端 client component不能引入(import)server component  但是可以通过props.children这种方式


      export default function OuterServerComponent() {
        return (
          <ClientComponent>
            <ServerComponent />
          </ClientComponent>
        )
      }

渲染Server Component的过程
* 序列化 根元素to JSON(属性 需要可序列化)

   
      function SomeServerComponent() {
        // server onClick函数不可序列化
        return <button onClick={() => alert('OHHAI')}>Click me!</button>
      }
      function ClientComponent1({children}) {
        // It is okay to pass a function as prop from client to
        // client components
        // 不会运行ClientComponent1 所以这样ok
        return <ClientComponent2 onChange={...}>{children}</ClientComponent2>;
      }


  1. 基础type(div) 已经序列化
  2. server component 就执行server component 目标转化成基础的标签(div p)
  3. client component 遇到client组件的时候 type属性是一个模块引用的对象 


          {
            $$typeof: Symbol(react.element),  
            // The type field  now has a reference object,
            // instead of the actual component function  
            
            type: {
              $$typeof: Symbol(react.module.reference),
              // ClientComponent is the default export...
              name: "default",
              // from this file!
              filename: "./src/ClientComponent.client.js"
            },
            props: { children: "oh my" },
          }

* 浏览器构建react tree
server component返回结构  


      M1:{"id":"./src/ClientComponent.client.js","chunks":["client1"],"name":""}
      J0:["$","@1",null,{"children":["$","span",null,{"children":"Hello from server land"}]}]
      JO的$属性 标识它被M1引用


      import { createFromFetch } from 'react-server-dom-webpack'
      function ClientRootComponent() {
        // fetch() from our RSC API endpoint.  react-server-dom-webpack
        // can then take the fetch result and reconstruct the React
        // element tree
        const response = createFromFetch(fetch('/rsc?...'))
        return <Suspense fallback={null}>{response.readRoot() /* Returns a React element! */}</Suspense>
      }


## CSS画出各种图形

    <div id="container">
    </div>

    // css画出个圆形
    #container {
      width: 100px;
      height: 100px;
      background: blue;
      border-radius: 50%;
    }

    // css画一个半圆

    #container {
      width: 100px;
      height: 50px;
      border-radius: 100px 100px 0 0;
    }

    // 画一个四分之一圆
      #container {
        width: 100px;
        height: 100px;
        border-radius: 100px 0 0 0;
        background: red;
      }

    // 椭圆
    #container {
      width: 100px;
      height: 50px;
      background: blue;
      border-radius: 100px/50px;
    }

    // 画一个三角形
    #container {
      width: 0px;
      height: 0px;
      border-left: 50px solid transparent;
      border-right: 50px solid transparent;
      border-bottom: 100px solid black;
    }

    // 画一个左上三角
    #container {
      width: 0px;
      height: 0px;
      border-top: 100px solid red;
      border-right: 100px solid transparent; 
    }






