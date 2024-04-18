---
title: react hooks过多，你需要这个eslint插件
date: "2024-04-18"
tags: 工程化
path: /eslit-plugin
---

在[板凳快报4月](https://icantunderstand.github.io/blog/2024-4-1)中聊到了react组件中hooks的使用泛滥问题，当hooks使用过多会有如下的问题:
* 代码阅读性差，逻辑分散 
* 性能差 过多的hooks更新会导致页面多次渲染，
* hooks之间的依赖耦合增加  本身hooks的依赖就已经很难治理，hooks之间的依赖更加不可控。  

在思考这个怎么解决这个问题的时候，希望可以通过规则限制的解法来解，因为只有可定义的规则才能在长期的代码维护中一直比较好的运行，在规则与人工review的结合下就能比较好的实现代码的长期治理。本文内容主要基于此，介绍eslint插件的开发过程和react hooks数量限制插件的使用

## 开发eslint插件

### 生成插件项目
eslint提供了生成插件的工具[generator-eslint](https://github.com/eslint/generator-eslint)


    // 安装全局依赖
    npm i -g yo
    npm i -g generator-eslint

    // 进入到插件目录，生成插件模版
    cd testPlugin
    yo eslint:plugin

![创建文件](./frontEndToolStatic/eslitPlugin/createFolder.png)

### 开发调试
在创建的文件夹中，在rules中增加自定义的规则。在这里我们要限制hooks的数据，添加了no-too-many-hooks.js,内容如下:

    "use strict";
    module.exports = {
        meta: {
            docs: {
                // 规则描述
                description: "no too many hooks",
                category: "",
                recommended: false
            },
            fixable: null,  // or "code" or "whitespace"
            // 规则的参数配置 这里设置了两个参数 list代表要关注的hooks列表，numLimit代表限制的数目
            schema: [
                {
                    type: "object",
                    properties: {
                    list: {
                        type: "array",
                    },
                    numLimit: {
                        type: "number"
                    }
                    },
                    additionalProperties: false,
                },
            ],
            // 报错信息描述
            messages: {
                hooksLimit: "too many hooks you called",
            },
        },

        create: function(context) {
            // 累积的hooks数目
            let currentNum = 0
            return {
                // 解析ast的节点 可以通过[astexplorer](https://astexplorer.net/)来查看对应的节点
                'CallExpression Identifier': (node) => {
                    // 获取当前的配置
                    const options = context.options[0] || {}
                    const list = options.list || ['useState']
                    const numLimit = options.numLimit || 5
                    // 命中 当前是hook调用
                    if (list.includes(node.name)) {
                        // 累积数自增
                        currentNum++
                        // 当前的累积数大于等于配置的数据 报错 匹配到too many hooks you called
                        if(currentNum >= numLimit) {
                            context.report({
                                node,
                                messageId: 'hooksLimit'
                            });
                        }
                        
                    }
                },
            };
        }
    };

在入口文件中导出规则

    "use strict";
    module.exports = {
        rules: {
            // 规则名字
            'no-too-many-hooks': require('./rules/no-too-many-hooks'),
        },
        configs: {
            // 定义推荐用法 在使用的时候可以通过recommended或者自己添加当前rule的规则来设定
            recommended: {
                rules: {
                    'hooks-limit/no-too-many-hooks': [1, { list: ["useEffect", "useState", "useCallback"], numLimit: 5 }], // 可以省略 eslint-plugin 前缀
                },
            },
        },
    };


在开发过程中，需要不断调试当前代码是否生效，可以通过npm link的方式，在插件的目录执行

    npm link  

在需要使用插件的目录执行

    npm link eslint-plugin-hooks-limit(定义的插件名字)


## [eslint-plugin-hooks-num-limit](https://www.npmjs.com/package/eslint-plugin-hooks-limit)

### 安装插件

    // 安装eslit
    npm i eslint --save-dev
    // 安装插件
    npm install eslint-plugin-hooks-limit --save-dev

    // 在项目的eslint配置中加入配置 这里设置2个hooks的调用触发eslint的waring
    {
        "extends": [
            "next/core-web-vitals",
            "plugin:eslint-plugin-hooks-limit/recommended"
        ],
        "plugins": [
            "hooks-limit"
        ],
        "rules": {
            "hooks-limit/no-too-many-hooks": [2, { "list": ["useEffect", "useState"], "numLimit": 2 } ] // 可以省略 eslint-plugin 前缀
        }
    } 

假设react组件中有这样一段代码:

     useEffect(() => {
        console.time();
    }, [])
    useEffect(() => {
        console.time();
    }, [])

这个时候运行项目的lint脚本
![lint报错信息](./frontEndToolStatic/eslitPlugin/linInfo.png)

---
ps: lint插件写的比较简单，大家可以自己根据代码自己修改使用
---
    
       



