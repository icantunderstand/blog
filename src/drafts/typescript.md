---
title: typescript
date: 2021-5-20 07:30:00  
tags: 
categories: 
---

类型 静态检测 => 可预见性 => 所以要给代码合适(过度)的类型声明

### 类型声明
    
    // 常量 const args = [8, 5] as const 这样args的类型就定义了 
    // 对象
    { x: number; y?: string }
    // 联合类型声明  对id的调用需要number string两种类型上都有 例如这个可以直接id.slice()
    id: number[] | string

    const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElemet
    const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas")
    let a: 'ss' | 'bb' = 'ss'

    never 代表一个不存在的值

    // 属性修饰符
    ? 可选属性
    readonly 可读属性

    // index Signatures
    interface StringArray {
      [index: number]: string;
    }

    // 数组
    Array<string>
    ReadonlyArray<string>  readonly Type[]


### 函数

    // this
    interface DB {
      filterUsers(filter: (this: User) => boolean): User[];
    }
    const db = getDB();
    const admins = db.filterUsers(function (this: User) {
      return this.admin;
    });
    // void 函数没有返回值的时候 void
    // object 指代不是原值的定义
    // unknown 跟any很像 但是不能在unknown上进行一些操作
    // never 函数没有返回值的时候 使用

    // 解构
    function sum({ a, b, c }: { a: number; b: number; c: number }) { 
      console.log(a + b + c);
    }

    function doSomething(pair: readonly [string,number]) {
    }
    readonly [number, number] 类型上不等同于 [number,number]

### 函数重载


    function makeDate(timestamp: number): Date;
    function makeDate(m: number, d: number, y: number): Date;
    function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
      if (d !== undefined && y !== undefined) {
        return new Date(y, mOrTimestamp, d);
      } else {
        return new Date(mOrTimestamp);
    } }

### interface
    
    // interface扩展
    interface A extends C,D {}
    // 类型合并
    interface Colorful {
      color: string;
    }
    interface Circle {
      radius: number;
    }
    type ColorfulCircle = Colorful & Circle;

    泛型对象声明
    interface Box<Type> {
      contents: Type,
    }
    interface Apple {
    }
    type AppleBox = Box<Apple>

### 泛型

    function identity<Type>(arg: Type): Type {
      
    }

    interface GenericIdentityFn {
      <Type>(arg: Type): Type;
    }
    interface Lengthwise {
      length: number;
    }
    function log<Type extends Lengthwise>(arg: Type) : Type {

    }
    // keyof 操作符
    function getProperty<Type, Key extends keyof Type>(obj: Type, key:Key) {
      return obj[key]
    }
    // 条件类型 
    type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;
    interface Email {
      message: string;
    }
    interface Dog {
      bark(): void;
    }
    type EmailMessageContents = MessageOf<Email>;
                    type EmailMessageContents = string
    type DogMessageContents = MessageOf<Dog>;

    type OnlyBoolsAndHorses = {
      [key: string]: boolean | string
    }
    // Mapping Types
    type CreateMutable<Type> = {
      -readonly [Property in keyof Type]: Type[Property];
    };
    type LockedAccount = {
      readonly id: string;
      readonly name: string;
    };
    type UnlockedAccount = CreateMutable<LockedAccount>;

### 字符串相关

    Uppercase<StringType>
    Lowercase<StringType>
    Capitalize<StringType>  // 首字母大写
    Uncapitalize<StringType> // 首字母小写

    type Greeting = 'hello world'
    type TEST = Uppercase<Greeting>


### Classes


### 装饰器


    