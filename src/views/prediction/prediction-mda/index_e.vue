<template>
  <d2-container>
    <template slot="header">Drug-MiRNA Association Query</template>

    <div class="content">
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
      <el-table :data="table.data" style="width: 100%">
        <el-table-column
          v-for="(column, index) in table.columns"
          :key="index"
          :prop="column.prop"
          :label="column.label"
        >
        </el-table-column>
      </el-table>
    </div>
  </d2-container>
</template>

<script>
import log from '@/libs/util.log';
import * as XLSX from "xlsx";

export default {
  name: "DrugMiRNAQuery",
  data() {
    return {
      fileList: [], // 上传的文件列表
      table: {
        columns: [], // 表格列
        data: [], // 表格数据
      },
    };
  },
  methods: {
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
        const rows = fileContent
          .split("\n")
          .map((row) => row.trim())
          .filter((row) => row);

        if (rows.length > 1) {
          const sequenceData = rows.slice(1).map((sequence) => ({ sequence }));
          console.log(sequenceData)
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

      reader.readAsText(file);
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

.upload-demo {
  width: 300px;
  margin-bottom: 20px;
}

.el-table {
  width: 100%;
  margin-top: 20px;
}
</style>