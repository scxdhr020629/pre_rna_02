<template>
  <d2-container>
    <template slot="header">
      <div class="page-header">
        <h1 class="title">Drug-MiRNA Association Query</h1>
        <p class="subtitle">
          Explore drug and miRNA relationships through our advanced query system
        </p>
      </div>
    </template>

    <div class="content">
      <div class="left-section">
        <div class="section-header">
          <i class="el-icon-search"></i>
          <span>Single Query Mode</span>
        </div>

        <div class="input-section">
          <el-input
            v-model="drugName"
            placeholder="Please enter drug sequence"
            clearable
            class="input-field"
          >
            <template slot="prefix">
              <i class="el-icon-cpu"></i>
            </template>
          </el-input>

          <el-button
            type="primary"
            :loading="loading"
            @click="fetchMRNA"
            class="query-button"
          >
            <i class="el-icon-search" v-if="!loading"></i>
            Search
          </el-button>
        </div>

        <div class="results-wrapper">
          <transition name="fade">
            <el-table
              v-if="mrnaList.length > 0"
              :data="mrnaList"
              class="result-table"
              :stripe="true"
              :border="true"
              height="calc(100vh - 400px)"
            >
              <el-table-column prop="RNA_ID" label="RNA_ID" min-width="120">
                <template slot-scope="scope">
                  <div class="rna-id">
                    <i class="el-icon-view"></i>
                    <span>{{ scope.row.RNA_ID }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column prop="Sequence" label="Sequence" min-width="200">
                <template slot-scope="scope">
                  <el-tooltip :content="scope.row.Sequence" placement="top">
                    <div class="sequence-cell">{{ scope.row.Sequence }}</div>
                  </el-tooltip>
                </template>
              </el-table-column>

              <el-table-column
                prop="Probability"
                label="Probability"
                min-width="150"
              >
                <template slot-scope="scope">
                  <div class="probability-wrapper">
                    <el-progress
                      :percentage="scope.row.Probability * 100"
                      :format="percentageFormat"
                      :color="customColorMethod(scope.row.Probability * 100)"
                      :stroke-width="16"
                    ></el-progress>
                  </div>
                </template>
              </el-table-column>
            </el-table>

            <div v-else class="no-result">
              <i class="el-icon-search empty-icon"></i>
              <p>
                <i class="el-icon-info-circle"></i>
                Please enter a drug sequence to start your query
              </p>
              <el-button type="text" @click="showHelp">Need help?</el-button>
            </div>
          </transition>
        </div>
      </div>

      <div class="right-section">
        <div class="section-header">
          <i class="el-icon-upload"></i>
          <span>Batch Upload Mode</span>
        </div>

        <!-- <el-upload
          class="upload-demo"
          ref="upload"
          :before-upload="beforeUpload"
          :on-change="handleChange"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :file-list="fileList"
          :http-request="handleUpload"
          accept=".xlsx, .xls, .csv"
          drag
        >
          <div class="upload-content">
            <i class="el-icon-upload"></i>
            <div class="upload-text">
              <p>Drop your file here or <em>click to upload</em></p>
              <p class="upload-hint">Support for .xlsx, .xls and .csv files</p>
            </div>
          </div>
        </el-upload> -->
        <el-upload
          class="upload-demo"
          ref="upload"
          :before-upload="beforeUpload"
          :on-change="handleChange"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :file-list="fileList"
          :http-request="handleUpload"
          accept=".xlsx, .xls, .csv"
          drag
        >
          <div class="upload-content">
            <div class="upload-icon">
              <i class="el-icon-upload"></i>
            </div>
            <div class="upload-text">
              <p class="main-text">
                Drop your file here or <em>click to upload</em>
              </p>
              <p class="upload-hint">Support for .xlsx, .xls and .csv files</p>
            </div>
          </div>
        </el-upload>

        <transition name="fade">
          <div v-if="table.data.length > 0" class="table-wrapper">
            <div class="table-header">
              <h3>Uploaded Data Preview</h3>
              <el-button
                type="text"
                icon="el-icon-download"
                @click="exportData"
              >
                Export Data
              </el-button>
            </div>

            <el-table
              :data="table.data"
              class="upload-table"
              :stripe="true"
              :border="true"
              height="calc(100vh - 500px)"
            >
              <el-table-column
                v-for="(column, index) in table.columns"
                :key="index"
                :prop="column.prop"
                :label="column.label"
                min-width="120"
              >
              </el-table-column>
            </el-table>
          </div>
        </transition>
      </div>
    </div>

    <!-- Help Dialog -->
    <el-dialog
      title="Query Help"
      :visible.sync="helpDialogVisible"
      width="50%"
      custom-class="help-dialog"
    >
      <div class="help-content">
        <h3>How to use the Drug-MiRNA Query Tool</h3>
        <ol>
          <li>Enter a valid drug sequence in the input field</li>
          <li>Click the search button to find associated miRNAs</li>
          <li>Review the results in the table below</li>
        </ol>
        <div class="help-note">
          <i class="el-icon-info"></i>
          <p>
            The probability score indicates the strength of the drug-miRNA
            association
          </p>
        </div>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import * as XLSX from "xlsx";

export default {
  name: "DrugMiRNAQuery",
  data() {
    return {
      drugName: "",
      mrnaList: [],
      loading: false,
      fileList: [],
      table: {
        columns: [],
        data: [],
      },
      helpDialogVisible: false,
      customColors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#67c23a", percentage: 60 },
        { color: "#409eff", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 },
      ],
    };
  },
  methods: {
    async fetchMRNA() {
      if (!this.drugName) {
        this.$message.warning("Please enter the drug sequence");
        return;
      }
      this.loading = true;

      try {
        console.log("drug_sequence:", this.drugName); // 打印 drugName 查看是否正确

        // 调用 get_rnas API，传入 drugName 作为 drug_sequence
        const response = await this.$api.get_rnas({
          drug_sequence: this.drugName,
        });

        // 直接将返回的 RNA 数据赋值给 mrnaList
        this.mrnaList = response[1].data.data; // 假设 API 直接返回了 RNA 数据数组
        console.log("vue 中的数据");
        console.log(response);
        console.log(response[1].msg);
        console.log(response[1].data);
        console.log(response[1].data.data[1]);
        console.log(this.mrnaList);
      } catch (error) {
        console.error("Request failed", error); // 打印错误信息
        this.$message.error("Request failed. Please try again later.");
      } finally {
        this.loading = false;
      }
    },
    beforeUpload(file) {
      const isAcceptedFormat =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel" ||
        file.type === "text/csv";
      if (!isAcceptedFormat) {
        this.$message.error("Only .xlsx, .xls and .csv files are accepted");
      }
      return isAcceptedFormat;
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1); // 只保留最新上传的一个文件
    },
    handleUploadSuccess(response, file, fileList) {
      this.fileList = fileList;
      this.$message.success("Upload successful");
    },
    handleUploadError(err, file, fileList) {
      this.$message.error("Upload failed");
    },
    async handleUpload({ file }) {
      console.log("Uploading file:", file);

      const reader = new FileReader();

      reader.onload = async (event) => {
        const fileContent = event.target.result;
        const workbook = XLSX.read(fileContent, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length > 1) {
          const headers = jsonData[0];
          const data = jsonData.slice(1);

          this.table.columns = headers.map((header) => ({
            label: header,
            prop: header,
          }));
          this.table.data = data.map((row) => {
            const rowData = {};
            headers.forEach((header, index) => {
              rowData[header] = row[index];
            });
            return rowData;
          });

          console.log("Parsed table data:", this.table);
        } else {
          this.$message.error(
            "The file is empty or does not contain any sequences"
          );
        }

        const rows = fileContent
          .split("\n")
          .map((row) => row.trim())
          .filter((row) => row);

        if (rows.length > 1) {
          const sequenceData = rows.slice(1).map((sequence) => ({ sequence }));
          console.log(sequenceData);
          try {
            const response = await this.$api.get_all_rnas({
              data: sequenceData,
            });

            console.log("Upload response:", response);
            console.log("now");
            console.log(response[1].data);
            if (response[1].code === 0) {
              this.$message.success("File processed successfully");
              // 假设返回一个下载链接
              if (response[1].data.data) {
                window.location.href = response[1].data.data;
              }
            } else {
              this.$message.error("Failed to process the file");
            }
          } catch (error) {
            console.error("Error uploading file:", error);
            this.$message.error("Failed to upload file");
          }
        } else {
          this.$message.error(
            "The file is empty or does not contain any sequences"
          );
        }
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        this.$message.error("Failed to read the file");
      };

      reader.readAsBinaryString(file);
    },
    // 新增方法
    percentageFormat(val) {
      return val.toFixed(2) + "%";
    },

    customColorMethod(percentage) {
      if (percentage < 30) return "#f56c6c";
      if (percentage < 50) return "#e6a23c";
      if (percentage < 70) return "#67c23a";
      if (percentage < 90) return "#409eff";
      return "#6f7ad3";
    },

    showHelp() {
      this.helpDialogVisible = true;
    },

    exportData() {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(this.table.data);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
      XLSX.writeFile(workbook, "drug_mirna_results.xlsx");
    },
  },
};
</script>

<style scoped>
/* 基础样式重置和变量定义 */
:root {
  --primary-color: #409eff;
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --danger-color: #f56c6c;
  --info-color: #909399;
  --border-radius: 12px;
  --transition-time: 0.3s;
}

/* 页面标题样式 */
.page-header {
  text-align: center;
  padding: 20px 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: var(--border-radius);
  margin-bottom: 24px;
}

.title {
  font-size: 2.5em;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.subtitle {
  color: #5e6d82;
  margin-top: 8px;
  font-size: 1.1em;
}

/* 内容区布局 */
.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 20px;
  min-height: calc(100vh - 200px);
}

/* 左右区块基础样式 */
.left-section,
.right-section {
  background: #ffffff;
  border-radius: var(--border-radius);
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform var(--transition-time) ease,
    box-shadow var(--transition-time) ease;
}

.left-section:hover,
.right-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* 区块标题样式 */
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f2f5;
}

.section-header i {
  font-size: 24px;
  margin-right: 12px;
  color: var(--primary-color);
}

.section-header span {
  font-size: 1.25em;
  font-weight: 600;
  color: #2c3e50;
}

/* 输入区域样式 */
.input-section {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.input-field {
  flex: 1;
}

.input-field :deep(.el-input__inner) {
  height: 48px;
  border-radius: 8px;
  padding: 0 16px 0 40px;
  font-size: 16px;
  border: 2px solid #e4e7ed;
  transition: all var(--transition-time) ease;
}

.input-field :deep(.el-input__prefix) {
  left: 12px;
  color: var(--primary-color);
}

.query-button {
  min-width: 120px;
  height: 48px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #409eff, #337ecc);
  border: none;
  transition: all var(--transition-time) ease;
}

.query-button i {
  font-size: 18px;
}

/* 表格样式增强 */
.results-wrapper,
.table-wrapper {
  position: relative;
  margin-top: 20px;
}

.result-table,
.upload-table {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

/* 表格单元格样式 */
.rna-id {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sequence-cell {
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.probability-wrapper {
  padding: 8px 0;
}

/* 文件上传区域样式 */
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
  min-height: 200px;
  padding: 30px 20px;
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
  gap: 20px;
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
  transform: translateY(10px); /* 添加这一行，让图标默认位置低一些 */
}

.upload-icon i {
  font-size: 32px;
  color: #409eff;
}

.upload-demo:hover .upload-icon {
  /* transform: translateY(-5px); */
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
  padding: 0 20px;
}

/* 添加文件列表样式 */
.upload-demo :deep(.el-upload-list) {
  margin-top: 15px;
}

.upload-demo :deep(.el-upload-list__item) {
  transition: all 0.3s ease;
  border-radius: 6px;
  margin-top: 8px;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .upload-demo :deep(.el-upload-dragger) {
    min-height: 160px;
    padding: 20px 15px;
  }

  .upload-icon {
    width: 48px;
    height: 48px;
  }

  .upload-icon i {
    font-size: 24px;
  }

  .main-text {
    font-size: 14px;
  }

  .upload-hint {
    font-size: 12px;
  }
}

/* 上传动画 */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  
}

.upload-demo:hover .upload-icon i {
  animation: bounce 1s ease infinite;
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-time) ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* 帮助对话框样式 */
.help-dialog {
  border-radius: var(--border-radius);
}

.help-content {
  padding: 20px;
}

.help-note {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

/* 响应式设计优化 */
@media (max-width: 1200px) {
  .content {
    grid-template-columns: 1fr;
  }

  .left-section,
  .right-section {
    margin-bottom: 24px;
  }
}

@media (max-width: 768px) {
  .input-section {
    flex-direction: column;
  }

  .query-button {
    width: 100%;
  }

  .title {
    font-size: 2em;
  }
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
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

.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #909399;
}

.no-result .empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  color: #dcdfe6;
}

.no-result p {
  font-size: 16px;
  margin: 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.no-result .el-icon-info-circle {
  font-size: 18px;
  color: #409eff;
}

.no-result .el-button {
  margin-top: 16px;
  font-size: 14px;
}
</style>