<template>
  <d2-container>
    <div class="about-content">
      <!-- Page Header -->
      <div class="page-header-container">
        <div class="page-header">
          <h1 class="title">Email Service</h1>
          <p class="subtitle">Send HTML-formatted emails to recipients with our easy-to-use editor</p>
        </div>
      </div>
      
      <div class="email-container">
        <div class="form-group">
          <label class="form-label">Subject</label>
          <div class="subject-input-container">
            <i class="el-icon-chat-dot-round subject-icon"></i>
            <input 
              v-model="emailSubject" 
              placeholder="Enter email subject" 
              class="email-input"
            />
            <div class="focus-line"></div>
          </div>
        </div>
        
        <div class="form-group message-editor">
          <label class="form-label">Message</label>
          <d2-quill
            v-model="emailBody"
            style="min-height: 400px; background: var(--background-color);"
            @text-change="textChangeHandler"
            @selection-change="selectionChangeHandler"
            @editor-change="editorChangeHandler"
          />
        </div>
        
        <div class="button-group">
          <button @click="handleAddRow" class="action-button">
            <i class="el-icon-plus"></i>
            Add Row
          </button>
          
          <button @click="sendEmail" class="send-button">
            <i class="el-icon-message"></i>
            Send Email
          </button>
        </div>
        
        <el-card 
          v-if="showPreview" 
          shadow="hover" 
          class="preview-card d2-mt">
          <div class="preview-header">
            <h3>Message Preview</h3>
            <el-switch 
              v-model="showPreview" 
              active-text="Hide Preview"
              inactive-text="Show Preview">
            </el-switch>
          </div>
          <d2-highlight :code="emailBody" format-html/>
        </el-card>
      </div>
    </div>
  </d2-container>
</template>

<script>
import {send_email} from '@/api/modules/sys.email.api'; // Import email API
import defaultValue from './value'; // Import default HTML content if needed

export default {
  name: 'email',
  data() {
    return {
      emailSubject: '', // Email subject
      emailBody: defaultValue || '<p>Type your message here...</p>', // Initialize with default content
      showPreview: false // Toggle for the preview section
    };
  },
  methods: {
    async sendEmail() {
      // Validate that subject and message are not empty
      if (!this.emailSubject) {
        this.$message.error('Email subject cannot be empty');
        return;
      }

      if (!this.emailBody || this.emailBody === '<p>Type your message here...</p>') {
        this.$message.error('Please compose an email message');
        return;
      }

      try {
        // Set email content
        const subject = this.emailSubject;
        const message = this.emailBody; // This is now HTML content
        const recipient_list = ['1282026764@qq.com']; // Recipient list

        // Send email request
        const response = await send_email({
          subject: subject,
          message: message,
          content_type: 'text/html', // 明确指定MIME类型为HTML
          isHtml: true, // Flag to indicate this is HTML content
          recipient_list: recipient_list
        });

        console.log('Response from email API', response);
        if (response && response[1] && response[1].code === 0) {
          this.$message.success('Email sent successfully');
          // Optionally clear form after sending
          // this.emailSubject = '';
          // this.emailBody = '<p>Type your message here...</p>';
        } else {
          this.$message.error('Failed to send email');
        }
      } catch (error) {
        console.error('Failed to send email:', error);
        this.$message.error('Failed to send email');
      }
    },
    
    // Add a new row to the editor
    handleAddRow() {
      // Add a styled paragraph to the editor
      this.emailBody += '<p style="color: #409EFF; margin: 10px 0;">New content row</p>';
    },
    
    // Quill editor event handlers
    textChangeHandler(delta, oldDelta, source) {
      // Handling text changes in the editor
      console.log('Content changed');
    },
    
    selectionChangeHandler(range, oldRange, source) {
      // Handling selection changes in the editor
    },
    
    editorChangeHandler(eventName, ...args) {
      // Handling general editor changes
    },
    
    // Toggle preview visibility
    togglePreview() {
      this.showPreview = !this.showPreview;
    }
  }
};
</script>

<style scoped>
/* Base variables for consistent scaling */
:root {
  --primary-color: #409eff;
  --success-color: #67c23a;
  --text-color: #2c3e50;
  --border-color: #dcdfe6;
  --background-color: #f8fafc;
  --shadow-color: rgba(0, 0, 0, 0.08);
}

/* Page content container */
.about-content {
  padding: 0.08rem 0 0.6rem;  /* Small top padding to maintain minimal space */
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  font-size: calc(0.85rem + 0.1vw);
  line-height: 1.5;
  overflow-x: hidden; /* Prevent horizontal scrolling */
  animation: fadeInUp 0.6s ease-out; /* Added animation for page transition */
}

/* Page header container for full width effect */
.page-header-container {
  position: relative;
  width: 100%;
  padding: 0;
  margin: 0;
  margin-top: 0;
  overflow: hidden;
}

/* Page header styling */
.page-header {
  text-align: center;
  padding: 0.5rem 0;
  background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
  border-radius: 0.5rem;
  margin-bottom: 0.9rem;
  margin-top: 0;
  box-shadow: 0 0.25rem 0.9rem rgba(64, 158, 255, 0.1);
  position: relative;
  overflow: hidden;
  /* Use viewport units for responsive height that scales with screen size */
  min-height: 3.8rem;
  max-height: 5.5rem;
  width: 99.8%;
  margin-left: auto;
  margin-right: auto;
}

.title {
  /* Using rem and viewport width for responsive text sizing */
  font-size: calc(1.5rem + 0.5vw);
  color: #ffffff;
  margin: 0;
  font-weight: 800;
  letter-spacing: 0.125rem;
  text-shadow: 0.125rem 0.125rem 0.25rem rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
  padding: 0 1rem;
}

.subtitle {
  color: rgba(255, 255, 255, 0.95);
  margin-top: 0.25rem;
  /* Responsive font sizing that scales better across displays */
  font-size: calc(0.7rem + 0.2vw);
  font-weight: 500;
  position: relative;
  z-index: 1;
  padding: 0 1rem;
}

/* Page title gradient effect */
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

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  20% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Page transition animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(1.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 邮件容器样式 */
.email-container {
  max-width: 900px;
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

/* 新的主题输入容器样式 - 调整宽度与Quill编辑器一致 */
.subject-input-container {
  position: relative;
  margin-bottom: 5px;
  width: 100%;
}

/* 主题图标样式 */
.subject-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #909399;
  font-size: 18px;
  transition: all 0.3s ease;
  z-index: 1;
}

/* 聚焦时主题图标样式 */
.subject-input-container:focus-within .subject-icon {
  color: var(--primary-color);
}

/* 输入框样式 - 与Quill编辑器对齐 */
.email-input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 16px 12px 44px;
  border: 1px solid var(--border-color);
  border-radius: 0;
  font-size: 16px;
  color: var(--text-color);
  background: var(--background-color);
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

/* 输入框聚焦效果 */
.email-input:focus {
  outline: none;
  border-color: var(--primary-color);
  background: #ffffff;
}

/* 底部聚焦线条 - 现在为四边 */
.focus-line {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background: linear-gradient(to right, var(--primary-color), var(--success-color));
  transition: width 0.3s ease;
}

/* 聚焦时底部线条展开 */
.subject-input-container:focus-within .focus-line {
  width: 100%;
}

/* 输入框悬浮效果 */
.email-input:hover {
  border-color: #a0a7ae;
}

/* 输入框占位符样式 */
.email-input::placeholder {
  color: #a0aec0;
  transition: transform 0.25s ease, opacity 0.25s ease;
}

/* 聚焦时占位符样式 */
.email-input:focus::placeholder {
  transform: translateX(4px);
  opacity: 0.7;
}

/* 调整Quill编辑器的边框保持一致性 */
:deep(.ql-container),
:deep(.ql-toolbar) {
  border-color: var(--border-color);
}

/* 表单组样式 */
.form-group {
  margin-bottom: 25px;
  position: relative;
}

.message-editor {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 1em;
  font-weight: 600;
  color: var(--text-color);
  transition: all 0.3s ease;
}

/* 标签悬浮效果 */
.form-group:hover .form-label {
  color: var(--primary-color);
}

/* 按钮组样式 */
.button-group {
  display: flex;
  gap: 15px;
  margin-top: 25px;
  justify-content: flex-end;
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
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* 操作按钮样式 */
.action-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f1f5f9;
  color: var(--primary-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
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

/* 按钮悬浮效果 */
.send-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.action-button:hover {
  background: #e6f1ff;
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

/* 预览卡片样式 */
.preview-card {
  margin-top: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
  transition: all 0.3s ease;
}

.preview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08) !important;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.preview-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--text-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .email-container {
    padding: 20px;
    margin: 0 15px;
  }

  .button-group {
    flex-direction: column;
  }

  .send-button,
  .action-button {
    width: 100%;
    justify-content: center;
  }
}

/* Responsive adjustments for the header */
@media (min-width: 1440px) {
  .page-header {
    width: 99.8%;
  }
}

@media (max-width: 1200px) {
  .page-header {
    width: 99.6%;
  }
}

@media (max-width: 992px) {
  .about-content {
    padding: 0.08rem 0 0.6rem;
  }
  
  .page-header {
    width: 99.4%;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 0.5rem 0;
    width: 99%;
  }
}

@media (max-width: 576px) {
  .about-content {
    padding: 0.08rem 0 0.6rem;
  }
  
  .page-header {
    padding: 0.5rem 0;
    margin-bottom: 0.75rem;
    width: 98%;
  }
  
  .title {
    font-size: calc(1.3rem + 0.5vw);
    padding: 0 0.5rem;
  }
  
  .subtitle {
    font-size: calc(0.6rem + 0.2vw);
    margin-top: 0.25rem;
    padding: 0 0.5rem;
  }
}

/* For Firefox which handles rem differently */
@-moz-document url-prefix() {
  .about-content {
    font-size: calc(13.6px + 0.1vw);
  }
  
  .title {
    font-size: calc(24px + 0.5vw);
  }
  
  .subtitle {
    font-size: calc(11.2px + 0.2vw);
  }
}
</style>