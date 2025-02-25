<template>
  <d2-container>
    <template slot="header">Send Email</template>
    <div class="email-container">
      <h2>Send Email</h2>
      <input v-model="emailSubject" placeholder="Email Subject" class="email-input" />
      <textarea v-model="emailBody" placeholder="Email Body" class="email-textarea"></textarea>
      <button @click="sendEmail" class="send-button">Send Email</button>
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
        console.log(response[0])
        if (response[0] === 200) {
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
.email-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.email-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.email-input,
.email-textarea {
  width: 100%;
  max-width: 500px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.email-textarea {
  height: 150px;
  resize: none;
}

.send-button {
  padding: 10px 20px;
  background-color: #2f74ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.send-button:hover {
  background-color: #2f74ff;
}
</style>