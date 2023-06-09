---
title: go语言入门之-函数和方法
date: "2019-04-19" 
tags: Go
path: /go-func
---

## 函数
### 函数声明
函数声明包含函数的名字,形参列表,返回值列表(可选)以及函数体构成.

    func name(parameter-list) (result-list) {
      body
    }

需要注意一下几点:  

1. 函数的形参列表和返回值列表组成函数的签名,函数的签名会在函数被调用的时候做校验是否调用合法.
2. 参数的传递是按值传递的.当传递引用类型作为实参的时候,可能会修改实参变量.
3. 支持多返回值.


    func test(a [3]int) (int x, int y) {
      return x, y
    }
    func add(vals ...int) int {  // 变长参数声明
	    sum := 0
      for _, v := range vals {
		    sum += v
      }
	    return sum
    }

#### 函数变量声明
函数声明只能定义在包级别的作用域,函数变量声明可以在任何表达式内指定.函数变量生命能获取到整个词法环境(可以访问外部的变量)


    func test() func(int) int {
      x := 2
      return func (y int) int {
        return x * y
      } // 这里的函数变量(匿名函数)可以访问到外部的x
    }

### 函数流程控制
#### defer
defer语句是普通的函数调用,defer语句能确保函数的return语句或函数执行完毕之后执行对应的defer函数.主要为了在函数的执行完毕后做特定的行为.

    func test(x int) int {
	    defer func() { fmt.Print(x) }() // defer语句必须返回一个可执行的语句
	    return x
    } // 这个函数会在返回后打印入参


## 方法  
### 方法声明
方法是声明特定类型(对象)上可以执行的函数. 通常可以使用如下的方式声明: 

    func (p structName) funcName(parameter-list) (result-list) {
      body
    }  
    // 声明可以在p类型上调用funcName的方法 
    func (p Point) add() int {
      return p.x + p.y
    }
    p := Point{ 2, 3}
	  p.add()

注意:  
1. 由于方法的调用是p.funcName和获取p结构体上的属性一致,要注意同一类型上的命名冲突.

### 指针接收者方法  
由于方法会复制实参,当需要方法的调用对外界产生影响的时候,就需要通过指针类型来完成方法的声明,如下面的例子:

    type Point struct {
      x, y int
    }

    func (p *Point) ScaleBy(factor int) {
      p.x *= factor
      p.y *= factor
    }

    func main() {
      p := &Point{10, 10} // 获取指针
      p.ScaleBy(2) // p{20, 20}
      q := Point{1,2}
      q.ScaleBy(3)  // q{3,6} 当类型符合的时候,会进行隐式转换 相当于 (&q).ScaleBy(3)
    }  

### 方法变量和方法表达式  

#### 方法变量
可以将一个特定类型的方法赋值给一个变量,这个变量称为方法变量.该方法变量已绑定到特定的接收者上(caller),通过传递形参就可以完成方法的调用.通常用于绑定特定的接受者.

    type Point struct {
      x, y int
    }

    func (p *Point) ScaleBy(factor int) {
      p.x *= factor
      p.y *= factor
    }

    func main() {
      p := &Point{10, 10}
      scaleBy := p.ScaleBy
      scaleBy(2) // p{20, 20}
    }  

#### 方法表达式
方便表达式必须在调用的时候,提供接受者.方法表达式是把对应结构的函数行为进行声明.  


    type Point struct {
      x, y int
    }

    func (p *Point) ScaleBy(factor int) {
      p.x *= factor
      p.y *= factor
    }

    func main() {
      p := &Point{10, 10}
      scaleBy := (*Point).ScaleBy // 方法表达式
      scaleBy(p,2)
    }








