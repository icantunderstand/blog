---
title: react-native中的手势处理
date: "2020-04-15"
tags: 跨端技术
path: /rn-gesture
---

## 前言
在react native开发中通常会使用Touchable*组件来实现对用户手势的处理.本篇文章从Touchable*组件的基本使用出发,逐步深入到react native中手势处理的原理.

## Touchable*组件

### 基本使用
在react native中通常使用一下几种组件来实现点击的处理
1. TouchableOpacity
2. TouchableHighlight 
3. TouchableWithoutFeedback

对于TouchableOpacity的基本使用如下,通过绑定onPress事件就能获取到用户的点击行为进行处理   

        <TouchableOpacity
          style={styles.button}
          onPress={(evt => { this.onPressEvt(evt)  })}
        >
          <Text>Press Here</Text>
        </TouchableOpacity>

在开发中不禁会有这样的疑问,为什么TouchableOpacity能响应用户的手势点击而普通的View组件却不行.这就引出了React Native中的手势处理流程

## 手势处理流程
React Native中组件对手势的响应是通过如下的阶段来实现:

![react native 手势](./reactNativeStatic/gesturelifecycle.jpg) 

在每个阶段会有相应的处理函数来处理当前阶段的行为  

### 手势响应的阶段

#### 申请阶段
1. View.props.onStartShouldSetResponder: (evt) => bool(返回true 代表当前组件申请在触摸手势的时候成为响应者)
2. View.props.onMoveShouldSetResponder: (evt) => true(返回true 代表当前组件申请在移动手势的时候成为响应者)  

#### 通知阶段
1. View.props.onResponderGrant: (evt) => {}(获取手势处理回调)
2. View.props.onResponderReject: (evt) => {}(获取手势处理失败回调)  

#### 响应阶段
1. View.props.onResponderMove: (evt) => { }(手势移动回调)
2. View.props.onResponderRelease: (evt) => { }(手势行为结束(touchUp)回调)  

#### 释放阶段
1. View.props.onResponderTerminationRequest: (evt) => bool (当其他组件想成为当前手势的处理者时会触发,返回true表示释放)
2. View.props.onResponderTerminate: (evt) => {} (当前组件失去响应者身份触发）

### 手势拦截
手势的响应是冒泡的,父元素可以使用如下的方法来实现对手势的拦截处理.  
1. View.props.onStartShouldSetResponderCapture: (evt)=> bool (返回true成为手势的处理者, 子元素不响应)
2. View.props.onMoveShouldSetResponderCapture: (evt)=> bool ((返回true成为手势的处理者, 子元素不响应))

### 自定义响应组件实现
通过对手势处理阶段的了解,在定义响应组件的时候可以通过添加相应的函数来实现,react native定义了PanResponder.create()方法来快速的实现组件的定义.PanResponder响应回调函数中封装了事件和手势的状态信息,能更细致的实现对手势的处理.


    class App extends Component {
      constructor(props) {
        super(props)
        this.PanResponder = PanResponder.create({
          onStartShouldSetPanResponder: (evt, gestureState) => true, // 触摸的时候成为手势响应者
          onPanResponderStart: (evt, gestureState) => { console.log('someone touch me') }, // 触摸时间回调
        })
      }
      render() {
        return (
          <View style={styles.container} {...this.PanResponder.panHandlers} ></View>
        )
      }
    }

## 后记
后面会按照下面的思路逐步的梳理下React Native相关入门与实践的一些知识.
![react native 入门](./reactNativeStatic/reactNativeBasic.png) 


