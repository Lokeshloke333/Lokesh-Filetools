const fs = require('fs');

const files = [
  'E:/Lokesh/Development/Filetools/components/BlogSection.tsx',
  'E:/Lokesh/Development/Filetools/components/CategorySection.tsx',
  'E:/Lokesh/Development/Filetools/components/ComingSoon.tsx',
  'E:/Lokesh/Development/Filetools/components/common/PageHero.tsx',
  'E:/Lokesh/Development/Filetools/components/CTA.tsx',
  'E:/Lokesh/Development/Filetools/components/FAQ.tsx',
  'E:/Lokesh/Development/Filetools/components/Features.tsx',
  'E:/Lokesh/Development/Filetools/components/Footer.tsx',
  'E:/Lokesh/Development/Filetools/components/HowItWorks.tsx',
  'E:/Lokesh/Development/Filetools/components/legal/LegalLayout.tsx',
  'E:/Lokesh/Development/Filetools/components/PopularTools.tsx',
  'E:/Lokesh/Development/Filetools/components/SearchSection.tsx',
  'E:/Lokesh/Development/Filetools/components/Statistics.tsx',
  'E:/Lokesh/Development/Filetools/components/Testimonials.tsx',
  'E:/Lokesh/Development/Filetools/components/tool/ToolLayout.tsx',
  'E:/Lokesh/Development/Filetools/components/tools/ToolsDirectory.tsx',
  'E:/Lokesh/Development/Filetools/components/tools/ToolsFilterBar.tsx',
  'E:/Lokesh/Development/Filetools/components/tools/ToolsHero.tsx',
  'E:/Lokesh/Development/Filetools/app/blog/page.tsx',
  'E:/Lokesh/Development/Filetools/app/contact/page.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const targetClass = "max-w-7xl mx-auto w-full px-4 md:px-6";
  const targetClass2 = "max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"; // special cases

  // Let's do it manually via code for the exact pattern
  let index = 0;
  while ((index = content.indexOf('<div', index)) !== -1) {
    let endOfTag = content.indexOf('>', index);
    if (endOfTag === -1) break;
    let tag = content.substring(index, endOfTag + 1);
    
    if (tag.includes('max-w-7xl mx-auto')) {
      // Find what classes to keep
      let classMatch = tag.match(/className=(["'])(.*?)\1/);
      let classesToKeep = "";
      if (classMatch) {
        let classes = classMatch[2];
        classes = classes.replace('max-w-7xl mx-auto w-full px-4 md:px-6', '');
        classes = classes.replace('max-w-7xl mx-auto w-full px-4 lg:px-8', '');
        classes = classes.replace('max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4', 'flex flex-col sm:flex-row items-center justify-between gap-4');
        classes = classes.replace('max-w-7xl mx-auto', '');
        classesToKeep = classes.trim();
      }
      
      let newTag = classesToKeep ? `<Container className="${classesToKeep}">` : `<Container>`;
      
      // Find matching closing div
      let count = 1;
      let curr = endOfTag + 1;
      while (count > 0 && curr < content.length) {
        let nextOpen = content.indexOf('<div', curr);
        let nextClose = content.indexOf('</div', curr);
        if (nextClose === -1) break;
        if (nextOpen !== -1 && nextOpen < nextClose) {
          count++;
          curr = nextOpen + 4;
        } else {
          count--;
          if (count === 0) {
            // Replace opening and closing
            content = content.substring(0, index) + newTag + content.substring(endOfTag + 1, nextClose) + '</Container>' + content.substring(nextClose + 6);
            changed = true;
            break;
          }
          curr = nextClose + 6;
        }
      }
    }
    index++;
  }

  if (changed) {
    if (!content.includes('Container')) {
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const endOfLine = content.indexOf('\n', lastImportIndex);
        content = content.slice(0, endOfLine + 1) + 'import { Container } from "@/components/ui/Container";\n' + content.slice(endOfLine + 1);
      } else {
        content = 'import { Container } from "@/components/ui/Container";\n' + content;
      }
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
