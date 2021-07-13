---
title: Vue基础知识
date: 2021-5-20 09:00:00
tags: 前端基础
categories: 
---

## Vue实例
通常用vm指代实例
vm.$data 实例上的数据
vm.$el 实例挂载的dom节点

## 指令
| 指令 | 含义 | 作用 | 
| ------ | ------ | ------ |  
| v-if | 条件渲染(真正的条件渲染) 对比v-show | 切换过程中条件块内的事件监听器和子组件被销毁和重建 | 
| v-bind  | 绑定属性 | 简写形式:prop="bindValue" | 
| v-on  | 监听事件 | 简写@eventName |
| v-for  | 可以实现列表渲染 | 可以遍历数组 + 对象 + 整数,数组的方法被vue包裹了 push pop等会触发页面的渲染 |
| v-model | 使用v-model可以在表单input textarea select元素上创建双向数据绑定  |  |

## 计算属性
computed  定义属性的getter(也可以设置setter)函数 计算属性能很好的实现缓存,只有响应式依赖改动后计算属性才会重新计算

## 组件基础

### 生命周期函数

| 指令 | 含义 | 
| ------ | ------ | 
| beforeCreate(){} | 实例初始化之后调用 不能访问data computed methods上的方法和数据  |  
| created(){}| 从beforeCreate到created数据绑定的配置、计算属性与方法的挂载、watch/event事件回调等,通常在这里做数据请求  |  
| beforeMount() {} |  created到beforeMount 将template编译成render函数 |  
| mounted() {} | 组件渲染到DOM |  
| beforeUpdate(){} |  实例数据是最新的 但是没有渲染到页面 |  
| updated(){} | 数据发生更新并且DOM渲染完成,避免在这个周期操作数据 陷入死循环 |  
| beforeDestroy(){} | 实例被销毁前调用 此时实例仍然可用, 常用于销毁定时器,解绑全局事件 |  
| destroyed(){} | 实例销毁后调用,vue组件已销毁 |  

### 组件注册 
全局注册  所有的内容都可以引用定义的组件  全局注册必须在根Vue实例创建
局部注册  局部注册 只有使用的页面会包含对应的功能

### 插槽
slot有点像react的高阶组件  提供slot的组件对一些功能进行了封装

### 动态组件
<component v-bind:is="currentTabComponent"></component>

### vue组件的通信方式

#### props/$emit/.sync

#### provide/inject
这种方式有可能导致代码不可溯(业务逻辑分散)

#### eventBus
其实就是事件机制哈 可以new一个vue来做事件的emit/on(业务逻辑分散问题)

#### vuex

### $attrs & $listeners
这个需要在理解理解

## vue相关 
### [vuex](https://vuex.vuejs.org/zh/guide/)
  * state  store中的状态
  * getters 可以理解是store的计算属性 有缓存能力 mapGetters可以将store的getter混入到computed对象中
  * mutation 
    * 提交修改store的方式  mutation函数 入参(state, payload)  通过store.commit('name') 触发mutation执行 
    * mutation 必须是同步函数 
    * 可以通过mapMutations 将组件的method进行store的映射commit
  * action  
    * action提交mutation 通常在action中执行异步操作提交mutation
    * action方法接受一个与store实例具有相同方法和属性的context对象
    * 通过dispatch触发action的调用
    * 通过mapActions函数将组件的method映射为dispatch调用
  * module
    * module可以实现将store进行分割
    
### [vue-cli](https://cli.vuejs.org/zh/) 
@vue/cli + @vue/cli-service  功能齐全的脚手架(初始项目能力 开发 build)

### [vue-class-component](https://class-component.vuejs.org/)
  * data如何定义  data是undefined会无法响应  可以通过data函数或者null来做
  * 方法会定义成methods
  * 通过class的getter/setter 会变成计算属性
  * 其他的插件(vue-router)提供了不同的钩子 可以通过registerHooks 然后再组件上定义相同的方式 响应钩子
  * 如何定义一个自己的decorator(看下decorator的定义)
  * extend(主要extend vue) mixins(使用场景 mixins是否合理 代码乱)

### [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)
vue-property-decorator基于vue-class-component通过装饰器来丰富组件能力
  * @Prop(options) propName: type     @Prop({ default: 'haha' }) name: string
  * @PropSync(propName: string, options: {}) propName: type
    结合.sync修饰符可以实现父子组件状态同步逻辑
  * @Watch(path: string, options: WatchOptions = {}) 同vue的属性监听 可以去做一些特定的行为
    WatchOptions = { deep: flag, immediate: flag  } deep监听对象  immediate 会立即触发回调
  * @Emit(event?: string) 如果不提供event名字 以函数名字为emit的事件名字  主要用于与父元素进行事件通信


