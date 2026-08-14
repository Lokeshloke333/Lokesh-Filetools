const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/code-formatter?tab=json', { waitUntil: 'networkidle0' });
  
  // Type a very long JSON string into the editor
  const longString = '{"data":"' + 'a'.repeat(2000) + '"}';
  
  // Wait for the editor to be available
  await page.waitForSelector('.cm-content');
  
  // Focus and type
  await page.click('.cm-content');
  
  // To type fast, we can use evaluate to set the text, but let's just use page.keyboard.type if it's not too slow,
  // or better, dispatch an event. Or just evaluate to replace text.
  await page.evaluate((text) => {
    const cmView = document.querySelector('.cm-editor').view;
    if (cmView) {
      cmView.dispatch({
        changes: {from: 0, to: cmView.state.doc.length, insert: text}
      });
    } else {
      // Fallback
      document.querySelector('.cm-content').textContent = text;
    }
  }, longString);
  
  // Wait a moment for layout to update
  await new Promise(r => setTimeout(r, 1000));
  
  // Get all widths and heights up the tree from .cm-content to the body
  const layoutInfo = await page.evaluate(() => {
    const el = document.querySelector('.cm-content');
    if (!el) return { error: 'No .cm-content found' };
    
    let current = el;
    const tree = [];
    while (current && current !== document) {
      const style = window.getComputedStyle(current);
      const rect = current.getBoundingClientRect();
      tree.push({
        tag: current.tagName,
        className: current.className,
        width: rect.width,
        height: rect.height,
        minWidth: style.minWidth,
        maxWidth: style.maxWidth,
        overflowX: style.overflowX,
        display: style.display,
        flex: style.flex
      });
      current = current.parentNode;
    }
    return tree;
  });
  
  console.log(JSON.stringify(layoutInfo, null, 2));
  
  await browser.close();
})();
