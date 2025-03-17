<template>
  <d2-container>
    <template slot="header">
      <div class="page-header">
        <h1 class="title">About Our Team</h1>
        <p class="subtitle">Meet the experts behind our RNA prediction technology</p>
      </div>
    </template>

    <div class="about-content">
      <!-- Project Introduction -->
      <div class="section project-intro">
        <h2>Our Mission</h2>
        <p>
          We are dedicated to advancing RNA structure prediction through innovative computational approaches.
          Our tools help researchers understand RNA function and enable breakthroughs in areas like drug discovery,
          genetic engineering, and disease treatment.
        </p>
      </div>

      <!-- Team Section -->
      <div class="section team-section">
        <h2>Our Team</h2>
        
        <el-row :gutter="40" class="team-container">
          <!-- Team Member 1 -->
          <el-col :xs="24" :sm="24" :md="8" :lg="8" class="team-col">
            <div class="team-card">
              <div class="member-avatar">
                <img src="./images/huanglan.jpg" alt="Lan Huang" onerror="this.src='/static/images/avatars/default.png'">
              </div>
              <div class="member-info">
                <h3>Lan Huang</h3>
                <div class="email">huanglan@jlu.edu.cn</div>
                <div class="divider"></div>
                <p class="bio">Specialized in computational biology with expertise in RNA folding algorithms.</p>
                <div class="contact">
                  <el-tooltip content="Email" placement="top">
                    <a href="mailto:huanglan@jlu.edu.cn"><i class="el-icon-message"></i></a>
                  </el-tooltip>
                  <el-tooltip content="ResearchGate" placement="top">
                    <a href="https://www.researchgate.net/profile/Lan-Huang-7" target="_blank"><i class="el-icon-share"></i></a>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </el-col>

          <!-- Team Member 2 -->
          <el-col :xs="24" :sm="24" :md="8" :lg="8" class="team-col">
            <div class="team-card">
              <div class="member-avatar">
                <img src="./images/wangyan.png" alt="Yan Wang" onerror="this.src='/static/images/avatars/default.png'">
              </div>
              <div class="member-info">
                <h3>Yan Wang</h3>
                <div class="email">wy6868@jlu.edu.cn</div>
                <div class="divider"></div>
                <p class="bio">Focuses on developing AI models for accurate RNA secondary structure prediction.</p>
                <div class="contact">
                  <el-tooltip content="Email" placement="top">
                    <a href="mailto:wy6868@jlu.edu.cn"><i class="el-icon-message"></i></a>
                  </el-tooltip>
                  <el-tooltip content="Google Scholar" placement="top">
                    <a href="https://scholar.google.com/citations?user=nxf-ryQAAAAJ&hl=zh-CN" target="_blank"><i class="el-icon-share"></i></a>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </el-col>

          <!-- Team Member 3 -->
          <el-col :xs="24" :sm="24" :md="8" :lg="8" class="team-col">
            <div class="team-card">
              <div class="member-avatar">
                <img src="./images/shengnan.jpg" alt="Nan Sheng" onerror="this.src='/static/images/avatars/default.png'">
              </div>
              <div class="member-info">
                <h3>Nan Sheng</h3>
                <div class="email">shengnan@jlu.edu.cn</div>
                <div class="divider"></div>
                <p class="bio">Expert in optimization algorithms and data structures for RNA analysis.</p>
                <div class="contact">
                  <el-tooltip content="Email" placement="top">
                    <a href="mailto:shengnan@jlu.edu.cn"><i class="el-icon-message"></i></a>
                  </el-tooltip>
                  <el-tooltip content="Google Scholar" placement="top">
                    <a href="https://scholar.google.com.hk/citations?user=MeSogXgAAAAJ&hl=zh-CN" target="_blank"><i class="el-icon-share"></i></a>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- Lab Information -->
      <div class="section lab-info">
        <h2>Our Laboratory</h2>
        <div class="lab-content">
          <div class="lab-text">
            <p>
              Our research is conducted at Jilin University's Advanced Computational Biology Laboratory. 
              With state-of-the-art computing resources and interdisciplinary collaboration, 
              we're pushing the boundaries of RNA structure prediction.
            </p>
            <el-button type="primary" @click="showContactDialog">Contact Us</el-button>
          </div>
          <div class="lab-image">
            <img src="/static/images/lab.jpg" alt="Our Laboratory" onerror="this.style.display='none'">
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="Contact Information"
      :visible.sync="dialogVisible"
      width="30%">
      <div class="contact-dialog">
        <p><i class="el-icon-location"></i> School of Life Sciences, Jilin University, Changchun, China</p>
        <p><i class="el-icon-phone"></i> +86 XXX-XXXX-XXXX</p>
        <p><i class="el-icon-message"></i> rna-pred@jlu.edu.cn</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Close</el-button>
      </span>
    </el-dialog>

    <template slot="footer">
      <div class="page-footer">
        <p>© {{ currentYear }} RNA Structure Prediction Team - Jilin University</p>
      </div>
    </template>
  </d2-container>
</template>

<script>
export default {
  name: 'AboutUs',
  data() {
    return {
      dialogVisible: false,
      currentYear: new Date().getFullYear()
    }
  },
  methods: {
    showContactDialog() {
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>
:root {
  --primary-color: #409eff;
  --success-color: #67c23a;
  --text-color: #2c3e50;
  --border-color: #dcdfe6;
  --background-color: #f8fafc;
  --shadow-color: rgba(0, 0, 0, 0.08);
}

/* Page Header Styles */
.page-header {
  text-align: center;
  padding: 25px 0;
  background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(64, 158, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.title {
  font-size: 2.4em;
  color: #ffffff;
  margin: 0;
  font-weight: 800;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
}

.subtitle {
  color: rgba(255, 255, 255, 0.95);
  margin-top: 10px;
  font-size: 1.1em;
  font-weight: 500;
  position: relative;
  z-index: 1;
}

/* Header Animation */
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

.about-content {
  padding: 20px 10px;
  animation: fadeInUp 0.6s ease-out;
  max-width: 1280px;
  margin: 0 auto;
}

.section {
  margin-bottom: 60px;
}

.section h2 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 25px;
  position: relative;
  padding-bottom: 12px;
  text-align: center;
}

.section h2:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: #409EFF;
}

.project-intro p {
  font-size: 16px;
  line-height: 1.8;
  color: #34495e;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

/* Team Section Styles */
.team-container {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.team-col {
  margin-bottom: 40px;
  display: flex;
}

.team-card {
  height: 100%;
  width: 100%;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}

.team-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.member-avatar {
  height: 250px; /* Increased height for better display */
  position: relative;
  background: #f5f7fa;
  overflow: hidden;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Changed to contain to prevent cropping */
  object-position: center;
  transition: transform 0.5s;
}

.team-card:hover .member-avatar img {
  transform: scale(1.05);
}

.member-info {
  padding: 25px 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

.member-info h3 {
  font-size: 22px;
  color: #2c3e50;
  margin: 0 0 8px;
  text-align: center;
}

.email {
  color: #409EFF;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 5px;
}

.divider {
  margin: 15px auto;
  width: 40px;
  height: 2px;
  background: #eee;
}

.bio {
  font-size: 15px;
  color: #5a6a7e;
  line-height: 1.6;
  margin-bottom: 20px;
  flex-grow: 1;
  text-align: center;
}

.contact {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: auto;
}

.contact a {
  color: #7f8c8d;
  font-size: 20px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f5f7fa;
}

.contact a:hover {
  color: #409EFF;
  background: #e8f4ff;
  transform: translateY(-3px);
}

/* Lab Section Styles */
.lab-content {
  display: flex;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
  margin-top: 30px;
}

.lab-text {
  flex: 1;
  min-width: 300px;
}

.lab-text p {
  font-size: 16px;
  line-height: 1.8;
  color: #34495e;
  margin-bottom: 25px;
}

.lab-image {
  flex: 1;
  min-width: 300px;
}

.lab-image img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Dialog Styles */
.contact-dialog {
  padding: 15px;
}

.contact-dialog p {
  font-size: 16px;
  margin: 20px 0;
  display: flex;
  align-items: center;
}

.contact-dialog i {
  margin-right: 15px;
  color: #409EFF;
  font-size: 20px;
}

/* Footer Styles */
.page-footer {
  text-align: center;
  color: #7f8c8d;
  font-size: 14px;
  padding: 10px 0;
}

/* Responsive Adjustments */
@media (max-width: 991px) {
  .team-col {
    padding: 0 20px;
  }
}

@media (max-width: 768px) {
  .lab-content {
    flex-direction: column;
  }
  
  .team-container {
    margin-top: 20px;
  }
  
  .team-col {
    margin-bottom: 30px;
  }
  
  .member-avatar {
    height: 220px;
  }
}

@media (max-width: 576px) {
  .title {
    font-size: 2em;
  }
  
  .subtitle {
    font-size: 1em;
  }
  
  .section h2 {
    font-size: 24px;
  }
  
  .member-avatar {
    height: 200px;
  }
}

/* Page Transition Animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>