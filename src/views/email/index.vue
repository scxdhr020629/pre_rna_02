<template>
  <d2-container>
    <template slot="header">发送邮件</template>
    <div>
      <h2>发送邮件</h2>
      <input v-model="emailSubject" placeholder="邮件主题" />
      <textarea v-model="emailBody" placeholder="邮件内容"></textarea>
      <button @click="sendEmail">发送邮件</button>
    </div>
  </d2-container>
</template>

<script>
export default {
  data() {
    return {
      emailSubject: '', // 邮件主题
      emailBody: '', // 邮件内容
    };
  },
  methods: {
    async sendEmail() {
      try {
        // 设置邮件内容
        const subject = this.emailSubject;
        const message = this.emailBody;
        const recipient_list = ['1282026764@qq.com'];  // 收件人列表，可以改成动态输入

        // 发送邮件请求
        const response = await this.$api.send_email({
          subject: subject,
          message: message,
          recipient_list: recipient_list,
        });

        // 判断响应结果
        if (response.code === 0) {
          this.$toast.success('邮件发送成功');
        } else {
          this.$toast.error('邮件发送失败: ' + response.msg);
        }
      } catch (error) {
        console.error('邮件发送失败:', error);
        this.$toast.error('邮件发送失败，请重试');
      }
    },
  },
};
</script>

<style scoped>
/* 页面样式 */
</style>
