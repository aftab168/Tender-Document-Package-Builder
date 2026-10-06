/**
 * Smart Auto-matching engine that maps uploaded PDF files to Requirements
 */

export function autoMatchFiles(requirements, uploadedFiles) {
  const matches = {}; // { requirementId: fileId }
  const matchedFileIds = new Set();
  
  // Keyword dictionary mapping keywords to requirement IDs and titles
  const keywordRules = [
    {
      id: 'R01',
      keywords: ['trade', 'license', 'tradelicense', 'tl-'],
      preferPatterns: ['2026', '2027', 'valid', 'new'],
      avoidPatterns: ['2025', '2024', 'old', 'expired']
    },
    {
      id: 'R02',
      keywords: ['tin', 'taxpayer', 'tax', 'tin_certificate', '03_tin']
    },
    {
      id: 'R03',
      keywords: ['vat', 'bin', 'valueadded', 'vat_certificate', '04_vat']
    },
    {
      id: 'R04',
      keywords: ['solvency', 'bank', 'bank_solvency', 'solvency_cert']
    },
    {
      id: 'R05',
      keywords: ['experience', 'exp', 'completion', 'past_work', 'experience_cert']
    },
    {
      id: 'R06',
      keywords: ['audit', 'audited', 'financial_statement', 'balance_sheet']
    },
    {
      id: 'R07',
      keywords: ['manufacturer', 'authorization', 'maf', 'auth_letter', 'oem']
    },
    {
      id: 'R08',
      keywords: ['technical', 'technical_proposal', '02_technical', 'tech_proposal', 'spec']
    },
    {
      id: 'R09',
      keywords: ['financial', 'financial_proposal', '01_financial', 'price', 'commercial']
    },
    {
      id: 'R10',
      keywords: ['declaration', 'signed_declaration', 'scan_0042', 'scan', 'undertaking', 'affidavit']
    }
  ];

  // Pass 1: Score each file against each requirement
  const requirementScores = requirements.map(req => {
    const rule = keywordRules.find(r => r.id === req.id) || { keywords: [req.title_en.toLowerCase()] };
    const candidates = [];
    
    uploadedFiles.forEach(file => {
      // Don't pick duplicates copies if original exists
      if (file.isDuplicateCopy) return;
      
      const fileName = file.name.toLowerCase().replace(/[_-]/g, ' ');
      let score = 0;
      
      // Match keywords
      for (const kw of rule.keywords) {
        if (fileName.includes(kw.toLowerCase())) {
          score += 10;
        }
      }
      
      // Bonus preference patterns
      if (rule.preferPatterns) {
        for (const pref of rule.preferPatterns) {
          if (fileName.includes(pref)) score += 5;
        }
      }
      
      // Penalty for older/expired patterns
      if (rule.avoidPatterns) {
        for (const avoid of rule.avoidPatterns) {
          if (fileName.includes(avoid)) score -= 4;
        }
      }
      
      // Direct title match
      if (fileName.includes(req.title_en.toLowerCase())) {
        score += 15;
      }
      
      if (score > 0) {
        candidates.push({ fileId: file.id, fileName: file.name, score });
      }
    });
    
    // Sort candidates by score descending
    candidates.sort((a, b) => b.score - a.score);
    return { reqId: req.id, candidates };
  });

  // Assign best candidates uniquely (1 file to 1 requirement)
  requirementScores.forEach(({ reqId, candidates }) => {
    for (const cand of candidates) {
      if (!matchedFileIds.has(cand.fileId)) {
        matches[reqId] = cand.fileId;
        matchedFileIds.add(cand.fileId);
        break;
      }
    }
  });

  return matches;
}

/**
 * Predict expiry date from filename or common document patterns
 */
export function extractSuggestedExpiry(fileName, docType) {
  if (!fileName) return '';
  const lower = fileName.toLowerCase();
  
  if (lower.includes('trade_license_2026')) {
    return '2027-06-30';
  }
  if (lower.includes('trade_license_2025')) {
    return '2025-06-30';
  }
  if (lower.includes('bank_solvency')) {
    return '2026-12-31';
  }
  
  // Generic YYYY-MM-DD pattern in filename
  const dateMatch = fileName.match(/(\d{4})[-_](\d{2})[-_](\d{2})/);
  if (dateMatch) {
    return `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
  }
  
  return '';
}
