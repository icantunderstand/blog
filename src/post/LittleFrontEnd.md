---
title: 前端小知识
date: "2021-11-03"
tags: JavaScript
path: /know-little-more

---

### [AsyncFunction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction)
在项目中需要根据配置生成Async Function来保证配置的串行执行，Async Function在创建的时候只能访问到全局作用域的变量，需要注意。在node中可以通过[vm.runInNewContext](https://github.com/nodejs/node/issues/9474)来解决。



