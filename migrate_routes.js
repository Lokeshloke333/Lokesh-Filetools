const fs = require('fs-extra');
const path = require('path');

async function main() {
  const toolsFilePath = path.join(__dirname, 'lib', 'tools.ts');
  const toolsFileContent = await fs.readFile(toolsFilePath, 'utf-8');

  // Regex to match tool definitions and extract id and href
  const toolRegex = /id:\s*"([^"]+)",[\s\S]*?href:\s*"([^"]+)",/g;
  let match;
  
  const mappings = [];

  while ((match = toolRegex.exec(toolsFileContent)) !== null) {
    const id = match[1];
    let oldHref = match[2];
    
    // Some tools might have a special ID like background-remover, let's keep the ID as is and map to /${id}
    // Exception requested by user: remove-background
    const newHref = (id === 'background-remover') ? '/remove-background' : `/${id}`;
    
    if (oldHref !== newHref) {
      mappings.push({ id, oldHref, newHref });
    }
  }

  console.log(`Found ${mappings.length} tools to migrate.`);

  const redirects = [];
  
  // Create the (tools) directory if it doesn't exist
  await fs.ensureDir(path.join(__dirname, 'app', '(tools)'));

  // 1. Move directories
  for (const map of mappings) {
    const oldDirPath = path.join(__dirname, 'app', map.oldHref);
    const newDirPath = path.join(__dirname, 'app', '(tools)', map.newHref);
    
    if (await fs.pathExists(oldDirPath)) {
      console.log(`Moving ${map.oldHref} to (tools)${map.newHref}`);
      await fs.move(oldDirPath, newDirPath, { overwrite: true });
      redirects.push(`{ source: '${map.oldHref}', destination: '${map.newHref}', permanent: true },`);
    } else {
      // Dynamic routes or missing directories
      // We still want to add a redirect for dynamic routes like /tools/image/jpg-to-png
      redirects.push(`{ source: '${map.oldHref}', destination: '${map.newHref}', permanent: true },`);
    }
  }

  // Generate redirects output
  console.log('\n--- REDIRECTS FOR next.config.ts ---');
  console.log(redirects.join('\n'));
  console.log('-------------------------------------\n');

  // 2. Update lib/tools.ts
  console.log('Updating lib/tools.ts...');
  let newToolsFileContent = toolsFileContent;
  for (const map of mappings) {
    // Be careful to only replace the href string exactly
    const searchStr = `href: "${map.oldHref}",`;
    const replaceStr = `href: "${map.newHref}",`;
    newToolsFileContent = newToolsFileContent.replace(searchStr, replaceStr);
  }
  await fs.writeFile(toolsFilePath, newToolsFileContent);

  // 3. Find and replace in the entire project
  console.log('Ready for global search and replace...');
}

main().catch(console.error);
