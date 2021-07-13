
## 基本概念 

* Isolate 
  Isolate是一个完整的V8实例，有完整的堆栈和Heap.Isolate彼此完全隔离。在一个时间段内只有一个线程能使用此isolate.多个线程可以同时使用多个isolate。
* 句柄(handle)
  handle是js对象的索引，它指向js对象在V8所管理的Heap的位置。有Local Handle(), Persistent Handle,UniquePersistent Handle, Eternal Handle。
* 句柄作用域( scope)
  Handle Scope 包含Handle的容器，当这个工作区的Handle Scope被移出堆栈时其所包含的Handle都会被移除堆栈并被垃圾管理器标注。Local Handle受Handle Scope管理。Persistent Handle不受Handle Scope管理 
  Context Scope 管理Context
* 上下文(Context)
  执行环境。
* Templates
  Templates用于在C++中自定义一个js函数
  Function Tempaltes 用于生成js函数的C++对象
  Object Templates 每一个Function Tempaltes都有一个对应的Object Templates,当一个Function Templates对应的js函数被当做构造器创建对象时V8会使用Object Templates来实例化此对象。

## 相互调用

### JS调用C++
* 变量  全局注册 Accessor 


    // Create a template for the global object.
    Handle<ObjectTemplate> global = ObjectTemplate::New();
    //public the name variable to script
    global->SetAccessor(String::New("name"), NameGetter, NameSetter );

* 函数  通过FunctionTemplate


      global->Set(String::New("func"),FunctionTemplate::New(func));

* 类  通过FunctionTemplate  但是需要做一层类的包装器

### C++ 调用JS


    Local<Value> ret = callback->Call(recv, argc, argv);


## 模块
builtin module  C++形式提供的模块
constants module  Node中定义常量的模块
native module Node中以Javascript形式提供的模块

### module.exports && exports

* 默认情况下module.exports和exports都指向要导出的内容
* 直接修改module.exports会改变指向


    exports = module.exports = function (name, age) { this.name = name;
    this.age = age;
    }
    exports.sex = "male";

 


https://blog.dingkewz.com/post/tech/google_v8_core_concepts_01/
https://v8.dev/docs/embed