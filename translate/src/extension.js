"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
// 这里执行插件被激活时的操作
function activate(context) {
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
exports.activate = activate;
// 插件被销毁时调用的方法, 比如可以清除一些缓存, 释放一些内存
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map