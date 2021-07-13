---
title: 容器学习笔记
date: 2021-1-12 15:30:00  
tags: 
categories:
---

一句话概括容器  由namespace Cgroups  rootfs(联合文件系统)构建出来的进程隔离环境

运行的容器
1. 挂载在/var/lib/docker/aufs/mnt上的rootfs 容器镜像(Container Image) 容器的静态视图
2. 由namespace + Cgroups 构成的隔离环境 动态视图
cgroups  namespaces   所有容器共享内核

1. 启用 Linux Namespace 配置；
2. 设置指定的 Cgroups 参数；
3. 切换进程的根目录（Change Root） 


## Kubernetes

![kubernetes架构](container/kubenetes.png) 

Master节点:  
1. apiserver 
2. 调度的scheduler
3. 编排的controller manager

计算节点
kubelet提供CRI(Container Runtime Interface), 

### pod
Pod是共享了某些资源的容器组，共享同一个Network NameSpace或者同一个volume(pod扮演着传统环境里'虚拟机'的角色).
pod的实现方式
![pod](container/pod.png) 
它们可以直接使用 localhost 进行通信；
它们看到的网络设备跟 Infra 容器看到的完全一样；
一个 Pod 只有一个 IP 地址，也就是这个 Pod 的 Network Namespace 对应的 IP 地址；当然，其他的所有网络资源，都是一个 Pod 一份，并且被该 Pod 中的所有容器共享；
Pod 的生命周期只跟 Infra 容器一致，而与容器 A 和 B 无关

#### pod的状态
1. pending pod的yaml文件已经交给Kubernetes, api对象已经创建并保存到etcd中
2. Running pod已经调度成功，它所包含的容器都已经创建成功并且至少有一个正在运行中
3. Succeeded Pod所有容器都正常运行完毕退出，只有在一次性任务时最为常见
4. Failed Pod里面至少有一个容器以不正常状态退出
5. Unknown pod的状态不能持续的被kubelte汇报给kube-apiserver， 有可能通信出现了问题


需要把机器跑起来 跟着例子走一下流程

### Kubenetes 部署
kubeadm  把这个部署的流程在阿里云上跑一下