const { encryptPDF } = require('@pdfsmaller/pdf-encrypt');
const { PDFDocument } = require('pdf-lib');

async function run() {
  try {
    const blankPdf = await PDFDocument.create();
    blankPdf.addPage([200, 200]);
    const normalBytes = await blankPdf.save();
    
    // 1. Password Protected
    const protectedBytes = await encryptPDF(normalBytes, 'password');
    
    // 2. Permission Only
    const permBytes = await encryptPDF(normalBytes, '', { ownerPassword: 'owner', allowPrinting: false });
    
const { decryptPDF, isEncrypted } = require('@pdfsmaller/pdf-decrypt');

    async function inspect(name, bytes) {
      console.log('--- ' + name + ' ---');
      try {
        const info = await isEncrypted(bytes);
        console.log('isEncrypted info:', info);
        if (info.encrypted) {
           // Try to decrypt with empty password
           try {
              await decryptPDF(bytes, '');
              console.log('Decrypted with EMPTY password! This means it only has owner permissions/restrictions.');
           } catch(e) {
              console.log('Failed to decrypt with empty password. Requires user password.');
           }
        }
      } catch (e) {
        console.log('Corrupted or failed:', e.message);
      }
    }

    await inspect('Normal', normalBytes);
    await inspect('Protected', protectedBytes);
    await inspect('Permission Only', permBytes);
  } catch (e) {
    console.error('Outer error:', e);
  }
}
run();
