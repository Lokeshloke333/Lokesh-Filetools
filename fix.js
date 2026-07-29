const fs = require('fs');
const files = [
  'E:/Lokesh/Development/Filetools/components/CategorySection.tsx',
  'E:/Lokesh/Development/Filetools/components/ComingSoon.tsx',
  'E:/Lokesh/Development/Filetools/components/common/PageHero.tsx',
  'E:/Lokesh/Development/Filetools/components/FAQ.tsx',
  'E:/Lokesh/Development/Filetools/components/Features.tsx',
  'E:/Lokesh/Development/Filetools/components/Footer.tsx',
  'E:/Lokesh/Development/Filetools/components/legal/LegalLayout.tsx',
  'E:/Lokesh/Development/Filetools/components/PopularTools.tsx',
  'E:/Lokesh/Development/Filetools/components/SearchSection.tsx',
  'E:/Lokesh/Development/Filetools/components/Statistics.tsx',
  'E:/Lokesh/Development/Filetools/components/Testimonials.tsx',
  'E:/Lokesh/Development/Filetools/components/tool/ToolLayout.tsx',
  'E:/Lokesh/Development/Filetools/components/tools/ToolsDirectory.tsx',
  'E:/Lokesh/Development/Filetools/components/tools/ToolsFilterBar.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('import { Container }')) {
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfLine = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLine + 1) + 'import { Container } from "@/components/ui/Container";\n' + content.slice(endOfLine + 1);
    } else {
      content = 'import { Container } from "@/components/ui/Container";\n' + content;
    }
    fs.writeFileSync(file, content, 'utf8');
  }
});
