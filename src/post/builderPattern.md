---
title: 编程拾遗系列设计模式-创建型模式
date: 2020-7-6
tags: 计算机基础
path: /build-pattern
---

## 为什么开启设计模式系列
在业务压力下，仓库的代码量是快速增长的。最近在思考如何能让代码有灵活性和扩展性。随着产品的迭代，一部分业务逻辑需要重新实现，那一种良好的设计是否能在重构代码中帮助我们呢？答案是确定的。开启这个系列主要有这两方面的原因:
1. 在翻译业务的时候更高效和优雅
2. 通过对模式的学习能加强思考  

设计模式是解决一类问题的通用的方案，希望通过对设计模式的学习能完善解决问题的能力，本系列会结合《设计模式-可复用面向对象软件的基础》来对设计模式进行比较全面的梳理。

## 创建型模式
创建型模式通过对实例化过程进行抽象，隐藏了底层的具体实现，从而实现更多的灵活性。创建型模式有以下几种:
1. Abstract Factory(抽象工厂)
2. Builder(生成器)
3. Factory Method(工厂方法)
4. Prototype(原型)
5. Singleton(单例)  

本文会结合一个创建迷宫的示例来介绍以上几种设计模式.通常实现一个迷宫会定义以下基类:  
 
    // 方向枚举
    enum Direction { North, South, East, West };
    // 迷宫组件的公用抽象类
    class MapSite {
      public: virtual void Enter() = 0;
    }  
    // 房间  保存其他MapSite的引用
    class Room: public MapSite {
      public: 
        Room(int roomNo);
        MapSite* GetSide(Direction) const;
        void SetSide(Direction, MapSite*)
      private:
        MapSite* _sides[4];
        int _roomNumber;
    }  
    // 墙 
    class Wall : public MapSite {
      public: 
        Wall();
        virtual void Enter();
    }
    // 门
    class Door : public MapSite {
      public: 
        Door(Room* = 0, Room*  = 0);
        virtual void Enter();
        Room* OthersSideFrom(Room*);
      private: 
        Room* _room1;
        Room* _room2;
        bool _isOpen;
    }
    // 迷宫类
    class Maze {
      public: 
        Maze();
        // 在迷宫中添加Room
        voidb AddRoom(Room *);
        // 根据RoomNo查找Room
        Room* RoomNo(int) const;
      private:
    }
    // 一个可能的迷宫生成代码
    Maze* MazeGame::CreateMaze() {
      Maze* aMaze = new Maze();
      Room* r1 = new Room();
      Room* r2 = new Room();
      Door* theDoor = new Door(r1,r2);
      aMaze->AddRoom(r1);
      aMaze->AddRoom(r2);
      r1.SetSide(North, new Wall);
      r2.SetSide(North, new Wall);
      // 省略很多的SetSide操作
      return aMaze
    }

上面代码在定义迷宫布局的时候对布局过程进行了硬编码，在未来需要对迷宫布局进行修改的时候就需要修改硬编码逻辑。通过创建型模式可以实现将实现的细节封装起来，给予代码一定的可变化性。

### Abstract Factory(抽象工厂) - 对象创建型模式
抽象工厂提供一个创建一系列相关或相互依赖对象的接口而无需指定他们具体的类。
#### 结构
![抽象工厂结构](./builderPattern/abstractFactory.png)

* AbstractFactory  
声明一个创建抽象产品对象的操作接口
* ConcreteFactory  
实现创建具体产品对象的操作
* AbstractProduct  
为一类产品对象声明接口
* ConcreteProduct  
定义一个将被相应具体工厂创建的产品对象，实现AbstractProduct接口
* Client  
仅使用由AbstractFactory和AbstractProduct类声明的接口  

#### 适用性
抽象工厂通过将具体的对象创建延迟到ConcreteFactory中，能提供丰富的灵活性，适用于以下场景:
1. 一个系统要独立于它的产品的创建，组合和表示时
2. 一个系统要由多个产品系列中的一个来配置时
3. 需要对一系列相关产品对象设计进行联合使用时
4. 对外提供产品类库，提供统一的接口  

#### 优点&缺点

* 分离了具体类的实现，通过具体工厂封装对具体产品实现的细节。
* 通过具体工厂的实现，将具体产品的实现逻辑封装在一起，增加了整体的一致性。但是在增加新的种类的产品的时候需要实现新的具体工厂。

#### 代码示例
下面的代码使用Abstract Factory模式来创建一个迷宫。

    // 定义抽象方法类
    class MazeFactory {
      public: 
        MazeFactory()
      
      virtual Maze* MakeMaze() const { return new Maze; }
      virtual Wall* MakeWall() const { return new Wall; }
      virtual Room* MakeRoom(int n) const { return new Room(n); }
      virtual Door* MakeDoor(Room* r1, Room* r2) { return new Door(r1, r2); }
    }
    // 通过传递具体的工厂实现迷宫的创建
    Maze* MazeGame::CreateMaze(MazeFactory& factory) {
      Maze* aMaze = factory.MakeMaze();
      Room* r1 = factory.MakeRoom(1);
      Room* r2 = factory.MakeRoom(2);
      Door* aDoor = factory.MakeDoor(r1, r2);
      aMaze->AddRoom(r1);
      aMaze->AddRoom(r2);
      
      r1.SetSide(North, factory.MakeWall())
      r2.SetSide(North, factory.MakeWall());
      // 省略很多的SetSide操作
      return aMaze;
    } 

    // 创建过程
    MazeGame game;
    MazeFactory factory
    game.CreateMaze(factory)

通过传递ConcreteFactory,上面的代码将创建逻辑都封装在具体工厂中，这样通过传递不同的工厂就能完成不同类型对象的创建。

### Builder(生成器) - 对象创建型模式
将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。Builder模式能更好的封装产品的内部表示。
#### 结构  
![生成器结构](./builderPattern/builder.jpg)  

* Builder 
为创建一个Product对象的各个部件指定抽象接口
* ConcreteBuilder  
实现Builder的接口来完成对象的创建
定义并明确它所创建的表示
提供一个检索产品的接口
* Director 
构建一个使用Builder的接口对象
* Product  
被构造的复杂对象

抽象的Builder类为Director要创建的对象定义操作。ConcreteBuilder实现Builder定义的方法

#### 适用性
通过生成器可以把复杂的对象创建过程隐藏，通过不同的Builder来完成系统的创建, 适用于以下场景：
1. 当创建复杂对象的算法应该独立于该对象的组成部分以及它们的装配方式时
2. 当构造过程必须允许被构造的对象有不同的表示时

#### 示例代码

    class MazeBuilder {
      public:
        virtual void BuildMaze() {};
        virtual void BuildRoom(int room) {};
        virtual void BuildDoor(int roomFrom, int roomTo) {};
        virtual Maze* GetMaze() { return 0  };
      protected: 
        MazeBuilder();
    }
    // 在具体调用的时候 可以传递一个实现了抽象类builder的ConcreteBuilder
    Maze* MazeGame::CreateMaze(MazeBuilder& builder) {
      builder.BuildMaze();
      builder.BuildRoom(1);
      builder.BuildRoom(2);
      builder.BuildDoor(1,2);
      return builder.GetMaze();
    }

    // 创建过程
    Maze* maze
    MazeGame game
    MazeBuilder builder
    maze = game.CreateMaze(builder)

对比抽象工厂,Builder模式封装了创建过程的细节，通过不同的builder实现可以创建出不同的对象。

### Factory Method(工厂方法) - 对象创建型模式
工厂方法定义一个用于创建对象的接口，让子类来实现对应的接口来创建对象。Factory Method使一个类的实例化延迟到其子类。
#### 结构
![工厂方法](./builderPattern/factoryMethod.png)

* Product  
定义工厂方法所创建对象的接口(抽象产品)  
* ConcreateProduct  
实现Product的接口(具体产品)
* Creator  
声明工厂方法(抽象工厂)
* ConcreteCreator  
实现工厂方法，返回ConcreateProduct实例

工厂方法依赖它的子类来实现工厂方法来完成对象的创建。

#### 适用性
工厂方法适用于以下场景:
1. 父类不知道它需要创建的对象的类的时候  
2. 当一个类希望它的子类来指定创建对象的时候
3. 当类将创建对象的职责委托给多个帮助子类中的某一个并且希望某一个帮助子类代理这个创建过程

#### 示例代码

    class MazeGame {
      public: 
        Maze* CreateMaze();

        // factory method;
        virtual Maze* MakeMaze() const { return new Maze(); };
        virtual Room* MakeRoom(int n ) const { return new Room(n); };
        virtual Wall* MakeWall() const { return new Wall; };
        virtual Door* MakeDoor(Room* r1, Room* r2) const { return new Door(r1,r2);  };  
    }

    Maze* MazeGame::CreateMaze() {
      Maze* aMaze = new Maze();
      Room* r1 = new Room();
      Room& r2 = new Room();
      Door* theDoor = new Door(r1,r2);
      aMaze->AddRoom(r1);
      aMaze->AddRoom(r2);
      r1.SetSide(North, new Wall);
      r2.SetSide(North, new Wall);
      // 省略很多的SetSide操作
      return aMaze
    }
    // 子类实现工厂方法来完成对象的创建
    class BombedMazeGame : public MazeGame {
      public:
        BombedMazeGame()
        virtual Room* MakeRoom(int n) const  { return new RoomWithBomb(n); };
    }

### PROTOTYPE（原型) - 对象创建型模式
原型模式通过原型实例指定创建对象的种类，通过拷贝原型来创建新的对象
#### 结构  
![原型方法](./builderPattern/prototype.png)

* Prototype  
声明一个克隆自身的接口  
* ConcretePrototype  
实现一个克隆自身的操作
* Client  
让一个原型克隆自身从而创建一个新的对象

#### 适用性
原型模式适用于以下场景:  
1. 实例化的类需要在运行时刻指定
2. 类的实例状态是相似的，通过原型的克隆能减少类的创建  

#### 示例代码

    class MazePrototypeFactory : public MazeFactory {
      public :
        MazePrototypeFactory(Maze* , Wall*, Room*, Door*);

        virtual Maze* MakeMaze() const;
        virtual Room* MakeRoom(int) const;
        virtual Wall* MakeWall() const;
        virtual Door* MakeDoor(Room*, Room*) const;

      private:
        Maze* _prototypeMaze;
        Room* _prototypeRoom;
        Wall* _prototypeWall;
        Door* _prototypeDoor;
    }

    MazePrototypeFactory::MazePrototypeFactory (
      Maze* m, Wall* w, Room* r,Door* d
    ) {
      _prototypeMaze = m;
      _prototypeRoom = r;
      _prototypeWall = w;
      _prototypeDoor = d;
    }

    Wall* MazePrototypeFactory::MakeWall() const {
      return _prototypeWall->Clone();
    }
    MazeGame game;
    // 需要初始化传入的实例支持clone操作，可以通过传递不同的实例完成不同的对象创建
    MazePrototypeFactory simpleMazeFactory(new Maze, new Wall, new Room, new Door);
    Maze* maze = game.CreateMaze(simpleMazeFactory)

### SINGLETON（单例）- 对象创建型模式
保证一个类仅有一个实例，并提供一个访问他的全局访问点
#### 结构
![单例模式](./builderPattern/singleton.jpg)

* Singleton
定义一个Instance操作，允许客户访问它的唯一实例

#### 适用性
单例模式适用于以下场景:
1. 唯一的实例需要全局访问时  

#### 示例代码

    class Singleton {
      public: 
        static Singleton* Instance();
      protected:
        Singleton();
      private:
        static Singleton* _instance;
    }

    Singleton* Singleton::_instance = 0;
    // 对成员初始化未空，第一次访问的时候创建成员，再次访问直接范返回成员
    Singleton* Singleton::Instance() {
      if(_instance == 0) {
        _instance = new Singleton();
      }
      return _instance;
    }

在单例模式中，想要实现动态的确定单例的类型方式，可以通过维护单例注册表的方式来实现。





