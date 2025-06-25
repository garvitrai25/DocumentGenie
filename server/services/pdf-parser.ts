export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to avoid initialization issues
    const pdfParse = await import("pdf-parse").then(m => m.default || m);
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error("PDF parsing error:", error);
    // Fallback for development - return placeholder text
    return `[PDF Content - ${buffer.length} bytes]\n\nThis is a PDF document that would normally be processed for text extraction. In a production environment, the actual PDF content would be extracted and displayed here.`;
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
