import puppeteer from 'puppeteer';
import path from 'path';

async function generatePDF() {
  console.log("Launching Puppeteer...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const filePath = path.resolve('HACKATHON_SUBMISSION.html');
  console.log(`Loading HTML from file://${filePath}...`);
  await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });
  
  console.log("Generating PDF...");
  await page.pdf({
    path: 'final_submission_document.pdf',
    format: 'A4',
    margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
    printBackground: true,
  });

  await browser.close();
  console.log("PDF generated successfully at final_submission_document.pdf");
}

generatePDF().catch(e => console.error(e));
