
// 访问模型服务
const axios = require("axios");
const ERNIEB ="https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions";
const AK = "FwiuelmVvVhGNCl2kmAKCnW7";
const SK = "43gx79qqa6W8lQO49AmYStRu74qnkFkY";
const Token = '';
class Conversation {
  constructor() {
    // 上下文数据存在这里，文心的调用是需要把所有的历史对话数据全部传过去，所以上下文窗口大小得注意
    this.messages = [];
  }
    /**
     * 使用 AK，SK 生成鉴权签名（Access Token）
     * @return string 鉴权签名信息（Access Token）
     */
    async getAccessToken() {
        return new Promise(async (resolve, reject) => {
            const res = await axios.post('https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + AK + '&client_secret=' + SK);
            const { data } = res;
            resolve(data.access_token);

        });

    }

  async ask(prompt) {
    // 问句push进去
    this.messages.push({ role: "user", content: prompt });
    console.log("message" + this.messages[0]);
    try {
      const res = await axios.post(
        ERNIEB,
        { messages: this.messages },
        { params: { access_token: await this.getAccessToken() } }
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
// 导出函数
module.exports = Conversation;
