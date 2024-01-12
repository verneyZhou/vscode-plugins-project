<template>
  <div class="chat-container">
    <div class="messages">
      <div
        v-for="(item, index) in chatList"
        :key="index"
        :class="['message', item.type]"
      >
        <RobotOutlined class="avatar" v-if="item.type !== 'question'" :style="{fontSize: '20px', color: '#715fc2'}"/>
        <div class="bubble" :class="`${item.type}__bubble`">{{ item.content }}</div>
        <UserOutlined class="avatar" v-if="item.type === 'question'" :style="{fontSize: '20px', color: '#00ba9d'}"/>
        <!-- <div class="avatar">
          <component
            :is="item.type === 'question' ? UserOutlined : RobotOutlined"
          />
        </div> -->
      </div>
    </div>
    <div class="input-area">
      <Input
        v-model:value="inputValue"
        placeholder="那就聊一下？"
        @pressEnter="handleSend"
      />
      <Button style="margin-left: 8px;" type="primary" @click="handleSend">发送</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { onMounted, reactive, ref } from "vue";
import { Button, Input, message } from "ant-design-vue";
import { UserOutlined, RobotOutlined } from "@ant-design/icons-vue";
const inputValue = ref("");
let chatList = ref<any[]>([]);


// appKey和appSecret, 由vscode插件传入
const APP_KEY_PARAMS = reactive(<any>{
  appKey: '',
  appSecret: '',
})


onMounted(() => {
  // 增加message的监听，用于接收vscode插件传入的appKey和appSecret
  window.addEventListener("message", (event: any) => {
      const message = event.data;
      // console.log("message", message);
      switch (message.command) {
        case "vscodeSendMesToWeb":
          console.log("vscodeSendMesToWeb", message.data);
          Object.assign(APP_KEY_PARAMS, message.data)
          break;
      }
    });
});

const handleSend = () => {
  if (!APP_KEY_PARAMS.appKey || !APP_KEY_PARAMS.appSecret) {
    message.info('请先设置appKey和appSecret')
    return
  }
  const question = inputValue.value.trim();
  if (question) {
    getAnswer(question);
    chatList.value.push({ type: "question", content: question });
    inputValue.value = ""; // 清空输入框
  }
};
function getAnswer(question: string) {
  // const URL = "http://localhost:8080/chat";
  const URL = "/api/chat"; // serverless
  const payload = {
    messages: question,
    appParams: {
      appKey: APP_KEY_PARAMS.appKey,
      appSecret: APP_KEY_PARAMS.appSecret,
    },
  };
  sendPost(
    URL,
    payload,
    {},
    (res: any) => {
      console.log(res.data.message);
      chatList.value.push({ type: "answer", content: res.data.message });
    },
    (err: any) => {
      console.log(err);
    }
  );
}

//post方法
function sendPost(
  url: string,
  data: any,
  headers = {},
  funcSuccess: any,
  funcError: any
) {
  const headerTem = {
    "content-Type": "application/json;charset=UTF-8",
  };
  if (JSON.stringify(headers) != "{}") {
    Object.assign(headerTem, headers);
  }
  axios
    .post(url, data, {
      headers: headerTem,
    })
    .then(function (res) {
      console.log("sendPost res info :", res);
      funcSuccess(res);
    })
    .catch((err) => {
      console.log("sendPost err info :" + err);
      if (funcError) {
        funcError(err);
      }
    });
}
</script>

<style scoped>
.chat-container {
  min-width: 340px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #12172d;
  border: 1px solid #1e1e1e;
  border-radius: 8px;
}

.messages {
  height: 650px;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.bubble {
  color: #fff;
  text-align: right;
  margin-right: 8px;
  padding: 8px 16px;
  background: #477eff;
  border-radius: 4px;
}
.answer__bubble {
  text-align: left;
  margin-left: 8px;
  background: #576c99;
}
.input-area {
  display: flex;
  padding: 10px;
}
.message {
  display: flex;
  /* align-items: center; */
}

.avatar {
    margin-top: 4px;
  }

.question {
  justify-content: flex-end;
}

.answer {
  justify-content: flex-start;
}
</style>



