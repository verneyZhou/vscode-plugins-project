"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatWebview = void 0;
// 采用面向对象的方式实现一个 ChatWebview 类
class ChatWebview {
    // 写一个public变量，方便对象引用创建后的webview实例，但是可能存在还未完全解析完成时，访问值为null
    // 看了vscode api发现，resolveWebView 返回一个 Thenable，可以在解析完成后拿到webview实例
    // 但是这个函数是在webview容器第一次显示时自动执行，不需要手动调用，不知道怎么拿到Thenable
    webview = null;
    resolveWebviewView(webviewView) {
        this.webview = webviewView;
        webviewView.webview.options = {
            enableScripts: true, // 在 webview 允许脚本
        };
        // 监听web端传来的消息
        webviewView.webview.onDidReceiveMessage((message) => {
            console.log('=======onDidReceiveMessage', message);
            switch (message.command) {
                case "WebSendMesToVscode":
                    // 实现一个简单的功能，将web端传递过来的消息插入到当前活动编辑器中
                    // let editor = window.activeTextEditor;
                    // editor?.edit((edit) => {
                    //   let position = editor?.selection
                    //     ? editor?.selection.start
                    //     : new Position(0, 0);
                    //   edit.insert(position, message.data);
                    // });
                    return;
            }
        }, undefined);
        // webview 展示的内容本身就是嵌套在一个iframe中，因此在此html中再嵌套一个iframe时，需要传递两次postMessage
        webviewView.webview.html = `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
        html,
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background-color:#000000;
            overflow:hidden;
        }
        .webView_iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        .outer{
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
      </style>
    </head>
    <body>
      <script>
      
      console.log('Hello from the webview!');
      // 向vscode 传递消息的固定写法, vscode 为我们封装好了postMessage
      // acquireVsCodeApi: 内置函数，可以访问 VS Code API 对象
      const vscode = acquireVsCodeApi();
      // 接收来自web页面的消息
      window.addEventListener('message', event => {
          const message = event.data;
          switch (message.command) {
               // 插件传递消息给web端
              case 'vscodeSendMesToWeb':
                  let iframe = document.getElementById('WebviewIframe')
                  WebviewIframe.contentWindow.postMessage(message, "*")
                  console.log("fromWebViewIframe: "+message.data)
                  break;
              // web端发送消息给插件
              case 'WebSendMesToVscode':
                    vscode.postMessage(message);
                    break;
          }
      });

     </script>
        <div class="outer">
           <iframe id='WebviewIframe' class="webView_iframe" sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-downloads" allow="cross-origin-isolated; clipboard-read; clipboard-write;" src="http://localhost:5173/"></iframe>
        </div>
    </body>
    </html>
    `;
    }
}
exports.ChatWebview = ChatWebview;
//# sourceMappingURL=chatWebview.js.map