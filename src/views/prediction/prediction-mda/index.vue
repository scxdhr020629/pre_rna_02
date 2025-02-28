<template>
  <d2-container>
    <template slot="header">
      <div class="page-header">
        <h1>Drug-MiRNA Association Query</h1>
      </div>
    </template>

    <div class="content">
      <div class="section left-section">
        <div class="section-header">
          <h2>Single Drug Query</h2>
        </div>

        <div class="input-section">
          <el-input
            v-model="drugName"
            placeholder="Please enter drug sequence"
            clearable
            class="input-field"
          >
            <template slot="prefix">
              <i class="el-icon-search"></i>
            </template>
          </el-input>

          <el-button
            type="primary"
            :loading="loading"
            @click="fetchMRNA"
            class="query-button"
            icon="el-icon-search"
          >
            Search
          </el-button>
        </div>

        <div class="results-container">
          <el-table
            v-if="mrnaList.length > 0"
            :data="mrnaList"
            class="result-table"
            :stripe="true"
            :border="true"
            height="400"
          >
            <el-table-column
              prop="RNA_ID"
              label="RNA_ID"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="Sequence"
              label="Sequence"
              min-width="200"
            ></el-table-column>
            <el-table-column
              prop="Probability"
              label="Probability"
              min-width="120"
            >
              <template slot-scope="scope">
                <el-progress
                  :percentage="scope.row.Probability * 100"
                  :format="percentageFormat"
                  :color="customColors"
                ></el-progress>
              </template>
            </el-table-column>
          </el-table>

          <div v-else class="no-result">
            <i class="el-icon-info-circle"></i>
            <p>Please enter the drug sequence and click on search.</p>
          </div>
        </div>
      </div>

      <div class="section right-section">
        <div class="section-header">
          <h2>Batch Upload</h2>
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
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
          <div slot="tip" class="el-upload__tip">
            Only .xlsx, .xls and .csv files are accepted
          </div>
        </el-upload>

        <div class="table-container">
          <el-table
            v-if="table.data.length > 0"
            :data="table.data"
            class="upload-table"
            :stripe="true"
            :border="true"
            height="400"
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
      </div>
    </div>
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
      customColors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 },
      ],
    };
  },

  methods: {
    percentageFormat(percentage) {
      return percentage.toFixed(2) + "%";
    },
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
  },
};
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 20px;
}

.page-header h1 {
  color: #2c3e50;
  font-size: 2em;
  font-weight: 600;
  margin: 0;
}

.content {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
  min-height: 80vh;
}

.section {
  flex: 1;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 24px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.section:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
}

.section-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f2f5;
}

.section-header h2 {
  color: #2c3e50;
  font-size: 1.5em;
  font-weight: 500;
  margin: 0;
}

.input-section {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.input-field {
  flex: 1;
}

.input-field :deep(.el-input__inner) {
  border-radius: 8px;
  height: 40px;
}

.query-button {
  min-width: 120px;
  height: 40px;
  border-radius: 8px;
  font-weight: 500;
}

.results-container {
  flex: 1;
  overflow: hidden;
}

.result-table {
  width: 100%;
  border-radius: 8px;
}

.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #909399;
  font-size: 1.1em;
}

.no-result i {
  font-size: 48px;
  margin-bottom: 16px;
  color: #dcdfe6;
}

.upload-demo {
  width: 100%;
  margin-bottom: 24px;
}

.upload-demo :deep(.el-upload-dragger) {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.upload-demo :deep(.el-upload-dragger:hover) {
  border-color: #409eff;
  background: #f0f7ff;
}

.upload-demo :deep(.el-icon-upload) {
  font-size: 48px;
  color: #909399;
  margin-bottom: 16px;
}

.el-upload__tip {
  color: #909399;
  font-size: 0.9em;
  text-align: center;
  margin-top: 8px;
}

.table-container {
  flex: 1;
  overflow: hidden;
}

.upload-table {
  width: 100%;
  border-radius: 8px;
}

/* Responsive Design */
@media screen and (max-width: 1200px) {
  .content {
    flex-direction: column;
  }

  .section {
    width: 100%;
    margin-bottom: 20px;
  }
}

/* Custom Scrollbar */
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
</style>