---
title: docker入门
date: "2019-04-28"
tags: 工程化
path: /docker
---
## 为什么使用容器技术
  在传统的软件部署方式中，开发者需要在不同的主机之前同步配置来确保应用运行环境的一致性。通过容器技术能有效的优化集群环境的部署，极大的改变软件开发和发布的方式。下面从容器与传统的虚拟化技术对比来揭开容器的面纱。
### docker与传统的虚拟机方案的对比  
  ![different](./frontendtoolstatic/docker/different.png)  

  1. 传统的虚拟机技术主要通过虚拟机监控器完成虚拟操作系统和宿主操作系统之间的交互.docker容器直接与宿主系统通信，减少了语言转换的过程,因此在启动速度和运行效率上更胜一筹.
  2. 容器技术更加偏向于程序的移植和依赖的打包而虚拟机技术则是侧重于完全的虚拟出一个另一个虚拟环境。 
  3. docker能提供更快的交付过程.通过合理的对宿主操作系统资源的划分,能有效地提高系统的资源利用率。  

## 核心技术介绍
### namespace(隔离)
通过NameSpace技术可以修改容器的视图.

    int clone(int (*fn)(void *), void *child_stack, int flags, void *arg);

在linux中可以通过系统调用clone来创建新的进程,当第三个参数flags指定CLONE_NEWNS就会在新的namespace下启动新进程.  
![namespace](./frontendtoolstatic/docker/namespace.png)  
在上面的例子中系统本身有已经运行的很多进程,通过运行镜像并且执行bin/sh进程可以进入容器的交互界面.在容器中只能看到root进程和ps进程.这样通过namespace技术就实现了不同进程间的隔离.

### Control Groups(限制)
namespace创建的进程与其他进程之前对主机的资源是竞争关系的.Linux Control Group技术就是限制进程组能够使用资源上限的一种技术.通过对容器使用资源的上线进行设置能有效地使用主机的资源和防止资源的过渡占用。

### 联合文件系统(Union File System)
联合文件系统可以同时挂载不同的实际文件或者目录到同一目录.Docker基于联合文件系统提出AUFS(Advanced Union File System).AUFS通过将新的镜像层挂载到老的镜像层之上,通过共享基础镜像和增量更新可以使docker的镜像管理更加快速。
## docker核心概念介绍
### 镜像
镜像是封装了虚拟环境的运行内容的文件包,docker通过利用AUFS实现了增量的镜像结构.
### 容器
容器是隔离的虚拟环境,里面运行着docker镜像.容器有以下的运行状态:  

| 状态 | 含义 |
| - | :-: |
| Created | 容器已经被创建资源已经就绪,应用程序未运行 |
| Running | 容器中的应用容器处于运行中 |
| Paused  | 容器暂停 |
| Stopped | 容器停止 |
| Deleted | 容器被删除,占有的资源以及资源的的管理信息已经被删除|
### 数据卷 
docker运行时的持久化目录,通过将外部目录挂载到容器中,来实现数据的持久化.

### docker engine
![dockerEngine](./frontendtoolstatic/docker/dockerEngine.png)
docker engine是负责启动镜像的服务,通过docker client提供的指令调用docker server提供的接口来实现对镜像和容器的操作.

## 使用镜像

### 启动指令

    docker run --name nginx -p 80:80 -d nginx // --name 执行容器名 -p 宿主端口:容器端口 将宿主端口映射到容器的端口 -d 后台的方式启动 

    docker run --name myredis redis
    docekr run --name test --link  myredis:redis debian  // --link Container:Alias 目标容器的名称:目标容器的别名 建立容器之间的链接

### 操作容器指令

    docker ps -a // 查看所有的容器  
    docker images // 查看所有本地镜像 
    docker stop name/ID  // 停止某个容器 
    docker rm name/ID // 删除容器
    docker rm $(docker ps -aq) // 删除所有容器
    docker rmi $(docker images -q) // 删除所有本地镜像

### 使用docker创建一个hello world应用

#### 编写程序文件
创建一个目录结构如下:  
![category](./frontendtoolstatic/docker/category.png)  
在index.py中编写程序的主要功能如下:  

    from flask import Flask
    app = Flask(__name__)

    @app.route('/')
    def hello_world():
      return 'Hello world\n'

    if __name__ == '__main__':
      app.run(debug=True,host="0.0.0.0") // 创建一个服务 在/路径下返回Hello world

#### 编写Dockerfile
镜像的构建可以通过Dockerfile和构建环境的上下文来完成.通过Dockerfile可以将镜像的构建过程持久化.  
  
    From python:3.4 // 从某一个基础镜像开始 From语句必须是Dockerfile的第一条语句
    Run pip install Flask==0.10.1 // 执行指定的指令  由于每次执行的执行都会行成新的镜像层,可以将多个指令进行合并
    WORKDIR /app // 执行Dockerfile指令执行的工作目录
    COPY app /app  // src dest 这个指令将上下文的app目录复制到容器的app目录
    CMD python index.py // 容器启动时执行的指令

#### 构建镜像和启动容器

    docker build -t hello . //在当前目录的上下文上构建镜像
    docker run --name haha -p 5000:5000 hello // 以haha容器名字启动helloword镜像 并且将容器的5000端口映射到外部的5000端口

![run](./frontendtoolstatic/docker/run.png)



