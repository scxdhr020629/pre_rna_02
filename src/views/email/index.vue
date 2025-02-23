<template>
  <d2-container>
    <template slot="header">发送邮件</template>

    <div class="content">
      <!-- 输入邮件主题 -->
      <el-input
        v-model="emailSubject"
        placeholder="请输入邮件主题"
        clearable
        class="input-field"
      ></el-input>

      <!-- 输入邮件内容 -->
      <el-input
        type="textarea"
        v-model="emailBody"
        placeholder="请输入邮件内容"
        rows="6"
        class="input-field"
      ></el-input>

      <!-- 发送按钮 -->
      <el-button
        type="primary"
        :loading="loading"
        @click="handleSendEmail"
        class="send-button"
      >
        发送邮件
      </el-button>

      <!-- 结果反馈 -->
      <div v-if="feedbackMessage" class="feedback-message">
        {{ feedbackMessage }}
      </div>
    </div>
  </d2-container>
</template>

<script>
export default {
  name: 'SendEmail',
  data() {
    return {
      emailSubject: '',
      emailBody: '',
      loading: false,
      feedbackMessage: '', // 用于显示反馈信息
    };
  },
  methods: {
    handleSendEmail() {
      // 验证输入
      if (!this.emailSubject || !this.emailBody) {
        this.$message.warning('请填写完整的邮件主题和内容');
        return;
      }

      this.loading = true;

      // 模拟发送邮件过程，后续可以将数据传给后端
      setTimeout(() => {
        this.loading = false;
        this.feedbackMessage = '邮件内容已准备好，等待发送！';

        // 可以将邮件内容发送到后端接口进行处理
        const emailData = {
          subject: this.emailSubject,
          body: this.emailBody,
          to: '1282026764@qq.com', // 模拟目标邮件地址
        };

        // 这里是模拟发送数据给后端的过程
        console.log('准备发送邮件：', emailData);
        
        // 你可以在这里发起一个请求到后端来实际发送邮件
        // axios.post('/send-email', emailData)
        //   .then(response => {
        //     this.feedbackMessage = '邮件发送成功！';
        //   })
        //   .catch(error => {
        //     this.feedbackMessage = '邮件发送失败，请重试。';
        //   });

      }, 1000); // 模拟1秒后邮件已准备好
    },
  },
};
</script>

<style scoped>
/* 页面样式 */
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.input-field {
  width: 300px;
  margin-bottom: 20px;
}

.send-button {
  width: 300px;
}

.feedback-message {
  margin-top: 20px;
  font-size: 16px;
  color: #4caf50;
  font-weight: bold;
}
</style>
