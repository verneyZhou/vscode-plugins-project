
//server.js
const Conversation = require("./chat.js");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
// 暂时允许所有跨域请求
let corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
// content-type：application/json
app.use(bodyParser.json());
// content-type：application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// 对话类
const conversation = new Conversation();
// 定义/chat路由处理POST请求
app.post("/chat", async (req, res) => {
  const { messages = "" } = req.body || {};
  if (typeof messages !== "string") {
    return res.status(400).send({ error: "Invalid messages type" });
  }
  try {
    // 调用ask方法获取大模型结果
    const response = await conversation.ask(messages);
    return res.status(200).send({ message: response });
  } catch (error) {
    return res.status(500).send({ error: error.messages });
  }
});
// 设置监听端口
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`服务器运行端口： ${PORT}.`);
});


