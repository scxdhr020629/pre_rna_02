<template>
  <div class="file-upload">
    <h2>上传Excel文件</h2>
    <div class="upload-box" @click="triggerFileInput" @dragover.prevent @drop="onFileDrop">
      <input 
        type="file" 
        ref="fileInput" 
        @change="handleFileChange"
        accept=".xlsx,.xls" 
        style="display:none"
      />
      <div v-if="!uploading">
        <i class="el-icon-upload"></i>
        <div class="upload-text">
          点击或拖拽文件到此区域上传
        </div>
        <div class="upload-hint">
          仅支持Excel文件 (.xls, .xlsx)
        </div>
      </div>
      <el-progress v-else :percentage="uploadProgress" :show-text="false"></el-progress>
    </div>
    <el-button 
      type="primary" 
      @click="uploadFile" 
      :disabled="!selectedFile || uploading" 
      style="margin-top: 15px"
    >
      {{ uploading ? '上传中...' : '上传' }}
    </el-button>
    <div v-if="selectedFile" class="file-info">
      已选择文件: {{ selectedFile.name }}
    </div>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FileUpload',
  data() {
    return {
      selectedFile: null,
      uploading: false,
      uploadProgress: 0,
      errorMessage: ''
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        if (this.validateFile(file)) {
          this.selectedFile = file;
          this.errorMessage = '';
        }
      }
    },
    onFileDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file) {
        if (this.validateFile(file)) {
          this.selectedFile = file;
          this.errorMessage = '';
        }
      }
    },
    validateFile(file) {
      const validExtensions = ['.xlsx', '.xls'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.'));
      
      if (!validExtensions.includes(fileExtension.toLowerCase())) {
        this.errorMessage = '无效的文件类型。仅支持Excel文件。';
        return false;
      }
      return true;
    },
    uploadFile() {
      if (!this.selectedFile) {
        return;
      }

      this.uploading = true;
      this.uploadProgress = 0;
      this.errorMessage = '';

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      axios.post('http://localhost:8000/dj_api/email/knowledge-graph/upload_file/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          this.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        }
      })
        .then(response => {
          this.$emit('upload-success', response.data);
          this.selectedFile = null;
          this.uploading = false;
        })
        .catch(error => {
          this.errorMessage = error.response?.data?.error || '文件上传失败';
          this.uploading = false;
          console.error('文件上传错误:', error);
        });
    }
  }
};
</script>

<style scoped>
.file-upload {
  margin-bottom: 20px;
}

.upload-box {
  border: 2px dashed #dcdfe6;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-box:hover {
  border-color: #409EFF;
}

.upload-text {
  margin: 10px 0;
  font-size: 14px;
  color: #606266;
}

.upload-hint {
  font-size: 12px;
  color: #909399;
}

.file-info {
  margin-top: 10px;
  font-size: 14px;
  color: #606266;
  word-break: break-all;
}

.error-message {
  margin-top: 10px;
  color: #f56c6c;
  font-size: 14px;
}

.el-icon-upload {
  font-size: 48px;
  color: #c0c4cc;
}
</style>