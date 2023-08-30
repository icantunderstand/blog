---
title: react基础知识梳理
date: "2023-08-15"
tags: React
path: /base-react-summary
---


## 受控组件/非受控组件

* 受控组件依赖于state,通过onChange => state => value 适合频繁数据处理表单逻辑场景(校验)
* 非受控组件不依赖于state,通过操作dom更新和获取值 适合简单提交表单场景

## 单页应用/多页应用
| 对比 | 单页应用 | 多页应用 |
| ------ | ------ | ------ | 
| 优点 | 页面切换快，当前页面刷新  | 利于SEO |
| 缺点 | 不利于SEO，需要做服务端路径处理和应用内前进后退逻辑 | 切页需要重新加载资源，有卡顿空白的问题 |
 
## 前端架构模型(MVC/MVP/MVVM)

### MVC 
#### 客户端MVC  
![客户端mvc](./reactBase/mvc.png)  
1. 用户操作视图后，调用Controller接口发起数据更新
2. Controller调用Model接口做数据变更，Model发起数据变更通知
3. 数据监听数据变更通知，完成页面更新

#### 服务端MVC
![服务端mvc](./reactBase/serverMvc.png)  
1. 用户发起页面请求
2. 服务端根据路由规则把请求交给特定的Controller处理，Controller完成数据的组合和页面模版渲染
3. 服务端将渲染结果返回给客户端，客户端完成页面的渲染

### MVP(Model-View-Presenter)  
![mvp](./reactBase/mvp.png)  
1. 用户操作页面，调用Presenter
2. Presenter直接调用Model接口更新数据
3. Model更新后通过观察着模式通知Presenter
4. Presenter接受更新通知后调用View接口更新视图

### MVVM(Model-View-ViewModel)   
![mvvm](./reactBase/mvvm.png)  
1. 用户操作页面，调用ViewModel更新Model
2. Model更新触发ViewModel更新
3. ViewModel和View有双向绑定，视图自动更新

## react diff
react的diff策略基于以下三点:
* DOM节点的跨层级移动操作较少
* 相同类型组件有相同的DOM结构，不同类型的组件有不同的DOM结构
* 对于同一层级的一组子节点，可以通过唯一id进行区分
对于以上三点，有以下的更新策略
* tree diff 对虚拟Dom分层diff,不存在直接删除不考虑移动的复用
* component diff  不同类型组件直接替换，同类型组件可以通过组件的属性变化来判断是否需要更新
* element diff React提供了三种节点操作：插入(INSERT_MARKUP)/移动(MOVE_EXISTING)/删除(REMOVE_NODE)来达到同类型子节点复用的目的
![element diff](./reactBase/elementDiff.png) 


## react fiber reconciler过程
reconciler分为render阶段和commit阶段
* render阶段利用已有的fiber tree生成workInprogressFiber render阶段可以被高优先打断
* commit阶段是更新阶段，将render阶段需要更新的操作执行，commit阶段有三个主要阶段钩子
    1. before mutation(执行DOM操作前)  
    2. mutation(执行DOM操作)
    3. layout阶段(执行DOM操作之后)


## 自定义hook实现

### useDebounceValue


    const useDebounce = (value, delay = 500) => {
        const [debouncedValue, setDebouncedValue] = useState("");
        const timerRef = useRef();

        useEffect(() => {
            timerRef.current = setTimeout(() => setDebouncedValue(value), delay);

            return () => {
            clearTimeout(timerRef.current);
            };
        }, [value, delay]);

        return debouncedValue;
    };

## 高阶组件/render props
[高阶组件/render props](https://icantunderstand.github.io/blog/react-hoc)

## 前端路由
[前端路由](https://icantunderstand.github.io/blog/history)

## react事件系统
[React 事件系统源码解读](https://icantunderstand.github.io/blog/react-event)

## react hooks
[react hooks](https://icantunderstand.github.io/blog/react-hooks)  
[聊聊我对React Hooks的理解](https://icantunderstand.github.io/blog/thinking-in-react)

## react渲染过程
[图说React渲染流程](https://icantunderstand.github.io/blog/react-render-interpretation)  
[React render流程梳理](https://icantunderstand.github.io/blog/react-render)

## 前端状态管理
[当我们聊状态管理的时候我们在聊什么](https://icantunderstand.github.io/blog/state-control)

## react更新任务调度
[setState源码分析](https://icantunderstand.github.io/blog/react-setstate)  
[从Scheduler包来看React的任务调度](https://icantunderstand.github.io/blog/react-scheduler)

## 参考

[react 中 ReactElement 与 Fiber 的关系](https://juejin.cn/post/7099810539315920926)  
[How React server components work: an in-depth guide](https://www.plasmic.app/blog/how-react-server-components-work)  
