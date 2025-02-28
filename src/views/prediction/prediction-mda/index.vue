<template>
  <d2-container>
    <template slot="header">Drug-MiRNA Association Query</template>

    <div class="content">
      <div class="query-section">
        <!-- 输入药物名称 -->
        <el-input
          v-model="drugName"
          placeholder="Please enter drug sequence"
          clearable
          class="input-field"
        ></el-input>

        <!-- 查询按钮 -->
        <el-button
          type="primary"
          :loading="loading"
          @click="fetchMRNA"
          class="query-button"
        >
          Search
        </el-button>
      </div>

      <!-- 显示相关的mRNA -->
      <el-table
        v-if="mrnaList.length > 0"
        :data="mrnaList"
        class="result-table"
      >
        <el-table-column prop="RNA_ID" label="RNA_ID"></el-table-column>
        <el-table-column prop="Sequence" label="Sequence"></el-table-column>
        <el-table-column
          prop="Probability"
          label="Probability"
        ></el-table-column>
      </el-table>

      <!-- 如果没有数据或还没查询 -->
      <div v-else class="no-result">
        <p>Please enter the drug sequence and click on search.</p>
      </div>

      <div class="upload-section">
        <!-- 文件上传按钮 -->
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
        >
          <el-button slot="trigger" size="small" type="primary"
            >Upload File</el-button
          >
          <div slot="tip" class="el-upload__tip">
            Only .xlsx, .xls and .csv files are accepted
          </div>
        </el-upload>

        <!-- 显示上传的表格数据 -->
        <el-table
          v-if="table.data.length > 0"
          :data="table.data"
          class="upload-table"
        >
          <el-table-column
            v-for="(column, index) in table.columns"
            :key="index"
            :prop="column.prop"
            :label="column.label"
          >
          </el-table-column>
        </el-table>
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
      drugName: "", // 用户输入的drug sequence
      mrnaList: [], // 存储返回的mRNA数据
      loading: false, // 加载状态
      fileList: [], // 上传的文件列表
      table: {
        columns: [], // 表格列
        data: [], // 表格数据
      },
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
      
          try {

            const response = await this.$api.get_all_rnas({ data: sequenceData });

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
/* 页面整体样式 */
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.query-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.input-field {
  width: 100%;
  margin-bottom: 20px;
}

.query-button {
  width: 100%;
}

.result-table {
  width: 100%;
  margin-top: 20px;
}

.no-result {
  color: #888;
  font-size: 16px;
}

.upload-demo {
  width: 100%;
  margin-bottom: 20px;
}

.upload-table {
  width: 100%;
  margin-top: 20px;
}
</style>