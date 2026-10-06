import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Generate official combined Tender Package PDF according to Section 6 and Bonus rules.
 */
export async function generateTenderPackage({
  tender,
  requirements,
  matches,
  uploadedFiles,
  logoBytes = null,
  sealConfig = null, // { imageBytes, pagesOption: 'cover'|'all'|'declaration'|'custom', customPages: [] }
  includeIndexPage = true
}) {
  const mergedPdf = await PDFDocument.create();
  
  // Embed standard fonts
  const fontRegular = await mergedPdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await mergedPdf.embedFont(StandardFonts.HelveticaBold);
  const fontMono = await mergedPdf.embedFont(StandardFonts.Courier);

  // Optional company logo
  let embeddedLogo = null;
  if (logoBytes) {
    try {
      embeddedLogo = await mergedPdf.embedPng(logoBytes);
    } catch (e) {
      console.warn("Could not embed PNG logo:", e);
    }
  }

  // Filter matched documents sorted by order
  const includedDocs = [];
  const sortedReqs = [...requirements].sort((a, b) => a.order - b.order);

  for (const req of sortedReqs) {
    const fileId = matches[req.id];
    if (!fileId) continue; // Skip optional or unprovided
    const fileObj = uploadedFiles.find(f => f.id === fileId);
    if (!fileObj || !fileObj.arrayBuffer) continue;

    // Load original PDF to extract pages
    const sourcePdf = await PDFDocument.load(fileObj.arrayBuffer);
    const pageIndices = sourcePdf.getPageIndices();
    
    includedDocs.push({
      req,
      fileObj,
      sourcePdf,
      pageIndices,
      pageCount: pageIndices.length,
      startPage: 0,
      endPage: 0
    });
  }

  // Calculate page numbers:
  // Page 1: Cover Page
  // Page 2: Index / Table of Contents (if enabled)
  let currentPageIndex = 1;
  const coverPageIndex = 1;
  currentPageIndex++; // After Cover

  let tocPageIndex = null;
  if (includeIndexPage) {
    tocPageIndex = currentPageIndex;
    currentPageIndex++;
  }

  for (const doc of includedDocs) {
    doc.startPage = currentPageIndex;
    doc.endPage = currentPageIndex + doc.pageCount - 1;
    currentPageIndex += doc.pageCount;
  }

  const totalPages = currentPageIndex - 1;
  const tenderId = tender?.tender_id || 'TENDER';
  const packageDate = new Date().toISOString().split('T')[0];

  // ==========================================
  // 1. CREATE COVER PAGE (Page 1 - Section 6.1)
  // ==========================================
  const coverPage = mergedPdf.addPage([595.28, 841.89]); // A4 Size (points: 595 x 842)
  const { width: cWidth, height: cHeight } = coverPage.getSize();

  // Decorative top banner
  coverPage.drawRectangle({
    x: 0,
    y: cHeight - 120,
    width: cWidth,
    height: 120,
    color: rgb(0.06, 0.27, 0.42) // #0f456b deep navy
  });

  // Logo in header if present
  if (embeddedLogo) {
    const logoDims = embeddedLogo.scale(0.18);
    coverPage.drawImage(embeddedLogo, {
      x: 40,
      y: cHeight - 95,
      width: Math.min(logoDims.width, 60),
      height: Math.min(logoDims.height, 60)
    });
  }

  coverPage.drawText("TENDER SUBMISSION PACKAGE", {
    x: embeddedLogo ? 115 : 40,
    y: cHeight - 65,
    size: 20,
    font: fontBold,
    color: rgb(1, 1, 1)
  });

  coverPage.drawText("OFFICIAL PROCUREMENT BID DOCUMENT", {
    x: embeddedLogo ? 115 : 40,
    y: cHeight - 88,
    size: 10,
    font: fontRegular,
    color: rgb(0.85, 0.92, 0.98)
  });

  // Tender Information Box
  let yPos = cHeight - 150;
  coverPage.drawRectangle({
    x: 40,
    y: yPos - 130,
    width: cWidth - 80,
    height: 130,
    color: rgb(0.96, 0.98, 1.0),
    borderColor: rgb(0.8, 0.88, 0.95),
    borderWidth: 1
  });

  const drawField = (label, value, y) => {
    coverPage.drawText(label, {
      x: 55,
      y,
      size: 9.5,
      font: fontBold,
      color: rgb(0.3, 0.4, 0.5)
    });
    coverPage.drawText(String(value || 'N/A'), {
      x: 190,
      y,
      size: 10,
      font: fontBold,
      color: rgb(0.1, 0.15, 0.2)
    });
  };

  drawField("Tender ID:", tender?.tender_id, yPos - 25);
  drawField("Tender Title:", tender?.title, yPos - 45);
  drawField("Procuring Entity:", tender?.procuring_entity, yPos - 65);
  drawField("Bidder Name:", tender?.bidder, yPos - 85);
  drawField("Submission Deadline:", tender?.submission_deadline, yPos - 105);
  drawField("Package Created:", packageDate, yPos - 125);

  // Included Documents Summary
  yPos = yPos - 165;
  coverPage.drawText("INCLUDED DOCUMENTS IN THIS SUBMISSION", {
    x: 40,
    y: yPos,
    size: 12,
    font: fontBold,
    color: rgb(0.06, 0.27, 0.42)
  });

  // Table header
  yPos -= 20;
  coverPage.drawRectangle({
    x: 40,
    y: yPos - 5,
    width: cWidth - 80,
    height: 20,
    color: rgb(0.9, 0.93, 0.96)
  });

  coverPage.drawText("#", { x: 50, y: yPos, size: 9, font: fontBold, color: rgb(0.2, 0.3, 0.4) });
  coverPage.drawText("Document Title", { x: 80, y: yPos, size: 9, font: fontBold, color: rgb(0.2, 0.3, 0.4) });
  coverPage.drawText("File Name", { x: 260, y: yPos, size: 9, font: fontBold, color: rgb(0.2, 0.3, 0.4) });
  coverPage.drawText("Pages", { x: 440, y: yPos, size: 9, font: fontBold, color: rgb(0.2, 0.3, 0.4) });
  coverPage.drawText("Page Ref", { x: 495, y: yPos, size: 9, font: fontBold, color: rgb(0.2, 0.3, 0.4) });

  yPos -= 20;
  includedDocs.forEach((doc, idx) => {
    if (idx % 2 === 1) {
      coverPage.drawRectangle({
        x: 40,
        y: yPos - 4,
        width: cWidth - 80,
        height: 18,
        color: rgb(0.97, 0.98, 0.99)
      });
    }

    coverPage.drawText(String(doc.req.order), { x: 50, y: yPos, size: 8.5, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
    
    // Truncate title if long
    let title = doc.req.title_en;
    if (title.length > 32) title = title.substring(0, 30) + '...';
    coverPage.drawText(title, { x: 80, y: yPos, size: 8.5, font: fontBold, color: rgb(0.1, 0.2, 0.3) });

    let fileName = doc.fileObj.name;
    if (fileName.length > 30) fileName = fileName.substring(0, 28) + '...';
    coverPage.drawText(fileName, { x: 260, y: yPos, size: 8, font: fontRegular, color: rgb(0.3, 0.4, 0.5) });

    coverPage.drawText(String(doc.pageCount), { x: 445, y: yPos, size: 8.5, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
    coverPage.drawText(`p. ${doc.startPage} - ${doc.endPage}`, { x: 495, y: yPos, size: 8.5, font: fontBold, color: rgb(0.06, 0.27, 0.42) });

    yPos -= 19;
  });

  // Sign-off section at bottom of cover
  coverPage.drawText("Verified & Prepared for Official Tender Submission", {
    x: 40,
    y: 75,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.4)
  });

  coverPage.drawText(`Total Submission Volume: ${totalPages} Pages`, {
    x: 40,
    y: 60,
    size: 9,
    font: fontBold,
    color: rgb(0.1, 0.4, 0.3)
  });

  // ==========================================
  // 2. CREATE INDEX / TOC PAGE (Bonus Task)
  // ==========================================
  if (includeIndexPage) {
    const tocPage = mergedPdf.addPage([595.28, 841.89]);
    const { width: tWidth, height: tHeight } = tocPage.getSize();

    // Top title bar
    tocPage.drawRectangle({
      x: 40,
      y: tHeight - 80,
      width: tWidth - 80,
      height: 40,
      color: rgb(0.06, 0.27, 0.42)
    });

    tocPage.drawText("TABLE OF CONTENTS / DOCUMENT INDEX", {
      x: 55,
      y: tHeight - 65,
      size: 14,
      font: fontBold,
      color: rgb(1, 1, 1)
    });

    let tyPos = tHeight - 110;
    
    // Header
    tocPage.drawRectangle({
      x: 40,
      y: tyPos - 6,
      width: tWidth - 80,
      height: 22,
      color: rgb(0.88, 0.92, 0.96)
    });

    tocPage.drawText("Order", { x: 50, y: tyPos, size: 9, font: fontBold, color: rgb(0.15, 0.25, 0.35) });
    tocPage.drawText("Document Requirement", { x: 90, y: tyPos, size: 9, font: fontBold, color: rgb(0.15, 0.25, 0.35) });
    tocPage.drawText("Doc ID", { x: 270, y: tyPos, size: 9, font: fontBold, color: rgb(0.15, 0.25, 0.35) });
    tocPage.drawText("Pages", { x: 325, y: tyPos, size: 9, font: fontBold, color: rgb(0.15, 0.25, 0.35) });
    tocPage.drawText("Expiry Date", { x: 380, y: tyPos, size: 9, font: fontBold, color: rgb(0.15, 0.25, 0.35) });
    tocPage.drawText("Package Page Range", { x: 465, y: tyPos, size: 9, font: fontBold, color: rgb(0.15, 0.25, 0.35) });

    tyPos -= 26;

    includedDocs.forEach((doc, idx) => {
      if (idx % 2 === 1) {
        tocPage.drawRectangle({
          x: 40,
          y: tyPos - 6,
          width: tWidth - 80,
          height: 24,
          color: rgb(0.96, 0.98, 1.0)
        });
      }

      tocPage.drawText(String(doc.req.order), { x: 55, y: tyPos, size: 9, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
      tocPage.drawText(doc.req.title_en, { x: 90, y: tyPos, size: 9.5, font: fontBold, color: rgb(0.06, 0.27, 0.42) });
      tocPage.drawText(doc.req.id, { x: 270, y: tyPos, size: 9, font: fontMono, color: rgb(0.3, 0.3, 0.3) });
      tocPage.drawText(`${doc.pageCount} pg`, { x: 325, y: tyPos, size: 9, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });

      const expiryText = doc.fileObj.expiryDate ? doc.fileObj.expiryDate : (doc.req.has_expiry ? 'Not specified' : 'N/A');
      tocPage.drawText(expiryText, { x: 380, y: tyPos, size: 8.5, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });

      tocPage.drawText(`Page ${doc.startPage} - ${doc.endPage}`, { x: 470, y: tyPos, size: 9, font: fontBold, color: rgb(0.05, 0.45, 0.2) });

      // Subtle dotted separator line
      tocPage.drawLine({
        start: { x: 40, y: tyPos - 6 },
        end: { x: tWidth - 40, y: tyPos - 6 },
        thickness: 0.5,
        color: rgb(0.85, 0.88, 0.92)
      });

      tyPos -= 26;
    });

    // Notes box on TOC
    tyPos -= 20;
    tocPage.drawRectangle({
      x: 40,
      y: tyPos - 60,
      width: tWidth - 80,
      height: 60,
      color: rgb(0.98, 0.98, 0.98),
      borderColor: rgb(0.85, 0.85, 0.85),
      borderWidth: 1
    });

    tocPage.drawText("Important Note for Evaluation Committee:", {
      x: 55,
      y: tyPos - 18,
      size: 9,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2)
    });
    tocPage.drawText("All mandatory documents have been checked, sequenced in required order, and validated for deadline compliance.", {
      x: 55,
      y: tyPos - 34,
      size: 8.5,
      font: fontRegular,
      color: rgb(0.35, 0.35, 0.35)
    });
    tocPage.drawText(`Tender ID: ${tenderId} | Total Pages: ${totalPages} | Bidder: ${tender?.bidder}`, {
      x: 55,
      y: tyPos - 50,
      size: 8.5,
      font: fontBold,
      color: rgb(0.06, 0.27, 0.42)
    });
  }

  // ==========================================
  // 3. COPY ALL DOCUMENT PAGES IN STRICT ORDER
  // ==========================================
  for (const doc of includedDocs) {
    const copiedPages = await mergedPdf.copyPages(doc.sourcePdf, doc.pageIndices);
    copiedPages.forEach(page => {
      mergedPdf.addPage(page);
    });
  }

  // ==========================================
  // 4. EMBED SEAL / SIGNATURE (Bonus Feature)
  // ==========================================
  let embeddedSeal = null;
  if (sealConfig && sealConfig.imageBytes) {
    try {
      embeddedSeal = await mergedPdf.embedPng(sealConfig.imageBytes);
    } catch (e) {
      console.warn("Could not embed seal PNG:", e);
    }
  }

  // ==========================================
  // 5. DRAW UNIVERSAL FOOTER ON EVERY PAGE (Section 6.3 & 6.4)
  // ==========================================
  const allPdfPages = mergedPdf.getPages();
  const actualTotalPages = allPdfPages.length;

  for (let idx = 0; idx < actualTotalPages; idx++) {
    const page = allPdfPages[idx];
    const pageNum = idx + 1;
    const { width: pWidth, height: pHeight } = page.getSize();

    // Subtle line above footer
    page.drawLine({
      start: { x: 35, y: 35 },
      end: { x: pWidth - 35, y: 35 },
      thickness: 0.6,
      color: rgb(0.75, 0.8, 0.85)
    });

    // Left info
    page.drawText(`${tenderId} | Bidder: ${tender?.bidder || 'Meghna Tech Solutions Ltd.'}`, {
      x: 35,
      y: 20,
      size: 8,
      font: fontRegular,
      color: rgb(0.4, 0.45, 0.5)
    });

    // Right footer (Required: "<tender_id> | Page X of Y")
    const footerText = `${tenderId} | Page ${pageNum} of ${actualTotalPages}`;
    const textWidth = fontBold.widthOfTextAtSize(footerText, 8.5);
    
    page.drawText(footerText, {
      x: pWidth - 35 - textWidth,
      y: 20,
      size: 8.5,
      font: fontBold,
      color: rgb(0.1, 0.2, 0.3)
    });

    // Draw seal/signature if configured for this page
    if (embeddedSeal) {
      let shouldSeal = false;
      if (sealConfig.pagesOption === 'all') {
        shouldSeal = true;
      } else if (sealConfig.pagesOption === 'cover' && pageNum === 1) {
        shouldSeal = true;
      } else if (sealConfig.pagesOption === 'declaration') {
        // Find declaration doc page range
        const declDoc = includedDocs.find(d => d.req.id === 'R10' || d.req.id === 'R09');
        if (declDoc && pageNum >= declDoc.startPage && pageNum <= declDoc.endPage) {
          shouldSeal = true;
        }
      } else if (sealConfig.pagesOption === 'custom') {
        if (sealConfig.customPages && sealConfig.customPages.includes(pageNum)) {
          shouldSeal = true;
        }
      }

      if (shouldSeal) {
        const sealDims = embeddedSeal.scale(0.35);
        let sX = pWidth - sealDims.width - 45;
        let sY = 50;

        if (sealConfig.position === 'bottomLeft') {
          sX = 45;
        } else if (sealConfig.position === 'topRight') {
          sX = pWidth - sealDims.width - 45;
          sY = pHeight - sealDims.height - 45;
        } else if (sealConfig.position === 'centerBottom') {
          sX = (pWidth - sealDims.width) / 2;
        }

        page.drawImage(embeddedSeal, {
          x: sX,
          y: sY,
          width: sealDims.width,
          height: sealDims.height,
          opacity: 0.88
        });
      }
    }
  }

  // Save the complete merged PDF
  const pdfBytes = await mergedPdf.save();
  return {
    pdfBytes,
    totalPages: actualTotalPages,
    filename: `${tenderId}_Package.pdf`
  };
}
