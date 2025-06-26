export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import for ES modules compatibility
    const pdfParse = await import("pdf-parse").then(m => m.default || m);
    
    const data = await pdfParse(buffer, {
      // Options to improve extraction
      max: 0, // Maximum number of pages to parse (0 = all pages)
      normalizeWhitespace: true,
      disableCombineTextItems: false
    });
    
    if (data.text && data.text.trim().length > 0) {
      const extractedText = data.text.trim();
      console.log(`PDF parsing successful: ${extractedText.length} characters extracted`);
      return extractedText;
    } else {
      // If no text extracted, it might be an image-based PDF
      console.log("PDF parsing: No text content found");
      return `This PDF appears to contain primarily images or scanned content. Text extraction was not successful. Please ensure the PDF contains selectable text or consider using OCR processing for image-based documents.`;
    }
  } catch (error) {
    console.error("PDF parsing error:", error);
    
    // Try alternative approach for problematic PDFs
    try {
      const pdfParse = await import("pdf-parse").then(m => m.default || m);
      const data = await pdfParse(buffer, {
        normalizeWhitespace: false,
        disableCombineTextItems: true
      });
      
      if (data.text && data.text.trim().length > 0) {
        const extractedText = data.text.trim();
        console.log(`PDF parsing (fallback) successful: ${extractedText.length} characters extracted`);
        return extractedText;
      }
    } catch (secondError) {
      console.error("Secondary PDF parsing also failed:", secondError);
    }
    
    return `Unable to extract text from this PDF file. This could be due to:
1. The PDF contains only images/scanned content (requires OCR)
2. The PDF is password protected
3. The PDF format is not supported
4. The file may be corrupted

Please try uploading a text-based PDF or a .txt file instead.`;
  }
}

export function chunkText(text: string, maxChunkSize: number = 2000): string[] {
  if (text.length <= maxChunkSize) {
    return [text];
  }

  const chunks: string[] = [];
  const sentences = text.split(/[.!?]+/);
  let currentChunk = "";

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) continue;

    const potentialChunk = currentChunk + (currentChunk ? ". " : "") + trimmedSentence;
    
    if (potentialChunk.length <= maxChunkSize) {
      currentChunk = potentialChunk;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk + ".");
      }
      
      // If a single sentence is too long, split it by words
      if (trimmedSentence.length > maxChunkSize) {
        const words = trimmedSentence.split(" ");
        let wordChunk = "";
        
        for (const word of words) {
          const potentialWordChunk = wordChunk + (wordChunk ? " " : "") + word;
          if (potentialWordChunk.length <= maxChunkSize) {
            wordChunk = potentialWordChunk;
          } else {
            if (wordChunk) {
              chunks.push(wordChunk);
            }
            wordChunk = word;
          }
        }
        
        if (wordChunk) {
          currentChunk = wordChunk;
        }
      } else {
        currentChunk = trimmedSentence;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk + (currentChunk.endsWith(".") ? "" : "."));
  }

  return chunks;
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}
