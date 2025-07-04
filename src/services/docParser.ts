
// These are available globally from index.html
declare const pdfjsLib: any;
declare const mammoth: any;

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const parsePdf = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  const numPages = pdf.numPages;
  let fullText = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n\n';
  }

  return fullText;
};

const parseDocx = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

export const parseDocument = async (file: File): Promise<string> => {
  if (file.type === 'application/pdf') {
    return parsePdf(file);
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return parseDocx(file);
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
  }
};
