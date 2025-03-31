<template>
  <d2-container>
    <div class="chat-container">
      <!-- Page Header -->
      <div class="page-header-container">
        <div class="page-header">
          <h1 class="title">DeepSeek</h1>
          <p class="subtitle">
            Into the unknown
          </p>
        </div>
      </div>

      <!-- Chat Window -->
      <div class="chat-window" ref="chatWindow">
        <div v-if="chatHistory.length === 0" class="welcome-message">
          <div class="welcome-icon">
            <i class="el-icon-chat-dot-square"></i>
          </div>
          <h2>Welcome to the DeepSeek</h2>
          <p>Ask me anything to get started!</p>
        </div>

        <transition-group name="fade-message" tag="div" class="messages-container">
          <div v-for="(message, index) in chatHistory" :key="index" 
               :class="['message', message.role === 'user' ? 'user-message' : 'ai-message']">
            <div class="message-avatar">
              <i :class="message.role === 'user' ? 'el-icon-star-on' : 'el-icon-cpu'"></i>
            </div>
            <div class="message-content">
              <div class="message-header">
                <span class="message-sender">{{ message.role === 'user' ? 'You' : 'AI Assistant' }}</span>
                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                
                <!-- Toggle reasoning button for AI messages with reasoning -->
                <el-button 
                  v-if="message.role === 'assistant' && message.reasoning" 
                  type="text" 
                  size="mini" 
                  class="reasoning-toggle"
                  @click="message.showReasoning = !message.showReasoning"
                >
                  {{ message.showReasoning ? 'Hide Analysis' : 'Show Analysis' }}
                  <i :class="message.showReasoning ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </el-button>
              </div>
              
              <!-- Main response content -->
              <div class="message-text" v-html="formatMessage(message.content)"></div>
              
              <!-- Reasoning section (collapsible) -->
              <div v-if="message.reasoning && message.showReasoning" class="reasoning-section">
                <div class="reasoning-header">
                  <i class="el-icon-discover"></i> Reasoning Process
                </div>
                <div class="reasoning-content" v-html="formatMessage(message.reasoning)"></div>
              </div>
            </div>
          </div>
        </transition-group>

        <div v-if="isLoading" class="thinking-dialog">
          <div class="thinking-dialog-content">
            <div class="thinking-avatar">
              <i class="el-icon-cpu"></i>
            </div>
            <div class="thinking-text">
              <div class="thinking-header">Deepseek is thinking</div>
              <div class="thinking-animation">
                <div class="thinking-dot"></div>
                <div class="thinking-dot"></div>
                <div class="thinking-dot"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="input-area">
        <div class="input-container">
          <el-input
            v-model="userInput"
            type="textarea"
            :rows="2"
            :autosize="{ minRows: 1, maxRows: 5 }"
            placeholder="Type your message here..."
            @keydown.enter.native.exact.prevent="sendMessage"
            :disabled="isLoading"
          >
          </el-input>
          
          <el-tooltip content="Press Enter to send" placement="top">
            <el-button 
              type="primary" 
              class="send-button" 
              :loading="isLoading" 
              @click="sendMessage" 
              :disabled="!userInput.trim() || isLoading"
            >
              <i class="el-icon-position" v-if="!isLoading"></i>
              <span>{{ isLoading ? 'Thinking...' : 'Send' }}</span>
            </el-button>
          </el-tooltip>
        </div>
        
        <div class="input-actions">
          <el-button type="text" @click="clearChat" class="clear-button">
            <i class="el-icon-delete"></i>
            Clear Chat
          </el-button>
        </div>
      </div>

      <!-- Footer -->
      <div class="chat-footer">
        <p>
          <i class="el-icon-info-circle"></i> 
          The AI's responses are generated based on available information and might not always be accurate.
          <el-switch
            v-model="showReasoningByDefault"
            active-text="Auto-show reasoning"
            inactive-text="Hide reasoning by default"
            style="margin-left: 15px;"
          ></el-switch>
        </p>
      </div>
    </div>
  </d2-container>
</template>

<script>
import { send_message_to_deepseek } from "@/api/modules/sys.email.deepseek.api";
import marked from 'marked';
import DOMPurify from 'dompurify';

export default {
  name: "ChatWithAI",
  data() {
    return {
      userInput: "",
      chatHistory: [],
      isLoading: false,
      showReasoningByDefault: false
    };
  },
  methods: {
    async sendMessage() {
      const message = this.userInput.trim();
      if (!message || this.isLoading) return;
      
      // Add user message to chat history
      this.chatHistory.push({
        role: "user",
        content: message,
        timestamp: new Date()
      });
      
      // Clear input field
      this.userInput = "";
      
      // Set loading state
      this.isLoading = true;
      
      // Scroll to bottom
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      
      try {
        // Call API to get AI response
        const response = await send_message_to_deepseek({
            message: message,
          });
        console.log(response);
        // console.log(response[1].data.data);
        // Process the response
        if (response && response[1].code === 0) {
          const responseData = response[1].data.data;
          
          // Add AI response to chat history with both content and reasoning
          this.chatHistory.push({
            role: "assistant",
            content: responseData.content || "No content available",
            reasoning: responseData.reasoning_content || null,
            showReasoning: this.showReasoningByDefault,
            timestamp: new Date()
          });
        } else {
          // Handle error response
          this.chatHistory.push({
            role: "assistant",
            content: "I'm sorry, I couldn't process your request. Please try again.",
            timestamp: new Date()
          });
        }
      } catch (error) {
        console.error("Error sending message to AI:", error);
        // Add error message to chat history
        this.chatHistory.push({
          role: "assistant",
          content: "An error occurred while processing your message. Please try again later.",
          timestamp: new Date()
        });
      } finally {
        // Reset loading state
        this.isLoading = false;
        
        // Scroll to bottom after response
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    
    formatMessage(message) {
      // Handle null or undefined messages
      if (!message) return '';
      
      // Convert markdown to HTML and sanitize
      return DOMPurify.sanitize(marked(message));
    },
    
    scrollToBottom() {
      if (this.$refs.chatWindow) {
        this.$refs.chatWindow.scrollTop = this.$refs.chatWindow.scrollHeight;
      }
    },
    
    clearChat() {
      this.$confirm('Are you sure you want to clear the entire chat history?', 'Clear Chat', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.chatHistory = [];
        this.$message({
          type: 'success',
          message: 'Chat history cleared'
        });
      }).catch(() => {});
    }
  },
  mounted() {
    // Initialize any needed functionality
    this.scrollToBottom();
  },
  updated() {
    // Keep scrolled to bottom when new messages arrive
    this.scrollToBottom();
  }
};
</script>
<style>
/* Base variables for consistent scaling */
:root {
  --primary-color: #409eff;
  --primary-gradient: linear-gradient(135deg, #409eff, #67c23a);
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --danger-color: #f56c6c;
  --info-color: #909399;
  --border-radius: 12px;
  --transition-time: 0.3s;
  --message-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  --chat-bg: #f9fafc;
}

/* Page content container */
.chat-container {
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  font-size: calc(0.85rem + 0.1vw);
  line-height: 1.5;
  overflow-x: hidden; 
  animation: fadeInUp 0.6s ease-out;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px); /* Increased container height */
}

/* Page header container for full width effect */
.page-header-container {
  position: relative;
  width: 100%;
  padding: 0;
  margin: 0;
  margin-top: 0;
  overflow: hidden;
  flex-shrink: 0; /* Prevent header from shrinking */
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
  min-height: 3.8rem;
  max-height: 5.5rem;
  width: 99.8%;
  margin-left: auto;
  margin-right: auto;
}

.title {
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

/* Chat window styles */
.chat-window {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem; /* Reduced top/bottom padding */
  background-color: var(--chat-bg);
  border-radius: var(--border-radius);
  margin-bottom: 0.4rem; /* Reduced margin */
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  position: relative;
}

/* Welcome message styling */
.welcome-message {
  text-align: center;
  padding: 2rem;
  color: #606266;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 300px;
}

.welcome-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  height: 100px;
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(64, 158, 255, 0.1);
  color: var(--primary-color);
  animation: pulse 2s infinite;
}

.welcome-message h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.welcome-message p {
  font-size: 1.2rem;
  opacity: 0.8;
}

/* Messages container */
.messages-container {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

/* Message container styles - ensure proper layout */
.message {
  display: flex;
  margin-bottom: 0.5rem;
  animation: fadeIn 0.3s ease-out;
  width: 100%;
  align-items: flex-start; /* Align items at the top */
}

/* Position user messages on the right side */
.user-message {
  justify-content: flex-end;
  /* Keep flex-direction: row-reverse to swap avatar and content positions */
}

/* Position AI messages on the left side */
.ai-message {
  justify-content: flex-start;
  /* Keep flex-direction: row to keep avatar on the left */
}

/* Make avatars larger and more visible */
.message-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
  margin: 0 12px; /* Consistent margin on both sides */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); /* Add shadow for depth */
}

.user-message .message-avatar {
  background: var(--primary-gradient);
  order: 1; /* Force avatar to be after content in user messages */
}

.ai-message .message-avatar {
  background: linear-gradient(135deg, #6f7ad3, #409eff);
  order: 0; /* Default - avatar before content in AI messages */
}

/* Enhanced user avatar icon styling */
.user-message .message-avatar i {
  font-size: 1.3rem; /* Slightly larger icon */
  font-weight: bold; /* Make it bolder */
}

/* Adjust content widths to allow space for avatars */
.message-content {
  max-width: 65%; /* Reduced from 70% to make room for avatars */
  min-width: 200px;
  border-radius: var(--border-radius);
  padding: 1.2rem;
  position: relative;
  box-shadow: var(--message-shadow);
  transition: all 0.2s ease;
  background: white;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.message-sender {
  font-weight: 600;
  color: #2c3e50;
}

.user-message .message-sender {
  color: var(--primary-color);
}

.ai-message .message-sender {
  color: #6f7ad3;
}

.message-time {
  font-size: 0.75rem;
  color: #909399;
}

.message-text {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
  color: #303133;
}

.message-text pre {
  background: #f8f8f8;
  border-radius: 4px;
  padding: 0.8rem;
  overflow-x: auto;
  margin: 0.5rem 0;
  border: 1px solid #ebeef5;
  font-family: 'Courier New', monospace;
}

.message-text p {
  margin: 0.8rem 0;
}

.message-text p:first-child {
  margin-top: 0;
}

.message-text p:last-child {
  margin-bottom: 0;
}

/* Reasoning section */
.reasoning-toggle {
  color: var(--primary-color);
  padding: 0 8px;
  font-size: 0.8rem;
}

.reasoning-section {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px dashed #c0c4cc;
  animation: fadeIn 0.3s ease-out;
}

.reasoning-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #606266;
  margin-bottom: 0.8rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.reasoning-header i {
  margin-right: 0.5rem;
  color: #6f7ad3;
}

.reasoning-content {
  font-size: 0.9rem;
  color: #606266;
  line-height: 1.5;
}

/* Thinking dialog styles */
.thinking-dialog {
  position: relative;
  margin: 1rem 0;
  display: flex;
  justify-content: flex-start;
  animation: fadeIn 0.5s ease-out;
}

.thinking-dialog-content {
  display: flex;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  padding: 1rem;
  min-width: 250px;
  max-width: 70%;
  border-left: 4px solid #6f7ad3;
  animation: pulseGlow 2s infinite alternate;
}

.thinking-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6f7ad3, #409eff);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.thinking-avatar i {
  font-size: 1.2rem;
}

.thinking-header {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.thinking-animation {
  display: flex;
  gap: 6px;
  align-items: center;
  height: 20px;
}

.thinking-dot {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background: #6f7ad3;
  animation: thinkingDots 1.4s infinite ease-in-out;
}

.thinking-dot:nth-child(1) {
  animation-delay: 0s;
}

.thinking-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.thinking-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes thinkingDots {
  0%, 100% {
    transform: scale(0.7);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

@keyframes pulseGlow {
  0% {
    box-shadow: 0 4px 12px rgba(111, 122, 211, 0.1);
  }
  100% {
    box-shadow: 0 8px 24px rgba(111, 122, 211, 0.25);
  }
}

/* Remove old typing indicator styles */
.typing-indicator {
  display: none;
}

/* Input area redesign - position send button to the right of input */
.input-area {
  padding: 0.7rem 1rem; /* Reduced padding */
  background: white;
  border-radius: var(--border-radius);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  position: relative;
  margin-bottom: 0.3rem;
  flex-shrink: 0; /* Prevent input area from shrinking */
}

/* Create a flex container for input and send button */
.input-container {
  display: flex;
  align-items: flex-end; /* Align to bottom of textarea */
  gap: 10px;
}

/* Make the input take available space */
.input-container .el-textarea {
  flex: 1;
}

/* Style the send button with gradient */
.send-button {
  background: linear-gradient(135deg, #409eff 0%, #67c23a 100%) !important;
  border: none !important;
  height: 36px !important; /* Fixed height to match input */
  min-height: 36px; /* Reduced from 40px */
  min-width: 100px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
  color: white !important; /* Ensure text is visible */
  font-weight: 600;
  padding: 0 20px !important;
  line-height: 1; /* Improved vertical centering */
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(64, 158, 255, 0.4);
}

/* Fix icon visibility */
.send-button i {
  color: white;
  margin-right: 8px;
}

/* Chat footer - Bring it closer to the input area */
.chat-footer {
  display: flex;
  justify-content: center;
  padding: 0.3rem 0; /* Reduced padding */
  color: #909399;
  font-size: 0.8rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  flex-shrink: 0; /* Prevent footer from shrinking */
}

/* Animations */
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes shine-button {
  0% {
    left: -100%;
  }
  20%, 100% {
    left: 100%;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes typing {
  0% {
    transform: translateY(0px);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-5px);
    opacity: 1;
  }
  100% {
    transform: translateY(0px);
    opacity: 0.4;
  }
}

/* Message transition animations */
.fade-message-enter-active,
.fade-message-leave-active {
  transition: all 0.3s;
}

.fade-message-enter,
.fade-message-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

/* Responsive adjustments */
@media (min-width: 1440px) {
  .page-header {
    width: 99.8%;
  }
}

@media (max-width: 1200px) {
  .page-header {
    width: 99.6%;
  }
  
  .message-content {
    max-width: 80%;
  }
}

@media (max-width: 992px) {
  .chat-container {
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
  
  .message-content {
    max-width: 85%;
    min-width: 150px;
  }
  
  .send-button {
    min-width: 80px;
  }
}

@media (max-width: 576px) {
  .chat-container {
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
  
  .message-content {
    max-width: 95%;
    min-width: 120px;
  }
  
  .message-avatar {
    width: 30px;
    height: 30px;
    margin: 0 0.5rem;
  }

  .typing-indicator {
    margin-left: 2.5rem;
  }
}

/* For Firefox which handles rem differently */
@-moz-document url-prefix() {
  .chat-container {
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