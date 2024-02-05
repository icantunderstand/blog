ast生成过程


Webpack构建流程 在复习一下 ** 


react 任务拆分  scheduler

bable 插件 

Webpack 插件

webpack loader


table schema


webpackBootstrap



/******/ (() => { // webpackBootstrap
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
/******/   var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/   // ...
/******/ })()
