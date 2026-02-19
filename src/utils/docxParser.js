import mammoth from 'mammoth'

export const extractTextFromDOCX = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    
    if (!result.value || result.value.trim().length < 10) {
      throw new Error('No text content found in document.')
    }
    
    return result.value.trim()
  } catch (err) {
    console.error('DOCX parsing error:', err)
    throw new Error('Failed to parse DOCX file. Please try a different file or paste text manually.')
  }
}

export const extractTextFromTXT = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result.trim()
      if (!text) {
        reject(new Error('Text file appears to be empty.'))
      } else {
        resolve(text)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read text file.'))
    reader.readAsText(file)
  })
}
