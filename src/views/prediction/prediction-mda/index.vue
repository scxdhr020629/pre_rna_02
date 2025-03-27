<template>
  <d2-container>
    <div class="about-content">
      <!-- Page Header -->
      <div class="page-header-container">
        <div class="page-header">
          <h1 class="title">Drug-MiRNA Association Query</h1>
          <p class="subtitle">
            Explore drug and miRNA relationships through our advanced query system
          </p>
        </div>
      </div>

      <div class="content">
        <div class="left-section">
          <div class="section-header">
            <i class="el-icon-search"></i>
            <span>Single Query Mode</span>
          </div>

          <!-- Add Query Type Selector -->
          <div class="query-type-selector">
            <el-radio-group v-model="queryType" size="medium" @change="onQueryTypeChange">
              <el-radio-button label="drug">Search by Drug</el-radio-button>
              <el-radio-button label="rna">Search by RNA</el-radio-button>
            </el-radio-group>
          </div>

          <div class="input-section">
            <el-input
              v-model="sequenceInput"
              :placeholder="getPlaceholder()"
              clearable
              class="input-field"
            >
              <template slot="prefix">
                <i :class="queryType === 'drug' ? 'el-icon-cpu' : 'el-icon-share'"></i>
              </template>
            </el-input>

            <el-button
              type="primary"
              :loading="loading"
              @click="fetchResults"
              class="query-button"
            >
              <i class="el-icon-search" v-if="!loading"></i>
              Search
            </el-button>
          </div>

          <div class="results-wrapper">
            <transition name="fade">
              <!-- Drug Search Results (RNA List) with Pagination -->
              <el-table
                v-if="resultsList.length > 0 && queryType === 'drug'"
                :data="paginatedResults"
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

              <!-- RNA Search Results (Drug List) with Pagination -->
              <el-table
                v-else-if="resultsList.length > 0 && queryType === 'rna'"
                :data="paginatedResults"
                class="result-table"
                :stripe="true"
                :border="true"
                height="calc(100vh - 400px)"
              >
                <el-table-column prop="DrugBank_ID" label="DrugBank ID" min-width="120">
                  <template slot-scope="scope">
                    <div class="drug-id">
                      <i class="el-icon-medicine-box"></i>
                      <span>{{ scope.row.DrugBank_ID }}</span>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column prop="smiles" label="SMILES" min-width="200">
                  <template slot-scope="scope">
                    <el-tooltip :content="scope.row.smiles" placement="top">
                      <div class="sequence-cell">{{ scope.row.smiles }}</div>
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
                        :percentage="parseFloat(scope.row.Probability) * 100"
                        :format="percentageFormat"
                        :color="customColorMethod(parseFloat(scope.row.Probability) * 100)"
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
                  Please enter a {{ queryType === 'drug' ? 'drug' : 'RNA' }} sequence to start your query
                </p>
                <el-button type="text" @click="showHelp">Need help?</el-button>
              </div>
            </transition>

            <!-- Pagination Component -->
            <div v-if="resultsList.length > 0" class="pagination-container">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5, 10, 20, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="resultsList.length"
              >
              </el-pagination>
            </div>
          </div>
        </div>

        <div class="right-section">
          <div class="section-header">
            <i class="el-icon-upload"></i>
            <span>Batch Upload Mode</span>
          </div>

          <!-- Add Batch Query Type Selector -->
          <div class="query-type-selector batch-selector">
            <el-radio-group v-model="batchQueryType" size="medium" @change="onBatchQueryTypeChange">
              <el-radio-button label="drug">Search by Drug</el-radio-button>
              <el-radio-button label="rna">Search by RNA</el-radio-button>
            </el-radio-group>
          </div>

          <div class="batch-instruction">
            <i class="el-icon-info-circle"></i>
            <span>Upload a file containing {{ getBatchInstructionText() }}</span>
          </div>

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
          <div class="help-tabs">
            <el-tabs v-model="helpActiveTab">
              <el-tab-pane label="Search by Drug" name="drug">
                <ol>
                  <li>Select "Search by Drug" option</li>
                  <li>Enter a valid drug sequence in the input field</li>
                  <li>Click the search button to find associated miRNAs</li>
                  <li>Review the results in the table below</li>
                </ol>
                <h4>Batch Upload</h4>
                <ol>
                  <li>Select "Search by Drug" in the Batch Upload section</li>
                  <li>Upload a CSV or Excel file containing drug sequences</li>
                  <li>Each row should contain one drug sequence</li>
                  <li>The system will process and return associated miRNAs</li>
                </ol>
              </el-tab-pane>
              <el-tab-pane label="Search by RNA" name="rna">
                <ol>
                  <li>Select "Search by RNA" option</li>
                  <li>Enter a valid RNA sequence in the input field</li>
                  <li>Click the search button to find associated drugs</li>
                  <li>Review the results in the table below</li>
                </ol>
                <h4>Batch Upload</h4>
                <ol>
                  <li>Select "Search by RNA" in the Batch Upload section</li>
                  <li>Upload a CSV or Excel file containing RNA sequences</li>
                  <li>Each row should contain one RNA sequence</li>
                  <li>The system will process and return associated drugs</li>
                </ol>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="help-note">
            <i class="el-icon-info"></i>
            <p>
              The probability score indicates the strength of the drug-miRNA
              association
            </p>
          </div>
        </div>
      </el-dialog>
    </div>
  </d2-container>
</template>

<script>
import * as XLSX from "xlsx";
import {get_rnas} from "@/api/modules/sys.predict.api";
import {get_all_rnas} from "@/api/modules/sys.predict.all.api";
import {get_drugs} from "@/api/modules/sys.predict.drug.api";
import {get_all_drugs} from "@/api/modules/sys.predict.all.drug.api";

export default {
  name: "DrugMiRNAQuery",
  data() {
    return {
      sequenceInput: "",
      queryType: "drug", // Default to drug search
      batchQueryType: "drug", // Default to drug search for batch upload
      resultsList: [],
      loading: false,
      fileList: [],
      table: {
        columns: [],
        data: [],
      },
      helpDialogVisible: false,
      helpActiveTab: "drug",
      customColors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#67c23a", percentage: 60 },
        { color: "#409eff", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 },
      ],
      
      // New pagination-related properties
      currentPage: 1,
      pageSize: 10, // Default page size
    };
  },
  computed: {
    // Computed property to handle pagination
    paginatedResults() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.resultsList.slice(start, end);
    }
  },
  methods: {
    getPlaceholder() {
      return this.queryType === 'drug' 
        ? "Please enter drug sequence" 
        : "Please enter RNA sequence";
    },
    
    getBatchInstructionText() {
      return this.batchQueryType === 'drug' 
        ? "drug sequences to find related RNAs" 
        : "RNA sequences to find related drugs";
    },
    
    onQueryTypeChange() {
      // Clear results when switching query type
      this.resultsList = [];
      this.sequenceInput = "";
      // Reset pagination
      this.currentPage = 1;
      this.pageSize = 10;
    },
    
    onBatchQueryTypeChange() {
      // Clear batch upload data when switching query type
      this.fileList = [];
      this.table.columns = [];
      this.table.data = [];
    },
    
    async fetchResults() {
      if (!this.sequenceInput) {
        this.$message.warning(`Please enter the ${this.queryType} sequence`);
        return;
      }
      
      this.loading = true;
      // Reset pagination when new results are fetched
      this.currentPage = 1;
      this.pageSize = 10;

      try {
        let response;
        if (this.queryType === 'drug') {
          // Call API for drug to RNA search
          console.log("drug_sequence:", this.sequenceInput);
          response = await get_rnas({
            drug_sequence: this.sequenceInput,
          });
          this.resultsList = response[1].data.data;
        } else {
          // Call API for RNA to drug search
          console.log("rna_sequence:", this.sequenceInput);
          response = await get_drugs({
            rna_sequence: this.sequenceInput,
          });
          this.resultsList = response[1].data.data;
        }

        console.log("Response:", response);
        
      } catch (error) {
        console.error("Request failed", error);
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
      this.loading = true;

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
          this.loading = false;
          return;
        }

        const rows = fileContent
          .split("\n")
          .map((row) => row.trim())
          .filter((row) => row);

        if (rows.length > 1) {
          const sequenceData = rows.slice(1).map((sequence) => ({ sequence }));
          console.log(sequenceData);
          try {
            let response;
            
            // Call different API based on batch query type
            if (this.batchQueryType === 'drug') {
              // Upload drug sequences to find related RNAs
              console.log("Batch processing drug sequences");
              response = await get_all_rnas({
                data: sequenceData,
              });
            } else {
              // Upload RNA sequences to find related drugs
              console.log("Batch processing RNA sequences");
              response = await get_all_drugs({
                data: sequenceData,
              });
            }

            console.log("Upload response:", response);
            
            if (response[1].code === 0) {
              this.$message.success(`File processed successfully. Finding ${this.batchQueryType === 'drug' ? 'RNAs' : 'drugs'} for your sequences.`);
              // Assume returns a download link
              if (response[1].data.data) {
                window.location.href = response[1].data.data;
              }
            } else {
              this.$message.error("Failed to process the file");
            }
          } catch (error) {
            console.error("Error uploading file:", error);
            this.$message.error("Failed to upload file");
          } finally {
            this.loading = false;
          }
        } else {
          this.$message.error(
            "The file is empty or does not contain any sequences"
          );
          this.loading = false;
        }
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        this.$message.error("Failed to read the file");
        this.loading = false;
      };

      reader.readAsBinaryString(file);
    },
    
    // Pagination methods
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.currentPage = 1; // Reset to first page when changing page size
    },

    handleCurrentChange(newPage) {
      this.currentPage = newPage;
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
      // Set the active tab based on the current query type
      this.helpActiveTab = this.queryType;
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


.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  background: #f8fafc;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}
/* Base variables for consistent scaling */
:root {
  --primary-color: #409eff;
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --danger-color: #f56c6c;
  --info-color: #909399;
  --border-radius: 12px;
  --transition-time: 0.3s;
}

/* Query type selector styles */
.query-type-selector {
  margin-bottom: 20px;
  text-align: center;
}

/* Batch query type selector specific styles */
.batch-selector {
  margin-bottom: 16px;
}

/* Batch instruction text */
.batch-instruction {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: #f0f8ff;
  border-radius: 8px;
  margin-bottom: 20px;
  color: #606266;
  font-size: 14px;
}

.batch-instruction i {
  font-size: 18px;
  margin-right: 10px;
  color: #409eff;
}

.query-type-selector >>> .el-radio-button__inner {
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.query-type-selector >>> .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 8px 0 0 8px;
}

.query-type-selector >>> .el-radio-button:last-child .el-radio-button__inner {
  border-radius: 0 8px 8px 0;
}

.query-type-selector >>> .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background: linear-gradient(135deg, #409eff, #67c23a);
  border-color: #409eff;
  box-shadow: 0 0 8px rgba(64, 158, 255, 0.4);
  transform: translateY(-1px);
}

/* Drug ID styles similar to RNA ID */
.drug-id {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #67c23a;
  font-weight: 500;
  width: 120px;
}

.drug-id i {
  font-size: 18px;
}

/* Help tabs styling */
.help-tabs {
  margin-bottom: 20px;
}

.help-tabs >>> .el-tabs__header {
  margin-bottom: 20px;
}

.help-tabs >>> .el-tabs__item {
  font-size: 15px;
  height: 40px;
  line-height: 40px;
}

.help-tabs >>> .el-tabs__item.is-active {
  color: #409eff;
  font-weight: 600;
}

.help-tabs >>> .el-tabs__active-bar {
  background: linear-gradient(90deg, #409eff, #67c23a);
  height: 3px;
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
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f2f5;
  position: relative;
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, #409eff, #67c23a);
}

.section-header i {
  font-size: 28px;
  margin-right: 15px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-header span {
  font-size: 1.4em;
  font-weight: 600;
  color: #2c3e50;
}

/* 输入区域样式 */
.input-section {
  display: flex;
  gap: 12px; /* 减小间距 */
  margin-bottom: 30px;
  align-items: center;
}

.input-field {
  flex: 1;
  transition: all 0.3s ease;
}

.input-field :deep(.el-input__inner) {
  height: 60px;
  border-radius: 15px;
  padding: 0 25px 0 60px;
  font-size: 18px;
  border: 2px solid #e4e7ed;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.input-field :deep(.el-input__prefix) {
  left: 20px;
}

.input-field :deep(.el-input__prefix i) {
  font-size: 24px;
  color: #409eff;
  transition: all 0.3s ease;
}

/* 查询按钮样式 */
.query-button {
  min-width: 80px;
  width: auto;
  height: 45px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  background: linear-gradient(135deg, #409eff, #67c23a);
  border: none;
  color: white;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 15px;
  margin-top: 8px;
  position: relative; /* 添加相对定位 */
  overflow: hidden; /* 确保光效不会溢出按钮边界 */
}

/* 添加光效动画 */
.query-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shine-button 3s infinite linear;
}

/* 光效动画关键帧 */
@keyframes shine-button {
  0% {
    left: -100%;
  }
  20%, 100% {
    left: 100%;
  }
}

/* 鼠标悬浮效果 */
.query-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(64, 158, 255, 0.2);
}

/* 鼠标悬浮时加快光效动画 */
.query-button:hover::before {
  animation-duration: 1.5s;
}

.query-button i {
  font-size: 14px;
  position: relative; /* 确保图标在光效之上 */
  z-index: 1;
}

/* 添加按钮文字样式 */
.query-button span {
  position: relative; /* 确保文字在光效之上 */
  z-index: 1;
}

/* 按钮点击效果 */
.query-button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.1);
}

/* 加载状态样式 */
.query-button.is-loading {
  opacity: 0.8;
  cursor: wait;
}

.query-button.is-loading::before {
  animation: none;
}

/* 结果表格样式 */
.results-wrapper {
  margin-top: 30px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.result-table {
  width: 100%;
  border-radius: 12px;
}

:deep(.el-table) {
  background: transparent;
}

:deep(.el-table th) {
  background: #f8fafc;
  padding: 16px;
  font-weight: 600;
  color: #2c3e50;
}

:deep(.el-table td) {
  padding: 16px;
}

/* RNA ID 样式 */
.rna-id {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #409eff;
  font-weight: 500;
  width: 120px; /* 固定 RNA ID 列宽 */
}

.rna-id i {
  font-size: 18px;
}

/* 序列单元格样式 */
.sequence-cell {
  font-family: 'Courier New', monospace;
  background: #f8fafc;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  border: 1px solid #e4e7ed;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px; /* 设置最大宽度 */
  display: block; /* 确保省略号正常显示 */
}

/* 概率进度条样式 */
.probability-wrapper {
  padding: 8px 0;
  width: 150px; /* 固定概率列宽 */
}

/* 调整表格列宽 */
:deep(.el-table .el-table__cell) {
  padding-right: 0;
  padding-left: 0;
}

:deep(.el-table .cell) {
  padding: 0 16px;
  white-space: nowrap;
}

/* 无结果样式 */
.no-result {
  padding: 60px 20px;
  text-align: center;
  background: #f8fafc;
  border-radius: 12px;
}

.no-result .empty-icon {
  font-size: 72px;
  color: #e4e7ed;
  margin-bottom: 20px;
}

.no-result p {
  color: #606266;
  font-size: 16px;
  margin: 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.no-result .el-button {
  margin-top: 20px;
  font-size: 15px;
  color: #409eff;
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

.help-content h4 {
  margin-top: 20px;
  margin-bottom: 10px;
  color: #606266;
  font-weight: 600;
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
  
  .content {
    grid-template-columns: 1fr;
  }

  .left-section,
  .right-section {
    margin-bottom: 24px;
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
  
  .input-section {
    flex-direction: column;
  }

  .query-button {
    width: 100%;
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