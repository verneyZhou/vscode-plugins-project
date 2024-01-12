
// 访问模型服务
import axios from 'axios';
const ERNIEB ="https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions";
let Token = '';

// 封装一个对话类
class Conversation {
  constructor() {
    // 上下文数据存在这里，文心的调用是需要把所有的历史对话数据全部传过去，所以上下文窗口大小得注意
    this.messages = [];
  }
    /**
     * 使用 AK，SK 生成鉴权签名（Access Token）
     * @return string 鉴权签名信息（Access Token）
     */
    async getAccessToken(appParams) {
        let {appKey, appSecret} = appParams;
        return new Promise(async (resolve, reject) => {
            const res = await axios.post('https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + appKey + '&client_secret=' + appSecret);
            const { data } = res;
            if (!res || !data || !data.access_token) {
                reject('获取token失败');
            }
            resolve(data.access_token);

        });

    }

  async ask(params) {
    let {messages: prompt, appParams} = params;
    // 问句push进去
    console.log("===12345" + prompt, appParams);
    this.messages.push({ role: "user", content: prompt });
    console.log("message" + this.messages[0]);
    try {
      if (!Token) {Token = await this.getAccessToken(appParams);}
      if (!Token) {throw new Error('获取token失败');}
      const res = await axios.post(
        ERNIEB,
        { messages: this.messages },
        { params: { access_token: Token } }
      );
      const { data } = res;
      console.log(data);
      // 答案也放进去
      this.messages.push({ role: "assistant", content: data.result });
      return data.result;
    } catch (error) {
      console.log("调用模型失败" + error);
    }
  }
}


// 导出接口: api/chat
export default async function (req, res) {
    const { messages = "", appParams = {} } = req.body || {};
    if (!appParams.appKey || !appParams.appSecret) {
        return res.status(400).send({ error: "请配置appKey和appSecret" });
    }
    if (typeof messages !== "string") {
        return res.status(400).send({ error: "Invalid messages type" });
    }
    try {
        const conversation = new Conversation();
        // 调用ask方法获取大模型结果
        const response = await conversation.ask({messages, appParams});
        return res.status(200).send({ message: response });
    } catch (error) {
        return res.status(500).send({ error: error.messages });
    }
}



