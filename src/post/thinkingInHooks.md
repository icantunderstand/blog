---
title: 聊聊我对React Hooks的理解
date: "2022-11-16"
tags: React
path: /thinking-in-react
---

在之前的文章[React Hooks源码解读](https://icantunderstand.github.io/blog/react-hooks)中有对React hooks的实现原理进行分析，本文主要结合React hooks的发展过程聊下对hooks的理解。hooks的提出主要解决了以下的问题:  
* 为react带来通用的代码逻辑复用的方式。相对于render props/高阶组件(HOC)等，hooks在代码复杂度上都有一定降低。声明式的hooks使用方式也符合函数式编程的思想。  
* 解决类组件生命周期函数复杂度和在新的react架构中的一些问题  
* 规范react使用范式，通过hooks的接口能更好的组织组件与组件/组件与渲染的原生DOM/组件与外部依赖之间的关系


## 通用的代码复用方式
react中可以通过render props/高阶组件(HOC)实现代码的能力的复用(组合)。

    // render props通过传入渲染函数的方式复用逻辑
    class Cat extends PureComponent {
        constructor(props) {
            super(props)
            this.state = { name: 111 }
            // 可复用的逻辑
        }
        render() {
            // 通过调用渲染函数的方式实现共享
            return this.props.render(this.state)
        }
    }
    class App extends Component {
        render() {
            return (
                <Cat render={params => (<div>{params.name}</div>)} />
            )
        }
    }
    // 高阶组件
    function HOC(WrappedComponent) {
      return class extends Component {
        componentDidMount() {
          // 通用的业务逻辑
        }
        render() {
          return (<WrappedComponent {...this.props} />)
        }
      }
    }

从render props和高阶组件的实现方式上看，两者都引入了新的组件结构来实现复用，增加了理解成本从而导致一些问题。笔者在最开始对高阶组件不熟悉的时候就遇到过一次bug。包裹的高阶组件没有将外层传递的属性透传给被包裹的组件从而导致子组件渲染异常。  
hooks通过函数声明式的方式实现代码复用，理解上更符合可见可得的思想，减少了理解成本。

## 解决老的问题
类组件的生命周期问题导致代码逻辑的分离，比如事件的监听与解绑


    // 类组件示例
    class Test extends Component {
        componentDidMount() {
            // 监听
            document.addEventListener()
        }
        componentWillUnmount() {
            // 解绑
            document.removeEventListener()
        }
        render() {}
    }
    // 函数式组件示例
    function Test(props) {
        useEffect(() => {
            // 监听
            document.addEventListener()
            return () => {
                // 解绑
                document.removeEventListener()
            }
        }, [])
        return xxx;
    }
在Concurrent Mode中会导致生命周期函数的多次执行，hooks的提出在结构上是与Fiber结构绑定的，服务于新的架构的

## 规范使用范式
react开发者都需要用一些库(redux等)来组合应用，react通过hooks为react增加了状态管理、操作DOM的入口、父子组件调用方式等，丰富且规范了React开发者的开发模式。通过这种规范可以让React更好的与社区结合，比如相关的库[Recoil](https://github.com/facebookexperimental/Recoil)、[react-use](https://github.com/streamich/react-use)。

## hooks使用注意
* 避免hooks依赖，比如useMemo/useCallback等是否需要使用。使用多个useState的时候是否引入其他的管理库来解
* UI逻辑与业务逻辑合理拆分。hooks做过多的业务逻辑会导致业务逻辑不明晰，需要进行适当的拆分。