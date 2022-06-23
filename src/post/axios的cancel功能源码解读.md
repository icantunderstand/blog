---
title: axios的cancel功能源码解读
date: "2022-06-22"  
tags: JavaScript
path: /axios-cancel
---

本文梳理axios中使用CancelToken来实现中断请求的源码实现.
(CancelToken已经是deprecated, axios已支持AbortController实现相应的功能)
## 简单使用
        
        const CancelToken = axios.CancelToken;
        // 创建cancelToken
        const source = CancelToken.source();

        axios.get('/user/12345', {
            // 请求的时候 传入创建的cancelToken
            cancelToken: source.token
        }).catch(function (thrown) {
            if (axios.isCancel(thrown)) {
                console.log('Request canceled', thrown.message);
            } else {
                // handle error
            }
        });


        // 调用cancelToken的cancel方法 取消请求
        source.cancel('Operation canceled by the user.');

上面是axios官网的上使用CancelToken的例子，可以看到通过将创建的cancelToken传入对应的请求对象，就实现了请求控制能力暴露给外部的能力。
## 源码分析

XMLHttpRequest支持使用abort方法实现请求的终止，axios底层封装了XMLHttpRequest来实现请求的处理，通过将调用abort方法的能力暴露给外部就实现了请求中断的控制。axios引入了cancelToken来实现这个过程的解耦。下面从具体的源码来看实现的过程

### 创建cancelToken对象  


    // 调用source方法 生成CancelToken 导出token和取消请求的cancel方法
    CancelToken.source = function source() {
        var cancel;
        var token = new CancelToken(function executor(c) {
            cancel = c;
        });
        return {
            token: token,
            cancel: cancel
        };
    };

    function CancelToken(executor) {
        if (typeof executor !== 'function') {
            throw new TypeError('executor must be a function.');
        }

        var resolvePromise;
        // 设置CancelToken的promise函数
        this.promise = new Promise(function promiseExecutor(resolve) {
            resolvePromise = resolve;
        });

        var token = this;
        // cancel函数的执行逻辑 在调用cancel接口的时候 执行下面的逻辑
        executor(function cancel(message) {
            if (token.reason) {
                // Cancellation has already been requested
                return;
            }

            token.reason = new Cancel(message);
            resolvePromise(token.reason);
        });
    }

### cancelToken与XMLHttpRequest绑定 


        // 代码是axios封装XMLHttpRequest的部分逻辑
        if (config.cancelToken) {
            // 如果传入的配置有cancelToken 就调用cancelToken的promise方法 
            // 通过promise实现控制流的流转 调用cancelToken方法的时候 将resolve时机暴露给cancelToken
            // 调用cancelToken的cancel方法时,resolve了当前的promise，控制流程回到当前的后续流程，执行request.abort()从而完成请求的终止
            config.cancelToken.promise.then(function onCanceled(cancel) {
                if (!request) {
                    return;
                }

                request.abort();
                reject(cancel);
                // Clean up request
                request = null;
            });
        }

        if (!requestData) {
            requestData = null;
        }

        // Send the request
        request.send(requestData);


通过对实现流程的源码梳理，在类似的功能中可以利用promise来完成流程的控制。