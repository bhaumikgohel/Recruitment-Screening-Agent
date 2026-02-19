// PDF Parser using Mozilla's PDF.js
// The worker file is served from /pdf.worker.mjs (in public folder)

let pdfjsLib = null;

// Dynamically import pdfjs-dist
async function getPdfjsLib() {
  if (!pdfjsLib) {
    const pdfModule = await import('pdfjs-dist');
    pdfjsLib = pdfModule;
    
    // Set worker source to local file in public folder
    const workerUrl = new URL('/pdf.worker.mjs', window.location.origin).href;
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
  }
  return pdfjsLib;
}

/**
 * Extract text content from a PDF file
 * @param {File} file - The PDF file to parse
 * @returns {Promise<string>} - The extracted text
 */
export async function extractTextFromPDF(file) {
  try {
    // Get the pdfjs library
    const pdfjs = await getPdfjsLib();
    
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Join all text items with spaces
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');
      
      fullText += pageText + '\n\n';
    }
    
    // Clean up the extracted text
    const cleanedText = fullText
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .replace(/\n\s*\n/g, '\n\n')  // Normalize newlines
      .trim();
    
    if (!cleanedText || cleanedText.length < 10) {
      throw new Error('No readable text found in PDF. The file may contain only images or be corrupted.');
    }
    
    return cleanedText;
    
  } catch (error) {
    console.error('PDF parsing error:', error);
    
    // Provide user-friendly error messages
    if (error.message.includes('No readable text')) {
      throw error;
    } else if (error.message.includes('Invalid PDF')) {
      throw new Error('The file appears to be an invalid or corrupted PDF.');
    } else if (error.message.includes('password')) {
      throw new Error('The PDF is password protected and cannot be parsed.');
    } else {
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
  }
}
