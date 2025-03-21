<template>
  <d2-container>
    <div class="about-content">
      <!-- Page Header -->
      <div class="page-header-container">
        <div class="page-header">
          <h1 class="title">About Our Team</h1>
          <p class="subtitle">Meet the experts behind our RNA prediction technology</p>
        </div>
      </div>

      <!-- Team Section -->
      <div class="section team-section">
        <h2>Our Team</h2>
        
        <!-- Row 1: Professors -->
        <div class="team-row-title">Professors</div>
        <el-row :gutter="20" class="team-container">
          <!-- Professor 1: Lan Huang -->
          <el-col :xs="24" :sm="12" :md="8" :md-offset="4" :lg="8" :lg-offset="4" class="team-col">
            <div class="team-card">
              <div class="member-avatar">
                <img src="./images/huanglan.jpg" alt="Lan Huang" onerror="this.src='/static/images/avatars/default.png'">
              </div>
              <div class="member-info">
                <h3>Lan Huang</h3>
                <div class="email">huanglan@jlu.edu.cn</div>
                <div class="research-areas">
                  <span class="research-tag">Bioinformatics</span>
                  <span class="research-tag">Drug Discovery</span>
                </div>
                <div class="divider"></div>
                <p class="bio">Leading research in computational biology with expertise in RNA structure analysis and drug target identification.</p>
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

          <!-- Professor 2: Yan Wang -->
          <el-col :xs="24" :sm="12" :md="8" :lg="8" class="team-col">
            <div class="team-card">
              <div class="member-avatar">
                <img src="./images/wangyan.png" alt="Yan Wang" onerror="this.src='/static/images/avatars/default.png'">
              </div>
              <div class="member-info">
                <h3>Yan Wang</h3>
                <div class="email">wy6868@jlu.edu.cn</div>
                <div class="research-areas">
                  <span class="research-tag">Machine Learning</span>
                  <span class="research-tag">Data Mining</span>
                </div>
                <div class="divider"></div>
                <p class="bio">Specializes in developing AI and machine learning approaches for RNA secondary structure prediction and analysis.</p>
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
        </el-row>

        <!-- Row 2: Doctors -->
        <div class="team-row-title">Doctors</div>
        <el-row :gutter="20" class="team-container">
          <!-- Doctor 1: Nan Sheng -->
          <el-col :xs="24" :sm="12" :md="8" :lg="8" class="team-col">
            <div class="team-card">
              <div class="member-avatar">
                <img src="./images/shengnan.jpg" alt="Nan Sheng" onerror="this.src='/static/images/avatars/default.png'">
              </div>
              <div class="member-info">
                <h3>Nan Sheng</h3>
                <div class="research-areas">
                  <span class="research-tag">Bioinformatics</span>
                  <span class="research-tag">Biomarker Discovery</span>
                </div>
                <div class="divider"></div>
                <p class="bio">Expert in optimization algorithms and data structures for RNA analysis and biomarker identification.</p>
              </div>
            </div>
          </el-col>

          <!-- Doctor 2: Ling Gao -->
          <el-col :xs="24" :sm="12" :md="8" :lg="8" class="team-col">
            <div class="team-card">
              <div class="member-avatar">
                <img src="./images/gaolin.jpg" alt="Ling Gao" onerror="this.src='/static/images/avatars/default.png'">
              </div>
              <div class="member-info">
                <h3>Ling Gao</h3>
                <div class="research-areas">
                  <span class="research-tag">Deep Learning</span>
                  <span class="research-tag">Drug Discovery</span>
                </div>
                <div class="divider"></div>
                <p class="bio">Focuses on deep learning applications for RNA structure prediction and drug development.</p>
              </div>
            </div>
          </el-col>

          <!-- Doctor 3: Lei Wang -->
          <el-col :xs="24" :sm="12" :md="8" :lg="8" class="team-col">
            <div class="team-card">
              <div class="member-avatar">
                <img src="./images/wanglei.png" alt="Lei Wang" onerror="this.src='/static/images/avatars/default.png'">
              </div>
              <div class="member-info">
                <h3>Lei Wang</h3>
                <div class="research-areas">
                  <span class="research-tag">Data Mining</span>
                  <span class="research-tag">Biomarker Discovery</span>
                </div>
                <div class="divider"></div>
                <p class="bio">Researches innovative data mining techniques for biomarker discovery and RNA structural analysis.</p>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- Row 3: Graduate Students -->
        <div class="team-row-title">Graduate Students</div>
        <el-row :gutter="20" class="team-container">
          <!-- Student 1: Yunzhi Liu -->
          <el-col :xs="24" :sm="12" :md="8" :md-offset="4" :lg="8" :lg-offset="4" class="team-col">
            <div class="team-card">
              <div class="member-avatar">
                <img src="./images/liuyunzhi.jpg" alt="Yunzhi Liu" onerror="this.src='/static/images/avatars/default.png'">
              </div>
              <div class="member-info">
                <h3>Yunzhi Liu</h3>
                <div class="research-areas">
                  <span class="research-tag">Machine Learning</span>
                  <span class="research-tag">Bioinformatics</span>
                </div>
                <div class="divider"></div>
                <p class="bio">Working on applying machine learning approaches to RNA structural prediction and classification.</p>
              </div>
            </div>
          </el-col>

          <!-- Student 2: Chenxu Si -->
          <el-col :xs="24" :sm="12" :md="8" :lg="8" class="team-col">
            <div class="team-card">
              <div class="member-avatar">
                <img src="./images/sichenxu.jpg" alt="Chenxu Si" onerror="this.src='/static/images/avatars/default.png'">
              </div>
              <div class="member-info">
                <h3>Chenxu Si</h3>
                <div class="research-areas">
                  <span class="research-tag">Deep Learning</span>
                  <span class="research-tag">Data Visualization</span>
                </div>
                <div class="divider"></div>
                <p class="bio">Specializes in creating intuitive interfaces and visualizations for complex RNA structural data.</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- Project Introduction -->
      <div class="section project-intro">
        <h2>Our Mission</h2>
        <p>
          We are dedicated to advancing RNA structure prediction through innovative computational approaches.
          Our tools help researchers understand RNA function and enable breakthroughs in areas like drug discovery,
          genetic engineering, and disease treatment.
        </p>
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
  </d2-container>
</template>

<script>
export default {
  name: 'AboutUs',
  data() {
    return {
      dialogVisible: false
    }
  },
  mounted() {
    // Add event listener for browser zoom changes
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    // Remove event listener when component is destroyed
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    showContactDialog() {
      this.dialogVisible = true;
    },
    handleResize() {
      // This empty function is needed to detect resize events
      // but we'll let CSS handle the actual responsive layout
    }
  }
}
</script>

<style scoped>
/* Base variables for consistent scaling */
:root {
  --primary-color: #409eff;
  --success-color: #67c23a;
  --text-color: #2c3e50;
  --border-color: #dcdfe6;
  --background-color: #f8fafc;
  --shadow-color: rgba(0, 0, 0, 0.08);
  
  /* Responsive scaling units */
  --base-font-size: 16px;
  --header-height: 5.5rem;
  --section-spacing: 1.5rem;
  --card-spacing: 1.2rem;
}

/* Page content container */
.about-content {
  padding: 0.08rem 0 0.6rem;  /* Reduced top padding from 0.15rem to 0.08rem */
  animation: fadeInUp 0.6s ease-out;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  /* Use viewport units to ensure consistency across different pixel densities */
  font-size: calc(0.85rem + 0.1vw);
  line-height: 1.5;
  overflow-x: hidden; /* Prevent horizontal scrolling */
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

/* Section styling */
.section {
  margin-bottom: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  padding: 0 0.5rem;
}

.section h2 {
  font-size: calc(1.2rem + 0.3vw);
  color: #2c3e50;
  margin-bottom: 0.9rem;
  position: relative;
  padding-bottom: 0.5rem;
  text-align: center;
}

.section h2:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 3.75rem;
  height: 0.1875rem;
  background: #409EFF;
}

/* Team section styles */
.team-row-title {
  font-size: calc(0.9rem + 0.2vw);
  color: #2c3e50;
  margin: 1.25rem 0 0.5rem;
  padding-left: 0.3125rem;
  border-left: 0.25rem solid #409EFF;
  font-weight: 600;
}

.team-container {
  margin-top: 0.75rem;
  display: flex;
  justify-content: center;
  margin-bottom: 0.75rem;
  width: 100%;
  box-sizing: border-box;
}

.team-col {
  margin-bottom: 1.25rem;
  display: flex;
}

.team-card {
  height: 100%;
  width: 100%;
  background: #fff;
  border-radius: 0.625rem;
  overflow: hidden;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}

.team-card:hover {
  transform: translateY(-0.3125rem);
  box-shadow: 0 0.5rem 1.25rem rgba(0, 0, 0, 0.12);
}

.member-avatar {
  width: 100%;
  height: 0;
  position: relative;
  background: #f5f7fa;
  overflow: hidden;
  /* Use aspect-ratio to maintain proportions across different screens */
  padding-bottom: 45%; /* Adjusted to be slightly smaller for all members */
}

.member-avatar img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s;
}

.team-card:hover .member-avatar img {
  transform: scale(1.05);
}

.member-info {
  padding: 0.75rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

.member-info h3 {
  font-size: calc(0.9rem + 0.2vw);
  color: #2c3e50;
  margin: 0 0 0.375rem;
  text-align: center;
}

.email {
  color: #409EFF;
  font-size: calc(0.7rem + 0.1vw);
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.5rem;
}

.research-areas {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.3125rem;
  margin-bottom: 0.25rem;
}

.research-tag {
  background: #f0f7ff;
  color: #409EFF;
  font-size: calc(0.65rem + 0.05vw);
  padding: 0.125rem 0.4375rem;
  border-radius: 0.625rem;
  display: inline-block;
}

.divider {
  margin: 0.625rem auto;
  width: 2.5rem;
  height: 0.125rem;
  background: #eee;
}

.bio {
  font-size: calc(0.7rem + 0.1vw);
  color: #5a6a7e;
  line-height: 1.4;
  margin-bottom: 0.75rem;
  flex-grow: 1;
  text-align: center;
}

.contact {
  display: flex;
  justify-content: center;
  gap: 1.125rem;
  margin-top: auto;
}

.contact a {
  color: #7f8c8d;
  font-size: 1rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #f5f7fa;
}

.contact a:hover {
  color: #409EFF;
  background: #e8f4ff;
  transform: translateY(-0.1875rem);
}

/* Project intro styles */
.project-intro p {
  font-size: calc(0.85rem + 0.1vw);
  line-height: 1.6;
  color: #34495e;
  text-align: center;
  max-width: 100%;
  margin: 0 auto;
}

/* Lab section styles */
.lab-content {
  display: flex;
  align-items: center;
  gap: 1.5625rem;
  flex-wrap: wrap;
  margin-top: 0.9375rem;
  justify-content: space-between;
}

.lab-text {
  flex: 1;
  min-width: 17.5rem;
}

.lab-text p {
  font-size: calc(0.8rem + 0.1vw);
  line-height: 1.6;
  color: #34495e;
  margin-bottom: 0.9375rem;
}

.lab-image {
  flex: 1;
  min-width: 17.5rem;
}

.lab-image img {
  width: 100%;
  border-radius: 0.625rem;
  box-shadow: 0 0.375rem 0.9375rem rgba(0, 0, 0, 0.08);
}

/* Dialog styles */
.contact-dialog {
  padding: 0.9375rem;
}

.contact-dialog p {
  font-size: 0.9375rem;
  margin: 0.9375rem 0;
  display: flex;
  align-items: center;
}

.contact-dialog i {
  margin-right: 0.9375rem;
  color: #409EFF;
  font-size: 1.125rem;
}

/* UI Scaling for High DPI displays */
@media screen and (min-resolution: 120dpi) {
  .about-content {
    font-size: calc(0.8rem + 0.1vw);
  }
  
  .title {
    font-size: calc(1.4rem + 0.5vw);
  }
  
  .subtitle {
    font-size: calc(0.65rem + 0.2vw);
  }
}

/* Responsive adjustments */
@media (min-width: 1440px) {
  .about-content {
    width: 100%;
    padding: 0.08rem 0 0.6rem; /* Reduced top padding */
  }
  
  .page-header {
    padding: 0.5rem 0;
    width: 99.8%;
  }
}

@media (max-width: 1200px) {
  .member-avatar {
    padding-bottom: 50%;
  }
  
  .section {
    margin-bottom: 1.875rem;
  }
  
  .page-header {
    width: 99.6%;
  }
}

@media (max-width: 992px) {
  .about-content {
    width: 100%;
    padding: 0.08rem 0 0.6rem; /* Reduced top padding */
  }
  
  .page-header {
    width: 99.4%;
  }
}

@media (max-width: 768px) {
  .lab-content {
    flex-direction: column;
  }
  
  .team-container {
    margin-top: 0.5rem;
  }
  
  .page-header {
    padding: 0.5rem 0;
    width: 99%;
  }
  
  .member-avatar {
    padding-bottom: 55%;
  }
}

@media (max-width: 576px) {
  .about-content {
    width: 100%;
    padding: 0.08rem 0 0.6rem; /* Reduced top padding */
  }
  
  .research-areas {
    flex-direction: row;
    align-items: center;
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

/* Print media query for better printing */
@media print {
  .about-content {
    width: 100%;
    padding: 0;
  }
  
  .page-header {
    box-shadow: none;
    background: #f0f0f0;
    color: #000;
  }
  
  .title, .subtitle {
    color: #000;
    text-shadow: none;
  }
  
  .team-card {
    box-shadow: none;
    border: 1px solid #eee;
  }
  
  .contact a {
    display: none;
  }
}
</style>