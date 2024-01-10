
import * as vscode from 'vscode';
import fs from 'fs';

// 插件激活时触发，所有代码总入口
export function activate(context: vscode.ExtensionContext) {

	console.log('file state 插件已经被激活');

    // 注册命令
    let commandOfGetFileState = vscode.commands.registerCommand('getFileState', uri => {

        console.log('uri', uri);
        // 文件路径
        const filePath = uri.path.substring(1);
        fs.stat(filePath, (err, stats) => {
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


export function deactivate() {}



function getDate() {
    let day = new Date();
    // day.setTime(day.getTime() + 24 * 60 * 60 * 1000);
    const weekMap: any = {1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6:'六', 0: '日', 7: '日'};
    const week = weekMap[day.getDay()];
    let date = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()} ${day.getHours()}:${day.getMinutes()}:${day.getSeconds()} 周${week}`;
    return date;
}
