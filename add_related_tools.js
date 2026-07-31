const fs = require('fs-extra');

async function main() {
  let content = await fs.readFile('lib/tools.ts', 'utf-8');
  
  // Find all objects in the TOOLS array
  const idRegex = /id:\s*"([^"]+)"/g;
  let match;
  let idsByCategory = { Image: [], PDF: [], Video: [], Audio: [], AI: [], Utilities: [] };
  
  // First pass: group by category
  const blocks = content.split('{');
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const idMatch = block.match(/id:\s*"([^"]+)"/);
    const catMatch = block.match(/category:\s*"([^"]+)"/);
    if (idMatch && catMatch) {
      const id = idMatch[1];
      const category = catMatch[1];
      if (idsByCategory[category]) {
        idsByCategory[category].push(id);
      }
    }
  }

  // Second pass: inject relatedToolIds if missing
  let updatedContent = "";
  for (let i = 0; i < blocks.length; i++) {
    if (i === 0) {
      updatedContent += blocks[i];
      continue;
    }
    let block = blocks[i];
    const idMatch = block.match(/id:\s*"([^"]+)"/);
    const catMatch = block.match(/category:\s*"([^"]+)"/);
    if (idMatch && catMatch && !block.includes('relatedToolIds:')) {
      const id = idMatch[1];
      const category = catMatch[1];
      
      // Get 4 random tools from the same category
      let pool = idsByCategory[category].filter(tid => tid !== id);
      let related = [];
      while(related.length < 4 && pool.length > 0) {
        const randIdx = Math.floor(Math.random() * pool.length);
        related.push(pool[randIdx]);
        pool.splice(randIdx, 1);
      }
      
      // Inject before the closing bracket of the object
      // wait, the block is split by '{', so the block ends at '},' or '}'
      // let's insert it before the last '}' in the block? No, better to regex replace the category line
      block = block.replace(
        /category:\s*"([^"]+)",/, 
        'category: "$1",\n    relatedToolIds: ' + JSON.stringify(related) + ','
      );
    }
    updatedContent += '{' + block;
  }
  
  await fs.writeFile('lib/tools.ts', updatedContent);
  console.log('Added relatedToolIds');
}

main().catch(console.error);
