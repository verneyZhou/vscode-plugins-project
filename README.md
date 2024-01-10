





# vscode-chat-plugin



> node v16+


[VSCode插件开发笔记]()



[vscode官方插件开发文档](https://code.visualstudio.com/api/get-started/your-first-extension)



``` sh
? What type of extension do you want to create? New Extension (TypeScript)
? What's the name of your extension? chat
? What's the identifier of your extension? chat
? What's the description of your extension? chat plugin
? Initialize a git repository? Yes
? Bundle the source code with webpack? No
? Which package manager to use? npm
```



## 插件项目初始化


``` json
// chat/package.json

"engines": {
    "vscode": "^1.75.0" // 这里设置的版本号需要比当前vscode版本低
},
"contributes": {
    "commands": [
        {
            "command": "chat.helloWorld",
            "title": "Hello World"
        }
    ]
},
```

- `fn + F5`； `vscode 扩展开发`; `cmd + shift + P`，输入：`Hello World`



## 前端项目初始化


npm create vite@latest

npm install

npm run dev



``` json
// "contributes": {
//     "commands": [
//       {
//         "command": "chat.helloWorld",
//         "title": "Hello World"
//       }
//     ]
// },
"contributes": {
    "commands": [],
    "viewsContainers": {
      "activitybar": [
        {
          "id": "Chat-sidebar-view",
          "title": "Chat",
          "icon": "images/vite.svg"
        }
      ]
    },
    "views": {
      "Chat-sidebar-view": [
        {
          "type": "webview",
          "id": "Chat-sidebar",
          "name": " Chat",
          "icon": "images/vite.svg",
          "contextualTitle": "Chat"
        }
      ]
    }
},

```