// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ChatWebview } from "./chatWebview";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
// 插件的入口函数, 当插件第一次加载时会执行activate
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "chat" is now active!');

	// // The command has been defined in the package.json file
	// // Now provide the implementation of the command with registerCommand
	// // The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('chat.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from chat!');
	// });

	// context.subscriptions.push(disposable);

	// 实现侧边栏的初始化
	// 实例化一个chatWebview
	const chatWebview = new ChatWebview();
	// 注册webview 到id为 Chat-sidebar 的views中，这个id为 Chat-sidebar 的视图我们稍后会在
	// package.json 中声明，先理解为我们要把iframe渲染在那个地方（侧边栏还是标签页）需要在
	// packagea.json 中控制
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider("Chat-sidebar", chatWebview, {
		webviewOptions: {
			// 这是一个比较有用的配置项，可以确保你的插件在不可见时不会被销毁，建议开启，否侧每次打开都会重新加载一次插件
			retainContextWhenHidden: true,
		},
		})
	);
	// 这里实现了一个简单的功能，在vscode打开的文件中，选中代码时会实时展示在web页面上
	// 监听用户选中文本事件
	vscode.window.onDidChangeTextEditorSelection((event) => {
		const editor = event.textEditor;
		let document = editor.document;
		let selection = editor.selection;
	// 获取当前窗口的文本
		let text = document.getText(selection);
		// 上文提到chatWebview可能为null 因此需要可选链写法，所以这里存在不稳定性，不过测试没问题~
		chatWebview?.webview?.webview.postMessage({
		// 第一次postMessage，下一次在chatWebview文件的iframe中 
		command: "vscodeSendMesToWeb",
		data: text,
		});
	});
}

// This method is called when your extension is deactivated
export function deactivate() {}

