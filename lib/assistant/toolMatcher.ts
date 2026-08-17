import { TOOLS, ToolDefinition } from "@/lib/tools";

export interface MatchResult {
  tools: ToolDefinition[];
  isConfident: boolean;
}

const SYNONYMS: Record<string, string[]> = {
  "compress": ["reduce size", "shrink", "smaller", "optimize", "reduce"],
  "merge": ["combine", "join", "put together"],
  "convert": ["change format", "change file type", "turn into"],
  "resize": ["change dimensions", "reduce dimensions", "scale"],
  "crop": ["cut image", "cut video", "aspect ratio"],
  "rotate": ["turn", "flip"],
  "remove": ["delete", "erase", "get rid of", "strip"],
  "format": ["beautify", "pretty print", "minify"],
  "split": ["separate", "divide", "extract pages"],
  "extract": ["pull out", "get"],
  "generate": ["create", "make"],
};

export function matchTool(query: string): MatchResult {
  const normalizedQuery = query.toLowerCase().trim().replace(/[^\w\s]/g, "");
  
  if (!normalizedQuery) {
    return { tools: [], isConfident: false };
  }

  const queryTokens = normalizedQuery.split(/\s+/);
  
  // Expand query with synonyms
  let expandedTerms = [...queryTokens];
  for (const [key, aliases] of Object.entries(SYNONYMS)) {
    if (queryTokens.includes(key) || aliases.some(alias => normalizedQuery.includes(alias))) {
      if (!expandedTerms.includes(key)) {
        expandedTerms.push(key);
      }
    }
  }

  // Score tools based on matches
  const scoredTools = TOOLS.map(tool => {
    let score = 0;
    const toolId = tool.id.toLowerCase();
    const toolTitle = tool.title.toLowerCase();
    const toolDesc = tool.description.toLowerCase();
    const toolKeywords = tool.keywords.map(k => k.toLowerCase());

    // Exact match
    if (toolTitle === normalizedQuery) {
      score += 100;
    }
    
    // Pattern: "x to y" (e.g. "jpg to png")
    const idWithSpaces = toolId.replace(/-/g, " ");
    if (normalizedQuery.includes(idWithSpaces) || normalizedQuery.includes(toolId.replace(/-/g, ""))) {
      score += 50;
    }

    // Keyword matching
    expandedTerms.forEach(term => {
      // Ignore very common stop words for generic scoring
      if (["to", "my", "a", "an", "the", "how", "can", "i"].includes(term)) return;

      if (toolTitle.includes(term)) score += 10;
      else if (toolKeywords.some(k => k.includes(term))) score += 5;
      else if (toolDesc.includes(term)) score += 2;
    });

    // Special format boosting
    const formats = ["pdf", "jpg", "png", "webp", "avif", "mp4", "mp3", "mov", "wav", "gif", "json", "qr", "barcode", "excel", "word", "ppt"];
    formats.forEach(fmt => {
      if (queryTokens.includes(fmt) && (toolId.includes(fmt) || toolKeywords.includes(fmt) || toolTitle.includes(fmt))) {
        score += 15;
      }
    });

    return { tool, score };
  });

  // Sort by score descending
  scoredTools.sort((a, b) => b.score - a.score);

  // Filter out irrelevant tools (score threshold)
  const relevantTools = scoredTools.filter(t => t.score > 12).map(t => t.tool);

  // Confidence threshold
  const topScore = scoredTools[0]?.score || 0;
  const isConfident = topScore >= 20;

  return {
    tools: relevantTools.slice(0, 3), // Return up to 3
    isConfident: isConfident && relevantTools.length > 0
  };
}
