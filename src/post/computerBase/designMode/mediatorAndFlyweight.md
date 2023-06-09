---
title: 5分钟速读系列-中介模式/享元模式/指令模式
date: "2022-11-04"  
tags: 设计模式
path: /2022-11-mediator
---

这个系列是[Improve how you architect webapps](https://www.patterns.dev/)上文章的读书笔记。

## 中介模式
中介模式用中介对象来封装一系列的对象交互，中介者使各对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互。聊天室就是一个很好的中介模式，用户通过接口与聊天室对接就可以完成跟其他用户的聊天。


    class ChatRoom {
        // 中介者封装的对象交互逻辑，需要关注对交互逻辑的封装，减少复杂度
        logMessage(user, message) {
            const sender = user.getName();
            console.log(`${new Date().toLocaleString()} [${sender}]: ${message}`);
        }
    }
    class User {
        constructor(name, chatroom) {
            this.name = name;
            this.chatroom = chatroom;
        }

        getName() {
            return this.name;
        }
        // 对象直接与中介对接，不需要感知交互对象的细节(交互细节封装到中介中)
        send(message) {
            this.chatroom.logMessage(this, message);
        }
    }
    const chatroom = new ChatRoom();
    const user1 = new User("John Doe", chatroom);
    const user2 = new User("Jane Doe", chatroom);
    user1.send("Hi there!");
    user2.send("Hey!");

前端的MVC/MVP/MVVM架构都可以理解是中介模式的一种扩展，中介实现UI与数据的交互逻辑(渲染/绑定等)

## 享元模式
享元模式以共享的方式高效的支持大量的细粒度对象，能有效的避免大量相同对象创建的开销。这里以书店的书为例子，书店的书同一本有多本库存，在维护图书库存的时候，就可以通过享元模式利用之前创建的书实例来创建新的书实例。

    // 存储享元模式的Map结构
    const books = new Map();
    const createBook = (title, author, isbn) => {
        const existingBook = books.has(isbn);
        if (existingBook) {
            // 已存在就查找返回
            return books.get(isbn);
        }
        // 不存在新建返回
        const book = new Book(title, author, isbn);
        books.set(isbn, book);
        return book;
    };
    //  存储书的列表
    const bookList = [];
    const addBook = (title, author, isbn, availability, sales) => {
        const book = {
            // 利用之前的共享对象创建新的实力
            ...createBook(title, author, isbn),
            sales,
            availability,
            isbn
        };
        bookList.push(book);
        return book;
    };

### 享元模式跟单例模式的区别  
* 单例模式确保某个类只有一个实例并且这个实例是全局访问的。单例模式是对象创建型模式
* 享元模式中一个类可以创建多个对象，对象可以被多处代码引用共享

## 指令模式
指令模式是一种行为型模式，通过将处理逻辑封装到命令中传递给调用对象，调用对象负责匹配相应的处理对象并执行指令。指令模式的优点是解耦合，可以方便的在系统中加入新的指令。缺点是容易产生过多的命令类和重复代码。下面以订餐中订单、查询订单、取消订单的例子来解释指令模式。


        // 指令调用对象 负责为指令匹配需要处理的对象和执行指令
        class OrderManager {
            constructor() {
                // 指令处理的对象
                this.orders = [];
            }

            execute(command, ...args) {
                // 匹配指令和指令处理的对象
                return command.execute(this.orders, ...args);
            }
        }
        // 指令创建类
        class Command {
            constructor(execute) {
                this.execute = execute;
            }
        }
        // 生成订单指令 预置了参数以便指令调用对象传入需要处理的对象
        function PlaceOrderCommand(order, id) {
            return new Command(orders => {
                orders.push(id);
                return `You have successfully ordered ${order} (${id})`;
            });
        }
        const manager = new OrderManager();
        manager.execute(new PlaceOrderCommand("Pad Thai", "1234"));



