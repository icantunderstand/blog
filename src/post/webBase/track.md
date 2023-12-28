---
title: 埋点方案梳理
date: "2023-12-28"
tags: 工程化
path: /track-event
summary: ""
---

埋点在产品功能迭代和排查问题等场景能提供数据基础，以下梳理项目中使用的埋点方式

## 手动埋点
手动埋点是显示的在代码中插入代码，这种方式在精准性和定制化能力上更优，过多的手动埋点会增加项目的维护成本和影响系统的性能等。

## 自动化埋点
自动化相比手动埋点方式
* 减少了人工的工作、数据收集方便也更加全面。适用于快速迭代中获取产品的相关用户数据。
* 缺少灵活性 一些高阶数据诉求的埋点仍然需要手动添加实现

### 自动化埋点的一些实现方式
自动化埋点在于通过程序的方式去减少手动埋点的代码量，实现一些基础埋点比如PV/点击/停留时间的打点等，替代一部分自动化埋点的能力来降低整体项目埋点的压力，为项目卸压。

#### 代码注入
通过babel插件的方式，对已有的元素的Click事件进行拼接，添加埋点逻辑，这样在出现点击行为的时候就自动实现了埋点的上报。

        // 简单示例
        module.exports = function ({ types: t }) {
            return {
                visitor: {
                FunctionDeclaration(path) {
                    // 在这里你可以添加逻辑来判断是否需要修改这个特定的函数
                    // 这里简单地选择所有函数，并添加一个新的 console.log 语句

                    const originalBody = path.node.body;
                    // 插图新的语句
                    const newStatement = t.expressionStatement(
                        t.callExpression(t.memberExpression(t.identifier('console'), t.identifier('log')), [t.stringLiteral('New logic added!')])
                    );

                    path.node.body = t.blockStatement([newStatement, ...originalBody]);
                },
                },
            };
        };

#### 监听(观察者模式)
观察者模式能实现模块间的解耦，在实现自动化埋点的时候，可以在被观察者出现数据变更的时候，做对应的通过埋点逻辑


        import { observable, reaction } from 'mobx'

        const searchParam = observable({
            name: '',
            age: '',
        })
        reaction(
            () => ({ ...searchParam }),
            (newValue, oldValue) => { 
                //发送埋点逻辑
                sendEvent('搜索参数变更', {
                    newValue, 
                    oldValue,
                })
            }
        )



#### 提取范式
在人工埋点的基础上，通过抽象去减少人工埋点的代码，比如
* 页面的PV可以在路由切换的时候去自动的打点
* 项目通用参数可以在埋点函数中统一加入通用参数
* 类似页面加载时长埋点可以提取通用的hook实现


## 埋点上的一些注意和思考
埋点主要是为了从数据侧拿到一些数据信息辅助后面的迭代规划。埋点能实现以下的功能
* 用户行为分析
* 业务决策支持
* 性能监控
* 异常监控

需要注意的是埋点也需要进行治理
* 维护性 开发一个项目通篇都是埋点代码那这个项目的可读性就很差了。
* 性能 
    * 缓存队列 可以通过缓存队列 一次完成多个埋点的发送
    * 设置采样率
    * 减少触发频次  比如在端内场景通过bridge埋点涉及跟客户端通信，有可能会阻塞当前的UI操作，可以等待用户空闲的时候再进行埋点，例如react native中可以通过InteractionManager的runAfterInteractions来执行埋点逻辑






