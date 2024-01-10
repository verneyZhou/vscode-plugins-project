import * as vscode from "vscode";
import CryptoJS from "crypto-js"; // crypto加密
import axios from "axios"; // 接口请求
import querystring from "querystring";

export interface Word {
  key: string;
  value: string[];
}

// 字符串截取前10位和后10位
function truncate(q: string): string {
  var len = q.length;
  if (len <= 20) {
    return q;
  }
  return q.substring(0, 10) + len + q.substring(len - 10, len);
}

// 驼峰文本格式化: 例如：将helloWorld转换为hello World
function changeWord(text: string): string {
  if (!text.includes(" ") && text.match(/[A-Z]/)) {
    const str = text.replace(/([A-Z])/g, " $1");
    let value = str.substr(0, 1).toUpperCase() + str.substr(1);
    return value;
  }
  return text;
}


// 封装有道翻译接口，具体参数参考下方文档
// https://ai.youdao.com/DOCSIRMA/html/trans/api/wbfy/index.html
async function youdao(query: string, appKey: string, appSecret: string) {
  var appKey = appKey;
  var key = appSecret; //注意：暴露appSecret，有被盗用造成损失的风险
  var salt = new Date().getTime();
  var curtime = Math.round(new Date().getTime() / 1000);
  // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
  var from = "auto";
  var to = "auto";
  var str1 = appKey + truncate(query) + salt + curtime + key;
  //  生成加密签名
  var sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);

  const res = await axios.post(
    "http://openapi.youdao.com/api",
    querystring.stringify({
      q: changeWord(query), // 待翻译文本
      appKey, // 应用id
      salt, // 盐，随机字符串
      from, // 语言
      to, // 目标语言
      sign, // 签名
      signType: "v3", // 签名类型
      curtime,
    })
  );

  return res.data;
}


// 这里执行插件被激活时的操作
export function activate(context: vscode.ExtensionContext) {

  vscode.window.showInformationMessage('翻译插件成功激活!!!🎉🎉🎉');

  // 拿到配置文件中的有道翻译的appkey和appSecret
  const config = vscode.workspace.getConfiguration("vscodeVnTranslate");
  const appKey = config.get("youdaoAppkey") as string;
  const appSecret = config.get("youdaoAppSecret") as string;
  // 是否开启自动翻译
  const autoTranslate = config.get("openAutoTranslate") as boolean;

  console.log('====appSecret', appSecret, appKey, autoTranslate);

  // 划词hover翻译
  // registerHoverProvider：注册hover事件 
  autoTranslate === true && vscode.languages.registerHoverProvider("*", {
    // VS code 提供一个 provideHover 当鼠标移动在上面的时候就可以根据当前的单词做一些具体操作
    async provideHover(document, position, token) {
     // 获取当前选中的单词  
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return; // No open text editor
      }

      if (!appKey || !appSecret) {
        vscode.window.showWarningMessage('请配置有道翻译的appkey和appSecret');
        return;
      }

      // 获取选取文本   
      const selection = editor.selection;
      const text = document.getText(selection);
      console.log('text', text);
      if (!text || !text.length) {
        // vscode.window.showWarningMessage('请选中需要翻译的单词');
        return;
      }

      const res = await youdao(text, appKey, appSecret);
      console.log('res', res);
      if (res.errorCode !== "0") {
        vscode.window.showErrorMessage('翻译失败：', res.errorCode, res.msg);
        return;
      }
      return formatHoverText(res);
    },
  });

  // 划词翻译替换
  context.subscriptions.push(
    // 注册命令： vscode.translate.replace
    vscode.commands.registerCommand("vscode.translate.replace", async () => {
      // 获取当前选中的单词
      let editor = vscode.window.activeTextEditor;
      if (!editor) {
        return; // No open text editor
      }

      if (!appKey || !appSecret) {
        vscode.window.showWarningMessage('请配置有道翻译的appkey和appSecret');
        return;
      }

      let selection = editor.selection;
      let text = editor.document.getText(selection);
      if (!text || !text.length) {
        vscode.window.showWarningMessage('请选中需要翻译的单词');
        return;
      }

      //有选中翻译选中的词
      if (text.length) {
        const res = await youdao(text, appKey, appSecret);
        console.log(res);

        //vscode.window.showInformationMessage(res.translation[0]);
        // 替换选中的文本
        // editor.edit((builder) => {
        //   builder.replace(selection, res.translation[0]);
        // });
        vscode.window.showInformationMessage(`翻译一下：${res.translation[0]}`);
      }
    })
  );
}

// 格式化hover展示的文本
function formatHoverText(res: any) {
  // md格式
  const markdownString = new vscode.MarkdownString();

  markdownString.appendMarkdown(
    `#### 翻译一下: \n\n ${res.translation[0]} \n\n`
  );
  if (res.basic) {
    // 添加音标展示
    if (res.basic["us-phonetic"]) {
      markdownString.appendMarkdown(
        `**美** ${res.basic["us-phonetic"]}　　　　**英** ${res.basic["uk-phonetic"]}　\n\n`
      );
    }

    // 添加解释
    if (res.basic.explains) {
      res.basic.explains.forEach((w: string) => {
        markdownString.appendMarkdown(`${w} \n\n`);
      });
    }
  }
  // 添加网络释义
  if (res.web) {
    markdownString.appendMarkdown(`#### 网络释义 \n\n`);
    res.web.forEach((w: Word) => {
      markdownString.appendMarkdown(
        `**${w.key}:** ${String(w.value).toString()} \n\n`
      );
    });
  }
  markdownString.supportHtml = true; // 支持html标签 
  markdownString.isTrusted = true;

  return new vscode.Hover(markdownString); // hover展示
}

export function deactivate() {}