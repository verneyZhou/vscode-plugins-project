import * as vscode from 'vscode';
import { ChatWebview } from "./chatWebview";

// 插件的入口函数, 当插件第一次加载时会执行activate
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "聊一下" is now active!');

	// 拿到配置文件中的文心一言的appkey和appSecret
	const config = vscode.workspace.getConfiguration("vscodeVnChat");
	const appKey = config.get("wenxinyiyanKey") as string;
	const appSecret = config.get("wenxinyiyanSecret") as string;

	// 实现侧边栏的初始化
	// 实例化一个chatWebview
	const chatWebview = new ChatWebview();
	// 注册webview 到id为 chat-sidebar-view 的views中，这个id为 chat-sidebar-view 的视图我们稍后会在
	// package.json 中声明，先理解为我们要把iframe渲染在那个地方（侧边栏还是标签页）需要在 packagea.json 中控制
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider("chat-sidebar-view", chatWebview, {
		webviewOptions: {
			// 这是一个比较有用的配置项，可以确保你的插件在不可见时不会被销毁，建议开启，否侧每次打开都会重新加载一次插件
			// retainContextWhenHidden: true,
		},
		})
	);

	// 把appkey和appSecret传递给webview
	setTimeout(() => {
		console.log('====setTimeout', appKey, appSecret);
		chatWebview?.webview?.webview.postMessage({
			command: "vscodeSendMesToWeb",
			data: {
				appKey,
				appSecret,
			},
			});
	}, 1500);
	// 这里实现了一个简单的功能，在vscode打开的文件中，选中代码时会实时展示在web页面上
	// 监听用户选中文本事件
	// vscode.window.onDidChangeTextEditorSelection((event) => {
	// 	const editor = event.textEditor;
	// 	let document = editor.document;
	// 	let selection = editor.selection;
	// // 获取当前窗口的文本
	// 	let text = document.getText(selection);
	// 	console.log('===onDidChangeTextEditorSelection', text);
	// 	// 上文提到chatWebview可能为null 因此需要可选链写法，所以这里存在不稳定性，不过测试没问题~
	// 	chatWebview?.webview?.webview.postMessage({
	// 	// 第一次postMessage，下一次在chatWebview文件的iframe中
	// 	command: "vscodeSendMesToWeb",
	// 	data: text,
	// 	});
	// });
}

// This method is called when your extension is deactivated
export function deactivate() {}
