import * as XLSX from 'xlsx';

export function exportChecklistToExcel(tender, requirements, matches, files, statuses, lang = 'en') {
  const tenderId = tender?.tender_id || 'Tender';
  
  const headers = lang === 'bn' ? [
    'ক্রম (Order)',
    'আইডি (ID)',
    'নথির বিবরণ (Document Title)',
    'বাধ্যতামূলক (Mandatory)',
    'মেয়াদ আবশ্যক (Has Expiry)',
    'সংযুক্ত ফাইল (Attached File)',
    'পৃষ্ঠা সংখ্যা (Pages)',
    'মেয়াদোত্তীর্ণের তারিখ (Expiry Date)',
    'স্ট্যাটাস (Status)',
    'ব্লকিং সমস্যা (Blocks Package)'
  ] : [
    'Order',
    'Requirement ID',
    'Document Requirement',
    'Mandatory',
    'Has Expiry',
    'Attached File Name',
    'Page Count',
    'Expiry Date',
    'Verification Status',
    'Blocks Package'
  ];

  const rows = requirements.map(req => {
    const fileId = matches[req.id];
    const file = files.find(f => f.id === fileId);
    const statusObj = statuses[req.id] || { status: 'Missing', blocks: req.mandatory };
    
    return [
      req.order,
      req.id,
      lang === 'bn' ? req.title_bn : req.title_en,
      req.mandatory ? (lang === 'bn' ? 'হ্যাঁ' : 'Yes') : (lang === 'bn' ? 'না' : 'No'),
      req.has_expiry ? (lang === 'bn' ? 'হ্যাঁ' : 'Yes') : (lang === 'bn' ? 'না' : 'No'),
      file ? file.name : (lang === 'bn' ? 'কোনো ফাইল নেই' : 'None'),
      file ? file.pageCount : 0,
      file?.expiryDate || 'N/A',
      statusObj.status,
      statusObj.blocks ? (lang === 'bn' ? 'হ্যাঁ (ব্লকিং)' : 'Yes (Blocking)') : (lang === 'bn' ? 'না' : 'No')
    ];
  });

  const tenderInfo = [
    [lang === 'bn' ? 'দরপত্র তথ্য' : 'TENDER SUMMARY'],
    [lang === 'bn' ? 'দরপত্র আইডি' : 'Tender ID', tender?.tender_id || ''],
    [lang === 'bn' ? 'দরপত্রের নাম' : 'Tender Title', tender?.title || ''],
    [lang === 'bn' ? 'সংগ্রহকারী প্রতিষ্ঠান' : 'Procuring Entity', tender?.procuring_entity || ''],
    [lang === 'bn' ? 'দরদাতা' : 'Bidder Name', tender?.bidder || ''],
    [lang === 'bn' ? 'জমার শেষ তারিখ' : 'Submission Deadline', tender?.submission_deadline || ''],
    [lang === 'bn' ? 'রিপোর্ট তৈরির তারিখ' : 'Report Generated At', new Date().toISOString().split('T')[0]],
    []
  ];

  const wsData = [...tenderInfo, headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Set columns width
  ws['!cols'] = [
    { wch: 8 },
    { wch: 15 },
    { wch: 32 },
    { wch: 12 },
    { wch: 12 },
    { wch: 28 },
    { wch: 12 },
    { wch: 16 },
    { wch: 20 },
    { wch: 16 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Tender Checklist');

  XLSX.writeFile(wb, `${tenderId}_Checklist.xlsx`);
}

export function exportChecklistToCSV(tender, requirements, matches, files, statuses, lang = 'en') {
  const tenderId = tender?.tender_id || 'Tender';
  
  const headers = [
    'Order',
    'ID',
    'Document Requirement',
    'Mandatory',
    'Has Expiry',
    'Attached File',
    'Pages',
    'Expiry Date',
    'Status',
    'Blocks Package'
  ];

  const rows = requirements.map(req => {
    const fileId = matches[req.id];
    const file = files.find(f => f.id === fileId);
    const statusObj = statuses[req.id] || { status: 'Missing', blocks: req.mandatory };
    
    return [
      req.order,
      req.id,
      `"${lang === 'bn' ? req.title_bn : req.title_en}"`,
      req.mandatory ? 'Yes' : 'No',
      req.has_expiry ? 'Yes' : 'No',
      `"${file ? file.name : ''}"`,
      file ? file.pageCount : 0,
      file?.expiryDate || '',
      `"${statusObj.status}"`,
      statusObj.blocks ? 'Yes' : 'No'
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${tenderId}_Checklist.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
