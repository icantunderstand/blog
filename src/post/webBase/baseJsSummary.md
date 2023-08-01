---
title: JavaScript基础梳理
date: "2023-08-01"
tags: JavaScript
path: /base-js-summary

---

## [AsyncFunction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction)
在项目中需要根据配置生成Async Function来保证配置的串行执行，Async Function在创建的时候只能访问到全局作用域的变量，需要注意。在node中可以通过[vm.runInNewContext](https://github.com/nodejs/node/issues/9474)来解决。