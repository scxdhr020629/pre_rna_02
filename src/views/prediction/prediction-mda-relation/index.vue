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


<style lang="scss" scoped>
.about-content {
  padding: 20px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;

  .page-header-container {
    margin-bottom: 30px;
    
    .page-header {
      text-align: center;
      padding: 20px 0;
      
      .title {
        color: #303133;
        font-size: 28px;
        margin-bottom: 10px;
        font-weight: 600;
      }
      
      .subtitle {
        color: #606266;
        font-size: 16px;
        margin: 0;
      }
    }
  }

  .content {
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
    
    .left-section,
    .right-section {
      flex: 1;
      min-width: 300px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ebeef5;
      
      i {
        font-size: 20px;
        color: #409EFF;
        margin-right: 8px;
      }
      
      span {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
      }
    }
  }
  
  .input-section {
    margin-bottom: 20px;
    
    .input-field {
      width: 100%;
      
      /deep/ .el-input__prefix {
        color: #909399;
      }
    }
  }
  
  .action-section {
    margin-bottom: 25px;
    display: flex;
    justify-content: center;
    
    .query-button {
      padding: 12px 25px;
      font-size: 16px;
      
      i {
        margin-right: 8px;
      }
    }
  }
  
  .results-wrapper {
    min-height: 300px;
    margin-top: 20px;
    
    .result-card {
      background-color: #f9f9f9;
      border-radius: 6px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      
      .result-header {
        margin-bottom: 15px;
        border-bottom: 1px solid #ebeef5;
        padding-bottom: 10px;
        
        h3 {
          margin: 0;
          color: #303133;
          font-size: 16px;
          font-weight: 600;
        }
      }
      
      .result-content {
        .sequence-pair {
          margin-bottom: 20px;
          
          .sequence-item {
            margin-bottom: 12px;
            
            .sequence-label {
              display: flex;
              align-items: center;
              margin-bottom: 6px;
              
              i {
                margin-right: 8px;
                color: #409EFF;
              }
              
              span {
                font-weight: 500;
                color: #606266;
              }
            }
            
            .sequence-value {
              padding: 8px 12px;
              background-color: #ecf5ff;
              border-radius: 4px;
              color: #606266;
              font-family: monospace;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              cursor: pointer;
            }
          }
        }
        
        .probability-display {
          padding: 15px;
          background-color: #fff;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          
          .probability-header {
            font-weight: 500;
            margin-bottom: 10px;
            color: #606266;
          }
          
          .probability-value {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #303133;
          }
          
          /deep/ .el-progress-bar__inner {
            transition: width 0.8s ease;
          }
        }
      }
    }
    
    .no-result {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      color: #909399;
      
      .empty-icon {
        font-size: 60px;
        color: #dcdfe6;
        margin-bottom: 20px;
      }
      
      p {
        margin-bottom: 20px;
        text-align: center;
        
        i {
          margin-right: 5px;
        }
      }
    }
  }
  
  .batch-instruction {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #f4f4f5;
    border-radius: 4px;
    margin-bottom: 20px;
    
    i {
      font-size: 16px;
      color: #909399;
      margin-right: 8px;
    }
    
    span {
      font-size: 14px;
      color: #606266;
      line-height: 1.5;
    }
  }
  
  .upload-demo {
    width: 100%;
    margin-bottom: 20px;
    
    /deep/ .el-upload {
      width: 100%;
      
      .el-upload-dragger {
        width: 100%;
        height: auto;
        padding: 30px 20px;
        
        &:hover {
          border-color: #409EFF;
        }
      }
    }
    
    .upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .upload-icon {
        font-size: 40px;
        color: #909399;
        margin-bottom: 15px;
      }
      
      .upload-text {
        text-align: center;
        
        .main-text {
          font-size: 16px;
          margin-bottom: 10px;
          
          em {
            color: #409EFF;
            font-style: normal;
            cursor: pointer;
          }
        }
        
        .upload-hint,
        .upload-format {
          color: #909399;
          font-size: 14px;
          margin: 5px 0;
        }
      }
    }
  }
  
  .table-wrapper {
    margin-top: 25px;
    
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      
      h3 {
        margin: 0;
        font-size: 16px;
        color: #303133;
      }
    }
    
    .upload-table {
      width: 100%;
      border-radius: 4px;
      overflow: hidden;
    }
  }
  
  .help-dialog {
    /deep/ .el-dialog__title {
      font-weight: 600;
    }
    
    .help-content {
      color: #303133;
      
      h3 {
        margin-top: 0;
        color: #409EFF;
        margin-bottom: 20px;
      }
      
      h4 {
        margin-top: 20px;
        margin-bottom: 10px;
        color: #606266;
      }
      
      ol {
        padding-left: 20px;
        
        li {
          margin-bottom: 8px;
        }
      }
      
      .help-note {
        display: flex;
        padding: 15px;
        background-color: #ecf5ff;
        border-radius: 4px;
        margin-top: 20px;
        
        i {
          font-size: 20px;
          color: #409EFF;
          margin-right: 10px;
        }
        
        p {
          margin: 0;
          color: #606266;
        }
      }
    }
  }
  
  // Animations
  .fade-enter-active, 
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  
  .fade-enter, 
  .fade-leave-to {
    opacity: 0;
  }
  
  // Responsive adjustments
  @media (max-width: 992px) {
    .content {
      flex-direction: column;
      
      .left-section,
      .right-section {
        width: 100%;
        margin-bottom: 20px;
      }
    }
  }
  
  @media (max-width: 576px) {
    .page-header {
      .title {
        font-size: 24px;
      }
    }
    
    .help-dialog {
      width: 90% !important;
    }
  }
}
</style>