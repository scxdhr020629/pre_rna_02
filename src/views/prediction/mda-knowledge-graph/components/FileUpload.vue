<template>
  <div class="file-upload">
    <div class="section-header">
      <i class="el-icon-upload"></i>
      <span>Upload Knowledge Graph Data</span>
    </div>

    <el-upload
      class="upload-demo"
      drag
      ref="upload"
      :before-upload="validateFile"
      :on-change="handleFileChange"
      :auto-upload="false"
      :file-list="fileList"
      accept=".xlsx,.xls"
    >
      <div class="upload-content">
        <div class="upload-icon">
          <i class="el-icon-upload"></i>
        </div>
        <div class="upload-text">
          <p class="main-text">
            Drag Excel files here, or <em>click to upload</em>
          </p>
          <p class="upload-hint">Supports Excel files in .xlsx and .xls formats</p>
        </div>
      </div>
    </el-upload>

    <transition name="fade">
      <div v-if="selectedFile" class="file-info">
        <div class="file-header">
          <i class="el-icon-document"></i>
          <span>Selected File</span>
        </div>
        <div class="file-detail">{{ selectedFile.name }}</div>
        <el-button 
          type="primary"
          @click="uploadFile" 
          :loading="uploading" 
          :disabled="!selectedFile || uploading" 
          class="upload-button"
        >
          {{ uploading ? 'Processing...' : 'Start Processing' }}
        </el-button>
      </div>
    </transition>

    <el-progress 
      v-if="uploading" 
      :percentage="uploadProgress" 
      class="upload-progress"
    ></el-progress>

    <transition name="fade">
      <div v-if="errorMessage" class="error-message">
        <i class="el-icon-warning"></i>
        <span>{{ errorMessage }}</span>
      </div>
    </transition>
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
      errorMessage: '',
      fileList: []
    };
  },
  methods: {
    validateFile(file) {
      const validExtensions = ['.xlsx', '.xls'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validExtensions.includes(fileExtension)) {
        this.errorMessage = 'Invalid file type. Only Excel files (.xlsx, .xls) are supported';
        return false;
      }
      
      this.errorMessage = '';
      return true;
    },
    
    handleFileChange(file, fileList) {
      this.fileList = fileList.slice(-1); // Only keep the latest uploaded file
      if (file && file.raw) {
        this.selectedFile = file.raw;
        this.errorMessage = '';
        // Notify parent component that a file has been selected
        this.$emit('file-selected', file.raw);
      }
    },
    
    uploadFile() {
      if (!this.selectedFile) return;
      
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
          this.uploading = false;
          this.fileList = [];
          this.selectedFile = null;
        })
        .catch(error => {
          this.errorMessage = error.response?.data?.error || 'File processing failed, please check the format';
          this.uploading = false;
          this.$message.error('File processing failed');
          console.error('File upload error:', error);
        });
    }
  }
};
</script>

<style scoped>
/* File upload area styles */
.file-upload {
  padding-bottom: 20px;
}

/* Section header styles */
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f2f5;
  position: relative;
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, #409eff, #67c23a);
}

.section-header i {
  font-size: 24px;
  margin-right: 12px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-header span {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

/* Upload area styles */
.upload-demo {
  width: 100%;
  position: relative;
}

.upload-demo :deep(.el-upload) {
  width: 100%;
}

.upload-demo :deep(.el-upload-dragger) {
  width: 100%;
  height: auto;
  min-height: 180px;
  padding: 20px;
  box-sizing: border-box;
  border: 2px dashed #dcdfe6;
  border-radius: 12px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.upload-demo :deep(.el-upload-dragger:hover) {
  border-color: #409eff;
  background: #f0f7ff;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.upload-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(64, 158, 255, 0.1);
  transition: all 0.3s ease;
  transform: translateY(5px);
}

.upload-icon i {
  font-size: 32px;
  color: #409eff;
}

.upload-demo:hover .upload-icon {
  background: rgba(64, 158, 255, 0.2);
}

.upload-text {
  text-align: center;
}

.main-text {
  font-size: 16px;
  color: #606266;
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.main-text em {
  color: #409eff;
  font-style: normal;
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
}

.upload-hint {
  font-size: 14px;
  color: #909399;
  margin: 0;
  line-height: 1.5;
}

/* Upload animation */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.upload-demo:hover .upload-icon i {
  animation: bounce 1s ease infinite;
}

/* File info area */
.file-info {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  background: #f0f7ff;
  border: 1px solid #c6e2ff;
}

.file-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.file-header i {
  font-size: 18px;
  margin-right: 8px;
  color: #409eff;
}

.file-header span {
  font-weight: 600;
  color: #303133;
}

.file-detail {
  padding: 8px 12px;
  background: white;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  word-break: break-all;
  margin-bottom: 15px;
  border: 1px solid #ebeef5;
}

/* Upload button */
.upload-button {
  width: 100%;
  margin-top: 10px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  border: none;
  transition: all 0.3s ease;
}

.upload-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

/* Progress bar styles */
.upload-progress {
  margin-top: 15px;
}

/* Error message */
.error-message {
  display: flex;
  align-items: center;
  margin-top: 15px;
  padding: 10px 15px;
  background: #fef0f0;
  border-radius: 4px;
  border: 1px solid #fbc4c4;
}

.error-message i {
  font-size: 16px;
  color: #f56c6c;
  margin-right: 8px;
}

.error-message span {
  color: #f56c6c;
  font-size: 14px;
}

/* Fade-in fade-out animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>