<template>
  <d2-container>
    <template slot="header">
      <div class="page-header">
        <h1 class="title">Email Service</h1>
        <p class="subtitle">Send your messages efficiently and reliably</p>
      </div>
    </template>
    
    <div class="email-container">
      <div class="form-group">
        <label class="form-label">Subject</label>
        <input 
          v-model="emailSubject" 
          placeholder="Enter email subject" 
          class="email-input"
        />
      </div>
      
      <div class="form-group">
        <label class="form-label">Message</label>
        <textarea 
          v-model="emailBody" 
          placeholder="Type your message here..." 
          class="email-textarea"
        ></textarea>
      </div>

      <div class="button-container">
        <button @click="sendEmail" class="send-button">
          <i class="el-icon-message"></i>
          Send Email
        </button>
      </div>
    </div>
  </d2-container>
</template>
<script>
export default {
  data() {
    return {
      emailSubject: '', // Email subject
      emailBody: '', // Email body
    };
  },
  methods: {
    async sendEmail() {
      // Validate that subject and message are not empty
      if (!this.emailSubject || !this.emailBody) {
        this.$message.error('Email subject and body cannot be empty');
        return;
      }

      try {
        // Set email content
        const subject = this.emailSubject;
        const message = this.emailBody;
        const recipient_list = ['1282026764@qq.com'];  // Recipient list, can be dynamically set

        // Send email request
        const response = await this.$api.send_email({
          subject: subject,
          message: message,
          recipient_list: recipient_list,
        });

        console.log('Response from email API')
        console.log(response)
        console.log(response[0])
        if (response[1].code === 0) {
          console.log("hello")
          this.$message.success('Email sent successfully');
        } else {
          this.$message.error('Failed to send email');
        }
      } catch (error) {
        console.error('Failed to send email:', error);
        this.$message.error('Failed to send email');
      }
    },
  },
};
</script>
<style scoped>
:root {
  --primary-color: #409eff;
  --success-color: #67c23a;
  --text-color: #2c3e50;
  --border-color: #dcdfe6;
  --background-color: #f8fafc;
  --shadow-color: rgba(0, 0, 0, 0.08);
}

/* 页面标题样式 */
.page-header {
  text-align: center;
  padding: 40px 0; /* 增加内边距使标题区域更大 */
  background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
  border-radius: 12px;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
}

.title {
  font-size: 3.2em; /* 增大标题字号 */
  color: #ffffff; /* 确保字体为纯白色 */
  margin: 0;
  font-weight: 800; /* 加粗字重 */
  letter-spacing: 2px; /* 增加字间距 */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15); /* 添加文字阴影增加醒目度 */
  position: relative;
  z-index: 1;
  text-transform: uppercase; /* 可选：将文字转为大写更加醒目 */
}

.subtitle {
  color: rgba(255, 255, 255, 0.95); /* 提高副标题的不透明度 */
  margin-top: 15px; /* 增加与主标题的间距 */
  font-size: 1.4em; /* 增大副标题字号 */
  font-weight: 500;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .title {
    font-size: 2.8em; /* 移动端稍微调小一点 */
  }
  
  .subtitle {
    font-size: 1.2em;
  }
  
  .page-header {
    padding: 30px 0;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 2.4em;
    letter-spacing: 1px;
  }
  
  .subtitle {
    font-size: 1.1em;
  }
  
  .page-header {
    padding: 25px 0;
  }
}

/* 页面标题光效动画 */
.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transform: translateX(-100%);
  animation: shimmer 3s infinite;
}

/* 邮件容器样式 */
.email-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 24px var(--shadow-color);
  position: relative;
  overflow: hidden;
}

/* 邮件容器光效动画 */
.email-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(64, 158, 255, 0.05),
    transparent
  );
  transform: translateX(-100%);
  animation: shimmer 4s infinite;
  pointer-events: none;
}

/* 输入框样式 */
.email-input,
.email-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 15px;
  color: var(--text-color);
  background: var(--background-color);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* 输入框光效 */
.email-input:focus,
.email-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
  background: #ffffff;
}

/* 发送按钮样式 */
.send-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* 发送按钮光效 */
.send-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transform: translateX(-100%);
  animation: shimmer 2s infinite;
}

/* 动画关键帧 */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 输入框悬浮光效 */
.email-input:hover,
.email-textarea:hover {
  border-color: var(--primary-color);
  transition: all 0.3s ease;
}

/* 发送按钮悬浮效果 */
.send-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

/* 加载动画 */
@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

/* 表单组样式 */
.form-group {
  margin-bottom: 25px;
  position: relative;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.95em;
  font-weight: 500;
  color: var(--text-color);
  transition: all 0.3s ease;
}

/* 标签悬浮效果 */
.form-group:hover .form-label {
  color: var(--primary-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .email-container {
    padding: 20px;
    margin: 0 15px;
  }

  .send-button {
    width: 100%;
    justify-content: center;
  }
}

/* 占位符样式 */
::placeholder {
  color: #a0aec0;
  transition: all 0.3s ease;
}

/* 输入框聚焦时占位符样式 */
.email-input:focus::placeholder,
.email-textarea:focus::placeholder {
  opacity: 0.7;
  transform: translateX(5px);
}

/* 邮件容器载入动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.email-container {
  animation: fadeInUp 0.6s ease-out;
}
</style>