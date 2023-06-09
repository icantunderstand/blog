---
title: XMLHttpRequest之查缺补漏
date: "2018-08-12"
tags: JavaScript
path: /xhr
---

## 简介
最近在做需求的时候,需要在页面上实现进度条的展示.功能上很简单但是发现自己对XMLHttpRequest的相关事件并不是很熟练,下面把发送xhr过程中的相关过程和方法梳理下。最后给出简单的实现进度条展示的方案。

## Ajax与XMLHttpRequest对象
Ajax(Asyncchronous JavaScript + XML)是利用XMLHttpRequest对象来实现动态网页的一种技术(方式).(本文所涉及到的API都是基于XMLHttpRequest Level 2)

## 使用
下面从一个例子逐步的展开XMLHttpRequest的基本使用方法
  
    const xhr = new XMLHttpRequest();
    const formdata = new FormData();
    formdata.append('name', 'haha');
    xhr.timeout = 3000;
    xhr.ontimeout = () => {
      // 超时处理
      console.log('timeout');
    }
    // 设置返回类型 例如json blob等
    xhr.responseType = 'text'
    // xhr完成时候的回调
    xhr.onload = () => {
      if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
        console.log(xhr.responseText);
      } else {
        console.log('something error');
      }
    }
    // 数据上传的进度 默认每50ms触发
    xhr.upload.onprogress = (event) => { 
      console.log(event);
    }
    // 数据下载(响应)进度 
    xhr.onprogress = (event) => {
      console.log(event);
    }
    xhr.open('POST', '/testurl', false);
    // 设置请求头
    xhr.setRequestHeader('Content-EnCoding', 'UTF-8');
    xhr.send(formdata);  

上面的例子创建了一个XMLHttpRequest对象,然后创建了一个表单类型的数据对象并对超时时间和超时时触发的回调函数进行的设置.对xhr完成时onload事件,数据上传的upload.onprogress事件和数据接收事件的回调进行了设置.最后调用open方法设置请求的方法和地址,最后通过send方法将创建的表单类型数据发送出去.下面从几个方面来拆分这个小例子来重新学习下XMLHttpRequest

### xhr的阶段
xhr(XMLHttpRequest)有5个阶段,可以结合调用的方法和数据发送的过程状态来综合理解这5个阶段
  * 0 未启动 未调用open方法
  * 1 启动  调用open方法,未调用send方法
  * 2 发送  调用send方法，未接受收到响应
  * 3 接受  接受到部分响应
  * 4 完成  接受到全部的响应信息,可以在客户端对数据进行处理  

每当xhr的状态(readyState)变化都会触发onreadystatechange时间,因此可以通过onreadystatechange事件和readyState结合来完成数据的接收处理过程  

### xhr方法与属性

#### open
open方法接受三个参数,顺序对应着请求的方法、地址、是否是同步请求  
  * 当请求方法是GET的时候,可以通过在url中增加query的方法进行数据的发送并且在调用send方法时必须send(null). POST方法发送数据通过send函数 只有在调用send方法的时候才实际发送对应的xhr请求
  * 第三个参数指定请求时候是同步异步请求
  
#### setRequestHeader
设置请求头信息, 注意在这个方法必须在open和send之间调用
#### 进度事件
  * loadstart 接收到响应第一个字节时触发 
  * onload 请求返回时候的监听函数,注意此时需要对相应的状态码,需要区分服务器的正常返回和错误返回做不同的处理
  * abort 取消请求的发送
  * onprogress upload.onprogress onprogress是对数据响应过程的监听,有个小点是请求响应头的content-length必须指定为非0,onprogress获取到的event事件的event.lengthComputable属性才是true. upload.onprogress事件是对上传数据过程的监听. 必须在调用open之前对onprogress和upload.onprogress添加事件处理程序否则无效
  * error 请求发生错误的时候的监听函数
  * loadend 当触发error load abort事件后触发
  
#### xhr.responseType xhr.response| xhr.responseXML | xhr.responseText
  通过xhr.responseType的设置来获取不同的返回数据类型. 一个简单的例子,通常前端会通过href标签指定download属性来进行文件的下载并且可以通过download进行文件名的设置.这种方式在处理同源的文件是没有问题的,但是在处理不同域的文件的时候文件名字是无法重置的,只会是服务端存储的文件名,这个时候可以通过设置responseType为blob,生成File定义文件名并且进行文件的保存,可以使用[fileSaver](https://github.com/eligrey/FileSaver.js)这个库来实现这个功能.当然也可以通过借助后端设置响应头 content-disposition: attachment并且指定filename来实现文件的下载

#### 实现进度条的思路
  在实现进度条的时候其实用户感知的时数据上传和数据响应这两个过程,在实际操作的时候我发现upload.onprogress这个阶段是相对来说比较快的,也就是数据在服务端处理返回这个过程是整个请求用户感知最长的时间端.
  那么可以在upload.onprogress这个阶段去mock数据发送的过程.假设整体进度条是0-100.那么上传阶段完成是mock到50%,然后通过onprogress来完成后面50%的进度展示.更加细分的话是根据数据量来动态的切分上传阶段和数据接收阶段的比例来完成对用户接受更合理的进度展示.
## 跨域
  默认情况下xhr只能访问相同域下的资源,通过CORS(跨源资源共享)可以访问到其他域的资源.CROS可以理解为浏览器和服务端的一种沟通方式来判断对应的请求是否成功
## 总结
作为一个web前端开发者离不开XMLHttpRequest的使用,以上通过对xhr基础的介绍和自己在项目中遇到的问题的来复习了下xhr,希望自己静下来把基础打牢.