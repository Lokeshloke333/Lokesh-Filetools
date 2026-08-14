const fs = require('fs-extra');
const path = require('path');

async function main() {
  const mappings = [
    { oldHref: '/tools/ai/background-remover', newHref: '/remove-background' },
    { oldHref: '/tools/image/jpg-to-png', newHref: '/jpg-to-png' },
    { oldHref: '/tools/image/png-to-jpg', newHref: '/png-to-jpg' },
    { oldHref: '/tools/image/webp-to-png', newHref: '/webp-to-png' },
    { oldHref: '/tools/image/png-to-webp', newHref: '/png-to-webp' },
    { oldHref: '/tools/image/jpg-to-webp', newHref: '/jpg-to-webp' },
    { oldHref: '/tools/image/webp-to-jpg', newHref: '/webp-to-jpg' },
    { oldHref: '/tools/image/avif-to-jpg', newHref: '/avif-to-jpg' },
    { oldHref: '/tools/image/jpg-to-avif', newHref: '/jpg-to-avif' },
    { oldHref: '/tools/image/bmp-to-png', newHref: '/bmp-to-png' },
    { oldHref: '/tools/image/gif-to-png', newHref: '/gif-to-png' },
    { oldHref: '/tools/image/compress', newHref: '/compress-image' },
    { oldHref: '/tools/image/resize', newHref: '/resize-image' },
    { oldHref: '/tools/image/crop', newHref: '/crop-image' },
    { oldHref: '/tools/image/rotate', newHref: '/rotate-image' },
    { oldHref: '/tools/image/convert', newHref: '/convert-image' },
    { oldHref: '/tools/pdf/compress', newHref: '/compress-pdf' },
    { oldHref: '/tools/pdf/merge', newHref: '/merge-pdf' },
    { oldHref: '/tools/pdf/split', newHref: '/split-pdf' },
    { oldHref: '/tools/pdf/unlock', newHref: '/unlock-pdf' },
    { oldHref: '/tools/pdf/protect-pdf', newHref: '/protect-pdf' },
    { oldHref: '/tools/pdf/rotate-pdf', newHref: '/rotate-pdf' },
    { oldHref: '/tools/pdf/delete-pages', newHref: '/delete-pages' },
    { oldHref: '/tools/pdf/organize-pdf', newHref: '/organize-pdf' },
    { oldHref: '/tools/pdf/watermark-pdf', newHref: '/watermark-pdf' },
    { oldHref: '/tools/pdf/image-to-pdf', newHref: '/image-to-pdf' },
    { oldHref: '/tools/pdf/pdf-to-image', newHref: '/pdf-to-image' },
    { oldHref: '/tools/pdf/word-to-pdf', newHref: '/word-to-pdf' },
    { oldHref: '/tools/pdf/pdf-to-word', newHref: '/pdf-to-word' },
    { oldHref: '/tools/pdf/excel-to-pdf', newHref: '/excel-to-pdf' },
    { oldHref: '/tools/pdf/pdf-to-excel', newHref: '/pdf-to-excel' },
    { oldHref: '/tools/pdf/ppt-to-pdf', newHref: '/ppt-to-pdf' },
    { oldHref: '/tools/pdf/pdf-to-ppt', newHref: '/pdf-to-ppt' },
    { oldHref: '/tools/video/compress-video', newHref: '/compress-video' },
    { oldHref: '/tools/video/convert-video', newHref: '/convert-video' },
    { oldHref: '/tools/video/trim-video', newHref: '/trim-video' },
    { oldHref: '/tools/video/crop-video', newHref: '/crop-video' },
    { oldHref: '/tools/video/remove-watermark', newHref: '/remove-watermark' },
    { oldHref: '/tools/video/merge-video', newHref: '/merge-video' },
    { oldHref: '/tools/video/rotate-video', newHref: '/rotate-video' },
    { oldHref: '/tools/video/video-to-gif', newHref: '/video-to-gif' },
    { oldHref: '/tools/video/mp4-to-mp3', newHref: '/mp4-to-mp3' },
    { oldHref: '/tools/video/webm-to-mp4', newHref: '/webm-to-mp4' },
    { oldHref: '/tools/video/mov-to-mp4', newHref: '/mov-to-mp4' },
    { oldHref: '/tools/audio/compress-audio', newHref: '/compress-audio' },
    { oldHref: '/tools/audio/convert-audio', newHref: '/convert-audio' },
    { oldHref: '/tools/audio/trim-audio', newHref: '/trim-audio' },
    { oldHref: '/tools/audio/merge-audio', newHref: '/merge-audio' },
    { oldHref: '/tools/audio/extract-audio', newHref: '/extract-audio' },
    { oldHref: '/tools/audio/mp3-to-wav', newHref: '/mp3-to-wav' },
    { oldHref: '/tools/audio/wav-to-mp3', newHref: '/wav-to-mp3' },
    { oldHref: '/tools/audio/flac-to-mp3', newHref: '/flac-to-mp3' },
    { oldHref: '/tools/audio/ogg-to-mp3', newHref: '/ogg-to-mp3' },
    { oldHref: '/tools/ai/upscaler', newHref: '/image-upscaler' },
    { oldHref: '/tools/ai/object-remover', newHref: '/object-remover' },
    { oldHref: '/tools/ai/enhancer', newHref: '/ai-image-enhancer' },
    { oldHref: '/tools/utilities/qr', newHref: '/qr-generator' },
    { oldHref: '/tools/utilities/barcode', newHref: '/barcode-generator' },
    { oldHref: '/tools/utilities/color-picker', newHref: '/color-picker' },
    { oldHref: '/tools/utilities/json', newHref: '/json-formatter' }
  ];

  // Find all .ts and .tsx files
  async function getFiles(dir) {
    const subdirs = await fs.readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
      const res = path.resolve(dir, subdir);
      return (await fs.stat(res)).isDirectory() ? getFiles(res) : res;
    }));
    return files.reduce((a, f) => a.concat(f), []).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
  }

  const dirsToSearch = ['app', 'components', 'lib'];
  let allFiles = [];
  for (const dir of dirsToSearch) {
    const files = await getFiles(path.join(__dirname, dir));
    allFiles = allFiles.concat(files);
  }

  let replacedCount = 0;

  for (const file of allFiles) {
    let content = await fs.readFile(file, 'utf-8');
    let original = content;

    // Apply all mappings
    for (const map of mappings) {
      const escapedOldHref = map.oldHref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(['"\`])${escapedOldHref}(['"\`/?#])`, 'g');
      content = content.replace(regex, `$1${map.newHref}$2`);
    }

    if (content !== original) {
      await fs.writeFile(file, content);
      console.log(`Updated references in ${path.relative(__dirname, file)}`);
      replacedCount++;
    }
  }

  console.log(`Updated references in ${replacedCount} files.`);
}

main().catch(console.error);
