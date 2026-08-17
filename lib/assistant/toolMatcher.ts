import { TOOLS, ToolDefinition } from "@/lib/tools";

export interface MatchResult {
  tools: ToolDefinition[];
  score: number;
}

const INTENT_MAPPINGS: Record<string, string[]> = {
  "compress-image": [
    "make image smaller", "reduce image size", "shrink image", "reduce photo size",
    "compress picture", "make photo smaller", "optimize image", "reduce image file size",
    "image is too large", "make this image lightweight"
  ],
  "image-upscaler": [
    "make image bigger", "enlarge image", "increase image size", "upscale image",
    "make photo bigger", "increase photo resolution", "improve image resolution",
    "make low resolution image bigger", "enlarge this picture", "increase image dimensions"
  ],
  "resize-image": [
    "change image dimensions", "resize photo", "change photo size", "set image width",
    "set image height", "change resolution", "make image 1000px wide", "reduce image dimensions",
    "pixels wide"
  ],
  "remove-background": [
    "remove image background", "remove photo background", "make background transparent",
    "delete background", "remove the background", "transparent background", "isolate the subject"
  ],
  "jpg-to-png": [
    "convert jpg to png", "change jpg into png", "turn jpeg into png", "make png from jpg", "jpg as png"
  ],
  "png-to-jpg": [
    "convert png to jpg", "change png into jpg", "turn png into jpeg", "make jpg from png"
  ],
  "compress-pdf": [
    "make pdf smaller", "reduce pdf size", "shrink pdf", "compress document",
    "reduce document size", "pdf is too large", "make pdf lightweight", "optimize pdf"
  ],
  "merge-pdf": [
    "combine pdfs", "join pdf files", "put pdfs together", "merge documents",
    "combine multiple pdfs", "join two pdfs", "combine these pdfs"
  ],
  "split-pdf": [
    "split pdf", "divide pdf", "separate pdf pages", "extract pages from pdf", "break pdf into parts"
  ],
  "delete-pages": [
    "remove pages from pdf", "delete pdf pages", "take out pages", "remove page", "delete specific pages"
  ],
  "rotate-pdf": [
    "rotate pdf", "turn pdf pages", "change pdf orientation", "rotate document"
  ],
  "watermark-pdf": [
    "add watermark to pdf", "watermark my pdf", "put logo on pdf", "add text watermark"
  ],
  "unlock-pdf": [
    "unlock pdf", "remove pdf password", "remove password protection", "open locked pdf", "remove pdf security"
  ],
  "protect-pdf": [
    "password protect pdf", "secure pdf", "lock pdf", "add password to pdf", "protect document"
  ],
  "pdf-to-image": [
    "convert pdf to image", "turn pdf into jpg", "turn pdf into png", "save pdf pages as images"
  ],
  "image-to-pdf": [
    "convert image to pdf", "make pdf from images", "turn jpg into pdf", "create pdf from photos"
  ],
  "mov-to-mp4": [
    "convert mov to mp4", "change mov to mp4", "turn mov into mp4", "make mp4 from mov", "convert apple video to mp4"
  ],
  "mp4-to-mp3": [
    "extract audio from mp4", "get audio from video", "convert mp4 to mp3", "turn video into mp3"
  ],
  "extract-audio": [
    "extract audio from video", "remove audio from video", "get sound from video", "take audio out of video", "get audio from this video"
  ],
  "compress-video": [
    "make video smaller", "reduce video size", "compress video", "shrink video", "video file is too large"
  ],
  "trim-video": [
    "cut video", "shorten video", "remove part of video", "trim video", "cut beginning of video", "cut end of video", "cut the first 10 seconds"
  ],
  "merge-video": [
    "combine videos", "join videos", "put videos together", "merge clips", "join these videos"
  ],
  "rotate-video": [
    "rotate video", "turn video", "change video orientation"
  ],
  "compress-audio": [
    "make audio smaller", "reduce audio size", "compress audio", "shrink audio file"
  ],
  "trim-audio": [
    "cut audio", "shorten audio", "trim song", "remove part of audio"
  ],
  "merge-audio": [
    "combine audio files", "join songs", "merge audio", "put audio files together"
  ],
  "qr-generator": [
    "create qr code", "make qr code", "generate qr", "turn link into qr", "qr for a website", "make a qr for this link"
  ],
  "barcode-generator": [
    "create barcode", "generate barcode", "make a barcode", "product barcode"
  ],
  "color-picker": [
    "find color from image", "get hex color", "pick color", "extract colors", "identify color from photo", "find the color from this image"
  ],
  "json-formatter": [
    "format json", "beautify json", "clean json", "pretty print json", "validate json", "minify json", "clean up this json"
  ],
  "html-formatter": [
    "format html", "beautify html", "clean html code", "format webpage code"
  ],
  "css-formatter": [
    "format css", "beautify css", "clean css"
  ],
  "javascript-formatter": [
    "format javascript", "beautify javascript", "clean js", "format js code", "format my javascript"
  ],
  "python-formatter": [
    "format python", "beautify python", "clean python code"
  ],
  "php-formatter": [
    "format php", "beautify php", "clean php code"
  ],
  "xml-formatter": [
    "format xml", "beautify xml", "clean xml"
  ]
};

function normalize(text: string): string {
  let cleaned = text.toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
  cleaned = cleaned.replace(/\b(my|a|an|the|this|these)\b/g, " ").replace(/\s+/g, " ").trim();
  return cleaned;
}

export function matchTool(query: string): MatchResult {
  const originalQuery = query.toLowerCase().trim();
  const normalizedQuery = normalize(query);
  
  if (!normalizedQuery) {
    return { tools: [], score: 0 };
  }

  const queryTokens = normalizedQuery.split(" ");
  
  // Format conversion detection
  // convert X to Y, change X into Y
  const convertPattern1 = /(?:convert|change|turn)\s+([a-z0-9]+)\s+(?:to|into|as)\s+([a-z0-9]+)/i;
  // make Y from X
  const convertPattern2 = /(?:make|create)\s+([a-z0-9]+)\s+from\s+([a-z0-9]+)/i;
  
  let detectedFormatPair = "";
  const match1 = originalQuery.match(convertPattern1);
  if (match1) {
    detectedFormatPair = `${match1[1]}-to-${match1[2]}`;
  } else {
    const match2 = originalQuery.match(convertPattern2);
    if (match2) {
      detectedFormatPair = `${match2[2]}-to-${match2[1]}`;
    }
  }

  const scoredTools = TOOLS.map(tool => {
    let score = 0;
    const toolId = tool.id.toLowerCase();
    const toolTitle = normalize(tool.title);
    const toolDesc = normalize(tool.description);
    const toolCategory = tool.category.toLowerCase();
    const keywords = tool.keywords.map(k => normalize(k));

    // 1. Exact Name Match
    if (toolTitle === normalizedQuery) {
      score += 100;
    }

    // 2. Specific Format Pair
    if (detectedFormatPair && toolId === detectedFormatPair) {
      score += 70;
    }

    // 3. Strong Intent Phrase Match
    const intentPhrases = INTENT_MAPPINGS[toolId] || [];
    const hasIntentMatch = intentPhrases.some(phrase => {
      const normPhrase = normalize(phrase);
      return normalizedQuery.includes(normPhrase) || normPhrase.includes(normalizedQuery);
    });
    if (hasIntentMatch) {
      score += 80;
    }

    // 4. Keyword matches
    let matchedKeywords = 0;
    queryTokens.forEach(token => {
      if (["to", "how", "can", "i", "from", "for"].includes(token)) return;

      if (toolTitle.includes(token)) {
        score += 10;
        matchedKeywords++;
      } else if (keywords.some(k => k.includes(token))) {
        score += 5;
        matchedKeywords++;
      } else if (toolDesc.includes(token)) {
        score += 2;
        matchedKeywords++;
      } else if (toolCategory === token) {
        score += 10;
      }
    });

    if (matchedKeywords >= 2) {
      score += 15; // Bonus for multiple matching keywords
    }

    // 5. Conflict Resolution (Compress vs Resize, etc.)
    if (toolId === "compress-image" || toolId === "compress-pdf" || toolId === "compress-video") {
      if (normalizedQuery.match(/\b(mb|kb|file size|upload size|storage|heavy)\b/)) {
        score += 30; // Strongly prefer compress if user mentions size in bytes
      }
    }
    
    if (toolId === "resize-image") {
      if (normalizedQuery.match(/\b(width|height|pixels|px|dimensions|resolution|wide)\b/)) {
        score += 30; // Strongly prefer resize if user mentions dimensions
      }
    }

    if (toolId === "image-upscaler") {
      if (normalizedQuery.match(/\b(bigger|upscale|enlarge)\b/)) {
        score += 30;
      }
    }

    return { tool, score };
  });

  // Sort descending
  scoredTools.sort((a, b) => b.score - a.score);

  // Return the best matches
  const topScore = scoredTools[0]?.score || 0;
  
  // Filter out completely irrelevant tools (score <= 5)
  const relevantTools = scoredTools.filter(t => t.score > 5).map(t => t.tool);

  return {
    tools: relevantTools.slice(0, 3), // Return up to 3
    score: topScore
  };
}
