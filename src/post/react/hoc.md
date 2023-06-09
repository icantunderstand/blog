---
title: React高阶组件
date: "2018-12-11" 
tags: React
path: /react-hoc
---

## 简介 
最近在做业务中,需求的场景是需要在原有的组件上添加点击事件并且需要维护一些新增的内部状态,想到的方案就是通过高阶组件来实现.通过高阶组件能减少对原有组件的侵入性.高阶组件它是一个接收组件并且返回组件的函数.高阶组件能最好化的复用代码.实现高阶组件有如下几种方式:  
1. 属性代理(操控props,增加state)
2. 反向继承  

## 使用

### 属性代理
下面这个例子,通过在高阶组件中创建新的state完成了新的业务逻辑的添加,通过控制props的传递可以向组件加入新的props.
    
    import React, { Component } from 'react';
    class WrappedComponent extends Component {
      componentDidMount() {
        console.log('Wrapped');// wrappedComponent先Didmount(子组件先DidMount)
      }
      render() {
        return (<div>WrappedComponent{this.props.name}</div>)
      }
    }
    const HOC = (Wrapped) => {
      return class extends Component {
        constructor(...args) {
          super(...args)
          this.state = { count: 0 }  // 创建新的state,来添加新的业务逻辑
        }
        componentDidMount() {
          console.log("HOC");
        }
        render() {
          return (<div
            onClick={() => { this.setState({ count: this.state.count + 1 }, () => {
              console.log(this.state.count);
            }) }}
          >
            <Wrapped {...this.props} name="HOC" />  // 在这里可以给传入的组件添加新的props
          </div>)
        }
      }
    }
    const HOCComponent = HOC(WrappedComponent);
    class App extends Component {
      render() {
        return (
          <div
          >
          <HOCComponent/>
          </div>
        );
      }
    }
    export default App;  

### 反向继承
反向继承指的是在高阶组件中继承包裹的组件,在对包裹组件的方法进行调用的时候,要通过super来实现反向的调用.通过这种方式可以拿到包裹组件的state,props以及相关声明周期的调用,但是它不保证完整的子组件被渲染.  

    import React, { Component } from 'react';
    class WrappedComponent extends Component {
      constructor(...args) {
        super(...agrs);
        this.state = { name: 1 };
      }
      componentDidMount() {
        console.log('Wrapped');
      }
      render() {
        return (<div>WrappedComponent</div>)
      }
    }
    const HOC = (Wrapped) => {
      return class extends Wrapped {
        static displayName = 'HOC' //定义高阶组件的名字
        componentDidMount() {
          console.log("HOC");
          console.log(this.state) // { name: 1 }
          super.componentDidMount();// 通过super调用(如果没有调用,不会执行Wrapped的DidMount)
        }
        render() {
          return super.render() //在这个可以实现渲染劫持,例如常规的loading态加载
        }
      }
    }
    const HOCComponent = HOC(WrappedComponent);
    class App extends Component {
      render() {
        return (
          <div
          >
          <HOCComponent/>
          </div>
        );
      }
    }
    export default App;

## 代码复用其他方案

### render props  
render props能一定程度的实现代码逻辑的封装和复用.在定义组件的时候通过在定义一个render函数来决定组件的具体内容.(children API)

    import React, { Component } from 'react';
    class Cat extends React.Component {
      render() {
        const mouse = this.props.mouse;
        return (
          <div>
            {mouse.x}
            {mouse.y}
          </div>
        );
      }
    }
    class Mouse extends Component {
      constructor(props) {
        super(props);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.state = { x: 0, y: 0 };
      }
      handleMouseMove(event) {
        this.setState({
          x: event.clientX,
          y: event.clientY
        });
      }
      render() {
        return (
          <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
          {this.props.render(this.state)}
          </div>
        );
      }
    }
    class MouseTracker extends React.Component {
      render() {
        return (
          <div>
              <Mouse render={(mouse) => (
                <Cat mouse={mouse} />
              )}//  这里每次都会生成一个新的方法,可以定义一个实例的方法
              />
          </div>
        );
      }
    }
    export default MouseTracker;

## 总结
react通过组件之间的组合来生成页面,通过高阶组件的可以复用已有的逻辑并且减少对原来代码的入侵性.在进行系统的设计的时候,也应该考虑对原有逻辑的改造问题.如何能让剔除业务逻辑的其他相关组件之前依赖性降低是一个值得好好考虑的问题.
## 参考
[Render Props](https://reactjs.org/docs/render-props.html)[React Components, Elements, and Instances](https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html)