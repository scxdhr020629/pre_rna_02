<template>
  <d2-container>
    <div class="about-content">
      <!-- Page Header -->
      <div class="page-header-container">
        <div class="page-header">
          <h1 class="title">Drug-MiRNA Association Probability</h1>
          <p class="subtitle">
            Calculate the probability of association between drugs and miRNAs
          </p>
        </div>
      </div>

      <div class="content">
        <div class="left-section">
          <div class="section-header">
            <i class="el-icon-connection"></i>
            <span>Single Query Mode</span>
          </div>

          <div class="input-section">
            <!-- Drug Input Field -->
            <el-input
              v-model="drugSequence"
              placeholder="Enter drug sequence"
              clearable
              class="input-field"
            >
              <template slot="prefix">
                <i class="el-icon-cpu"></i>
              </template>
            </el-input>
          </div>

          <div class="input-section">
            <!-- RNA Input Field -->
            <el-input
              v-model="rnaSequence"
              placeholder="Enter RNA sequence"
              clearable
              class="input-field"
            >
              <template slot="prefix">
                <i class="el-icon-share"></i>
              </template>
            </el-input>
          </div>

          <div class="action-section">
            <el-button
              type="primary"
              :loading="loading"
              @click="fetchRelation"
              class="query-button"
            >
              <i class="el-icon-connection" v-if="!loading"></i>
              Calculate Probability
            </el-button>
          </div>

          <div class="results-wrapper">
            <transition name="fade">
              <div v-if="result" class="result-card">
                <div class="result-header">
                  <h3>Association Probability</h3>
                </div>
                <div class="result-content">
                  <div class="sequence-pair">
                    <div class="sequence-item">
                      <div class="sequence-label">
                        <i class="el-icon-cpu"></i>
                        <span>Drug Sequence:</span>
                      </div>
                      <el-tooltip :content="result.drug_sequence" placement="top">
                        <div class="sequence-value">{{ truncateSequence(result.drug_sequence, 40) }}</div>
                      </el-tooltip>
                    </div>
                    <div class="sequence-item">
                      <div class="sequence-label">
                        <i class="el-icon-share"></i>
                        <span>RNA Sequence:</span>
                      </div>
                      <el-tooltip :content="result.rna_sequence" placement="top">
                        <div class="sequence-value">{{ truncateSequence(result.rna_sequence, 40) }}</div>
                      </el-tooltip>
                    </div>
                  </div>
                  
                  <div class="probability-display">
                    <div class="probability-header">Probability:</div>
                    <div class="probability-value">{{ formatProbability(result.probability) }}</div>
                    <el-progress 
                      :percentage="result.probability * 100"
                      :format="percentageFormat"
                      :color="customColorMethod(result.probability * 100)"
                      :stroke-width="20"
                    ></el-progress>
                  </div>
                </div>
              </div>

              <div v-else class="no-result">
                <i class="el-icon-connection empty-icon"></i>
                <p>
                  <i class="el-icon-info-circle"></i>
                  Please enter both drug and RNA sequences to calculate their association probability
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

          <div class="batch-instruction">
            <i class="el-icon-info-circle"></i>
            <span>Upload a file containing drug and RNA sequence pairs to analyze multiple associations at once</span>
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
                <p class="upload-format">File should contain columns: drug_sequence and rna_sequence</p>
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
        title="Drug-RNA Association Help"
        :visible.sync="helpDialogVisible"
        width="50%"
        custom-class="help-dialog"
      >
        <div class="help-content">
          <h3>How to use the Drug-RNA Association Calculator</h3>
          
          <h4>Single Query Mode</h4>
          <ol>
            <li>Enter a valid drug sequence in the first input field</li>
            <li>Enter a valid RNA sequence in the second input field</li>
            <li>Click the "Calculate Probability" button</li>
            <li>View the association probability result</li>
          </ol>
          
          <h4>Batch Upload</h4>
          <ol>
            <li>Prepare a CSV or Excel file with two columns: drug_sequence and rna_sequence</li>
            <li>Each row should contain one drug-RNA pair</li>
            <li>Upload the file using the drag and drop area</li>
            <li>The system will process all pairs and return association probabilities</li>
          </ol>
          
          <div class="help-note">
            <i class="el-icon-info"></i>
            <p>
              The probability score indicates the likelihood of association between the specific drug and RNA sequence pair
            </p>
          </div>
        </div>
      </el-dialog>
    </div>
  </d2-container>
</template>

<script>
import * as XLSX from "xlsx";
import {get_drug_rna_relation} from "@/api/modules/sys.predict.relation.api";
import {get_all_drug_rna_relation} from "@/api/modules/sys.predict.all.relation.api";

export default {
  name: "DrugRnaRelation",
  data() {
    return {
      drugSequence: "",
      rnaSequence: "",
      result: null,
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
    async fetchRelation() {
      if (!this.drugSequence || !this.rnaSequence) {
        this.$message.warning("Please enter both drug and RNA sequences");
        return;
      }
      
      this.loading = true;
      try {
        const response = await get_drug_rna_relation({
          drug_sequence: this.drugSequence,
          rna_sequence: this.rnaSequence,
        });
        
        console.log("Response:", response);
        
        if (response && response[1] && response[1].data && response[1].data.data) {
          this.result = response[1].data.data;
        } else {
          this.$message.error("Invalid response format");
        }
      } catch (error) {
        console.error("Request failed", error);
        this.$message.error("Request failed. Please try again later.");
      } finally {
        this.loading = false;
      }
    },
    
    formatProbability(prob) {
      if (prob < 0.0001) {
        return "0.0";
      }
      
      // Convert to string with many decimal places first
      const probStr = prob.toFixed(10);
      
      // Split at decimal point
      const parts = probStr.split('.');
      
      // Reconstruct with exactly 4 decimal places (truncated, not rounded)
      return `${parts[0]}.${parts[1].substring(0, 4)}`;
    },
    
    percentageFormat(val) {
      const formattedVal = this.formatProbability(val / 100);
      return formattedVal;
    },

    customColorMethod(percentage) {
      if (percentage < 30) return "#f56c6c";
      if (percentage < 50) return "#e6a23c";
      if (percentage < 70) return "#67c23a";
      if (percentage < 90) return "#409eff";
      return "#6f7ad3";
    },
    
    truncateSequence(sequence, maxLength) {
      if (!sequence) return "";
      return sequence.length > maxLength 
        ? sequence.substring(0, maxLength) + "..." 
        : sequence;
    },
    
    showHelp() {
      this.helpDialogVisible = true;
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
      this.fileList = fileList.slice(-1); // Only keep the latest uploaded file
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
          
          // Check if headers contain required columns
          if (!headers.includes('drug_sequence') || !headers.includes('rna_sequence')) {
            this.$message.error(
              "The file must contain 'drug_sequence' and 'rna_sequence' columns"
            );
            this.loading = false;
            return;
          }
          
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
          
          try {
            // Prepare data for batch API call
            const batchData = this.table.data.map(row => ({
              drug_sequence: row.drug_sequence,
              rna_sequence: row.rna_sequence,
            }));
            
            const response = await get_all_drug_rna_relation({
              data: batchData,
            });

            console.log("Batch upload response:", response);
            
            if (response[1].code === 0) {
              this.$message.success("File processed successfully. Calculating association probabilities.");
              // Assume response returns a download link
              if (response[1].data.data) {
                window.location.href = response[1].data.data;
              }
            } else {
              this.$message.error("Failed to process the file");
            }
          } catch (error) {
            console.error("Error processing batch:", error);
            this.$message.error("Failed to process batch request");
          }
        } else {
          this.$message.error(
            "The file is empty or does not contain valid data"
          );
        }
        
        this.loading = false;
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        this.$message.error("Failed to read the file");
        this.loading = false;
      };

      reader.readAsBinaryString(file);
    },
    
    exportData() {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(this.table.data);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
      XLSX.writeFile(workbook, "drug_mirna_relations.xlsx");
    },
  },
};
</script>


<style scoped>
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

/* Content area layout */
.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 20px;
  min-height: calc(100vh - 200px);
}

/* Left and right section base styles */
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

/* Section header styles */
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

/* Input section styles */
.input-section {
  display: flex;
  gap: 12px; /* Reduced spacing */
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

/* Action section */
.action-section {
  display: flex;
  /* justify-content: center; */
  margin-bottom: 30px;
   width: 100%;
}

/* Query button styles */
.query-button {
  /* min-width: 180px; */
  width: 100%;
  height: 45px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, #409eff, #67c23a);
  border: none;
  color: white;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 20px;
  position: relative; /* Added relative positioning */
  overflow: hidden; /* Ensure light effect doesn't overflow */
}

/* Add light effect animation */
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

/* Light effect animation keyframes */
@keyframes shine-button {
  0% {
    left: -100%;
  }
  20%, 100% {
    left: 100%;
  }
}

/* Hover effects */
.query-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(64, 158, 255, 0.2);
}

/* Speed up light effect on hover */
.query-button:hover::before {
  animation-duration: 1.5s;
}

.query-button i {
  font-size: 16px;
  position: relative; /* Ensure icon is above light effect */
  z-index: 1;
}

/* Button text styles */
.query-button span {
  position: relative; /* Ensure text is above light effect */
  z-index: 1;
}

/* Click effect */
.query-button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.1);
}

/* Loading state styles */
.query-button.is-loading {
  opacity: 0.8;
  cursor: wait;
}

.query-button.is-loading::before {
  animation: none;
}

/* Results wrapper styles */
.results-wrapper {
  margin-top: 30px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

/* Result card styles */
.result-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.result-header {
  padding: 16px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #ebeef5;
}

.result-header h3 {
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
  font-weight: 600;
}

.result-content {
  padding: 20px;
}

.sequence-pair {
  margin-bottom: 25px;
}

.sequence-item {
  margin-bottom: 15px;
  animation: fadeIn 0.5s ease-out;
}

.sequence-label {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 500;
  color: #606266;
}

.sequence-label i {
  margin-right: 8px;
  font-size: 18px;
  color: #409eff;
}

.sequence-value {
  background: #f8fafc;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 10px 15px;
  font-family: monospace;
  color: #606266;
  word-break: break-all;
  cursor: pointer;
}

/* Probability display */
.probability-display {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  animation: fadeIn 0.7s ease-out;
}

.probability-header {
  font-size: 16px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 10px;
}

.probability-value {
  font-size: 28px;
  font-weight: 700;
  color: #409eff;
  margin-bottom: 15px;
}

/* No result styles */
.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 40px 20px;
  text-align: center;
  color: #909399;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  color: #dcdfe6;
}

.no-result p {
  margin-bottom: 15px;
  font-size: 16px;
  line-height: 1.6;
}

.no-result i {
  margin-right: 5px;
  color: #909399;
}

/* Batch instruction styles */
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

/* Upload demo styles */
/* Upload styles with specific attention to consistency */
/* Upload styles to match exactly with prediction-mda/index.vue */
.upload-demo :deep(.el-upload) {
  width: 100%;
}

.upload-demo :deep(.el-upload-dragger) {
  width: 100%;
  height: auto;
  padding: 30px 20px;
  border-radius: 8px;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff, #67c23a);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.upload-demo:hover .upload-icon {
  animation-duration: 1.5s;
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

.upload-icon i {
  font-size: 36px;
  color: #fff;
}

.upload-text {
  text-align: center;
}

.main-text {
  font-size: 16px;
  color: #606266;
  margin-bottom: 10px;
}

.main-text em {
  color: #409eff;
  font-style: normal;
  font-weight: 500;
}

.upload-hint {
  color: #909399;
  font-size: 14px;
}

/* Table wrapper styles */
.table-wrapper {
  margin-top: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #ebeef5;
}

.table-header h3 {
  margin: 0;
  font-size: 16px;
  color: #2c3e50;
  font-weight: 600;
}

.upload-table {
  width: 100%;
}

.upload-table :deep(.el-table__header-wrapper th) {
  background-color: #f8fafc;
  color: #606266;
  font-weight: 600;
  padding: 12px 0;
}

.upload-table :deep(.el-table__row) {
  transition: background-color 0.3s;
}

.upload-table :deep(.el-table__row:hover > td) {
  background-color: #f5f7fa;
}

/* Help dialog styles */
.help-content {
  padding: 10px;
}

.help-content h3 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.help-content h4 {
  color: #409eff;
  margin-top: 20px;
  margin-bottom: 15px;
}

.help-content ol {
  padding-left: 20px;
  margin-bottom: 20px;
}

.help-content li {
  margin-bottom: 10px;
  color: #606266;
}

.help-note {
  background: #f0f8ff;
  border-radius: 8px;
  padding: 15px;
  margin-top: 25px;
  display: flex;
  align-items: flex-start;
}

.help-note i {
  font-size: 20px;
  color: #409eff;
  margin-right: 10px;
}

.help-note p {
  margin: 0;
  color: #606266;
  line-height: 1.6;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive styles */
@media (max-width: 992px) {
  .content {
    grid-template-columns: 1fr;
  }
  
  .left-section,
  .right-section {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 0.4rem 0;
  }
  
  .title {
    font-size: calc(1.2rem + 0.5vw);
  }
  
  .subtitle {
    font-size: calc(0.6rem + 0.2vw);
  }
  
  .input-field :deep(.el-input__inner) {
    height: 50px;
    font-size: 16px;
  }
}

@media (max-width: 576px) {
  .content {
    padding: 10px;
  }
  
  .left-section,
  .right-section {
    padding: 15px;
  }
  
  .title {
    font-size: calc(1rem + 0.5vw);
  }
}
</style>