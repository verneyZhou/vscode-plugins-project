





# VSCode-Chat-Plugin


vscode插件~


> node v16+


[VSCode插件开发笔记]()



[vscode官方插件开发文档](https://code.visualstudio.com/api/get-started/your-first-extension)




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