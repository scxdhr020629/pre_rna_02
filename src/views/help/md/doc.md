# MDA - Chemical Formula Risk Evaluation Tool Documentation

## Introduction to the MDA Platform

The MDA platform is a comprehensive tool that can predict the associations between drugs and miRNAs. Users only need to input the SMILES strings of drugs, and the platform will return five associated miRNAs. The platform also supports file uploads for batch predictions.

Key Features:
- **Single Prediction**: Users can input the SMILES string of a single drug, and the platform will return five associated miRNAs.
- **Batch Prediction**: Supports file uploads, allowing users to upload a file containing multiple drug SMILES strings. The platform will predict and return the miRNA associations for each drug.

The MDA platform is designed to provide researchers and drug developers with a convenient tool to accelerate the discovery and validation of miRNA-drug associations.

## Features
- **miRNAs Prediction**: Predict miRNAs associated with drugs
- **Batch Processing**: Support for submitting multiple molecules at once
- **Export Options**: Download results in Excel format

## Getting Started

### System Requirements
- Modern web browser (Firefox, Google Chrome, Edge recommended)
- Internet connection
- Valid SMILES formatted chemical structures

### Quick Start Guide

1. **Access the Analysis Page**: Click "Quick Start" on the home page or select "Analysis" from the navigation bar
2. **Input Chemical Data**: Either draw a molecular structure or upload a SMILES file (maximum 100 molecules)
3. **Name Your Job**: (Optional) Provide a custom name for your analysis job
4. **Provide Contact**: (Optional) Enter your email address to receive notifications
5. **Run Analysis**: Click the "Run Analysis" button to submit your job
6. **View Results**: Explore the comprehensive analysis results once processing is complete

## Usage Examples

### Submitting a Job

1. Navigate to the Analysis page
2. Input SMILES string or upload a file containing SMILES data
3. (Optional) Name your job and provide an email address
4. Click "Run Analysis"

For a quick demonstration, click "Run Example" to populate the form with sample data, then click "Run Analysis" to see how the system works.

### Example SMILES Input
```
CC(=O)OC1=CC=CC=C1C(=O)O
```

## Results Interpretation

The analysis results are divided into six main categories:

1. **Basic Information**
   - Molecular structure visualization
   - SMILES string representation

2. **Physicochemical Properties**
   - 26 different molecular properties including weight, solubility, etc.

3. **Ecological Risk**
   - 10 ecological species toxicity metrics
   - BCF (Bioconcentration Factor) for fish

4. **Environmental Risk**
   - 6 environmental fate factors indicating persistence and mobility

5. **Pesticide-likeness**
   - Radar chart visualization
   - Numerical scores indicating similarity to known pesticides

6. **Molecular Complexity**
   - 4 complexity factors describing molecular structure characteristics

All results can be downloaded as an Excel (.xlsx) file for further analysis and reporting.

## Important Notes

### Browser Compatibility
For optimal performance and feature support, we recommend using Firefox, Google Chrome, or Microsoft Edge.

### SMILES Format
The system supports the Daylight SMILES format for chemical structure representation. Please ensure your input conforms to this standard.

### Detailed Property Explanations
For a comprehensive list of all prediction models and their associated properties, you can download the detailed CSV reference file from the platform.

## Contact and Support

If you encounter any issues or have questions about using the MDA platform, please contact our support team through the website's contact form.









MDA是一个一站式综合平台，用于免费预测与药物有关的mrna。通过输入药物的SMILES字符串，用户将获得与之相关联的五个mrna。我们在外部测试中评估了大约3000种化学品，分类模型的准确率范围为0.709-0.869，回归模型的Q2F1参数范围为0.618-0.898。ChemFREE将促进一个健康世界中化学品的生态环境风险评估。