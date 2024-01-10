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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const fs_1 = __importDefault(require("fs"));
// 插件激活时触发，所有代码总入口
function activate(context) {
    console.log('file state 插件已经被激活');
    // 注册命令
    let commandOfGetFileState = vscode.commands.registerCommand('getFileState', uri => {
        console.log('uri', uri);
        // 文件路径
        const filePath = uri.path.substring(1);
        fs_1.default.stat(filePath, (err, stats) => {
            console.log('====fs.stat', err, stats.isFile(), stats.isDirectory());
            if (err) {
                vscode.window.showErrorMessage(`获取文件时遇到错误了${err}!!!`);
            }
            if (stats.isDirectory()) {
                vscode.window.showWarningMessage(`检测的是文件夹，不是文件，请重新选择！！！`);
            }
            if (stats.isFile()) {
                const size = stats.size;
                const createTime = stats.birthtime.toLocaleString();
                const modifyTime = stats.mtime.toLocaleString();
                // vscode.window.showInformationMessage(`文件大小为:${size}字节;`);
                vscode.window.showInformationMessage(`
                    Hi, 上午好！
                    今天是：${getDate()}
                    又是元气满满的一天呢~~！！！💪🏻💪🏻😄😄🎉🎉

                    您选择的文件路径为:
                    ${filePath}
                    文件大小为: ${size}字节
                    文件创建时间为: ${createTime}
                    文件修改时间为: ${modifyTime}
                `, { modal: true });
            }
        });
        // const stats = fs.statSync(filePath);
        // console.log('stats', stats);
        // console.log('isFile', stats.isFile());
    });
    // 将命令放入其上下文对象中，使其生效
    context.subscriptions.push(commandOfGetFileState);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
function getDate() {
    let day = new Date();
    // day.setTime(day.getTime() + 24 * 60 * 60 * 1000);
    const weekMap = { 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 0: '日', 7: '日' };
    const week = weekMap[day.getDay()];
    let date = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()} ${day.getHours()}:${day.getMinutes()}:${day.getSeconds()} 周${week}`;
    return date;
}
//# sourceMappingURL=extension.js.map