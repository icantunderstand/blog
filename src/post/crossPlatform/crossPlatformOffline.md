---
title: 一起学跨端技术-离线包
date: "2021-07-22"
tags: 跨端技术
path: /cross-platform-offline
---

在[一起学跨端技术-Webview缓存](https://icantunderstand.github.io/blog/webview-store)中介绍了几种常用的缓存实现方案，几种方案都各有优缺点。其实h5页面加载过程可以类比成CPU在运行时动态获取数据，从寄存器中读取数据对比从磁盘中读取数据的时间是相差极大的。那h5页面加载的时候有没有一种方案可以绕过耗时较大的网络获取数据阶段直接加载内容展示呢？离线化就是这种解决方案。通过离线包的动态下发可以让用户在打开页面的时候直接加载已经在app中存储的离线化资源从而加速页面的展示。本文从以下两个方面介绍离线包的实现过程:
* 离线包分发过程
* 端内加载离线包过程

## 离线包分发过程
离线包的分发流程如下图:
![分发](./crossPlatformStatic/crossPlatformOffline/broadcast.png)  
分发流程中主要涉及4种角色:
* 离线配置平台 配置平台可以提供离线配置能力、离线包管理(上传、禁用、清空)、离线包使用统计、离线包准入审核(自动(包大小限制)+人工(解决特殊case))
* 离线配置服务 配置服务主要提供服务层能力，实现离线配置服务，离线包更新服务，离线资源上传下载服务、离线资源使用统计服务
* 离线SDK 端内接入离线SDK，SDK主要与离线配置服务进行交互，完成离线资源的管理和接入配置能力
* Native侧  实现拦截请求在特定的协议下接入离线资源
## 离线包加载过程
离线包的加载流程如下图: 
![加载](./crossPlatformStatic/crossPlatformOffline/load.png)
在端加载离线资源的过程中可以分为两个方面:
* 离线SDK更新离线配置和离线资源 离线SDK通过与离线配置服务交互完成离线配置和离线包资源更新
* Web容器加载离线资源  
下面从代码层面简单介绍下加载离线资源的实现

### 离线配置
离线需要有一定的配置能力，比如禁用、特定的前缀支持离线化等。通过对离线配置的解析，Web容器就知道在打开对应页面是否的具体行为。这个过程是约定协议的过程。
### 加载离线资源
在[Hybrid开发-JSBridge原理](https://icantunderstand.github.io/blog/jsbridge)中通过拦截请求在特定的协议下可以实现javascript和Native的通信，那么在特定的协议下其实也可以实现离线包的加载能力。

    // 定义请求资源类型映射
    private HashMap<String, String > resourceMimeTypeMap  = new HashMap<String, String>();
    public CustomWebViewClient() {
        super();
        resourceMimeTypeMap.put("html", "text/html");
        resourceMimeTypeMap.put("js", "application/javascript");
    }
    @Override
    public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
        // 处理jsb 协议情况  只拦截jsb协议的url 其他放行
        Uri uri = request.getUrl();
        String scheme = uri.getScheme();
        String host = uri.getHost();
        String path = uri.getPath();
        // 处理资源加载离线包场景
        // 协定 域名为www.test.com 且 path是local的走加载离线包逻辑
        if(host.equals(new String("www.test.com")) && path.startsWith("/local")) {
            InputStream in = null;
            String pageNamePath = path.split("/")[2];
            String type = pageNamePath.split("\\.")[1];
            String mimeType = "text/plain";
            if(resourceMimeTypeMap.containsKey(type)) {
                mimeType = resourceMimeTypeMap.get(type);
            }
            try {
                // 加载本地离线资源
                in = view.getContext().getAssets().open(pageNamePath);
            } catch(IOException e) {
              // 处理处理本地无离线资源 请求网络
              return super.shouldInterceptRequest(view, request);
            }
            // 将本地读取的的内容进行类型映射后通过WebResourceResponse返回
            WebResourceResponse response = new WebResourceResponse(mimeType, "utf-8", in);
            return response;
        }
        return super.shouldInterceptRequest(view, request);
    }

![成功加载离线资源](./crossPlatformStatic/crossPlatformOffline/loadsuccess.png)