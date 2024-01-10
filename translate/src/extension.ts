// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// 这里执行插件被激活时的操作
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "translate" is now active!');

	// 注册命令：translate.helloWorld，该命令需在 pkg 已经被定义
	// 当执行 translate.helloWorld 命令时，会触发后面的回调函数
	let disposable = vscode.commands.registerCommand('translate.helloWorld', () => {
		// 触发了一个弹出框
		vscode.window.showInformationMessage('Hello World from translate!');
	});
	// 把这个对象放入上下文中, 使其生效
	context.subscriptions.push(disposable);
}

// 插件被销毁时调用的方法, 比如可以清除一些缓存, 释放一些内存
export function deactivate() {}
