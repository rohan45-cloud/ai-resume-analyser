const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const extractTextFromFile = async (filePath, fileType) => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    
    if (ext === '.pdf' || fileType === 'pdf') {
      return await extractFromPDF(filePath);
    } else if (ext === '.docx' || ext === '.doc' || fileType === 'docx') {
      return await extractFromDOCX(filePath);
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    throw new Error(`Text extraction failed: ${error.message}`);
  }
};

const extractFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  
  if (!data.text || data.text.trim().length < 50) {
    throw new Error('Could not extract meaningful text from PDF. Please ensure the PDF is not password-protected or image-only.');
  }
  
  return data.text.trim();
};

const extractFromDOCX = async (filePath) => {
  const result = await mammoth.extractRawText({ path: filePath });
  
  if (!result.value || result.value.trim().length < 50) {
    throw new Error('Could not extract meaningful text from DOCX file.');
  }
  
  return result.value.trim();
};

const getFileType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.pdf') return 'pdf';
  if (ext === '.docx' || ext === '.doc') return 'docx';
  return 'unknown';
};

const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

module.exports = { extractTextFromFile, getFileType, deleteFile };
