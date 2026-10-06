export const translations = {
  en: {
    appTitle: "Tender Document Package Builder",
    appSubtitle: "AI DevFest 2026 Official Tender Package Creation & Validation System",
    language: "Language",
    english: "English",
    bangla: "বাংলা",
    
    // Header actions
    loadSampleData: "Load Sample Data",
    loadSampleFiles: "Load Sample Documents",
    resetAll: "Reset All",
    exportProject: "Save Project",
    importProject: "Open Project",
    exportChecklistExcel: "Export Excel Checklist",
    exportChecklistCSV: "Export CSV Checklist",
    sealSignature: "Seal & Signature",
    aiAssistant: "AI Helper",
    themeToggle: "Theme",
    
    // Tender details
    tenderDetails: "Tender Overview",
    tenderId: "Tender ID",
    tenderTitle: "Tender Title",
    procuringEntity: "Procuring Entity",
    bidderName: "Bidder Name",
    submissionDeadline: "Submission Deadline",
    noTenderLoaded: "No requirements loaded yet. Please upload requirements.json or click 'Load Sample Data'.",
    uploadRequirements: "Upload Requirements (.json)",
    dragRequirements: "Drag & drop requirements.json here or click to browse",
    
    // Stats & Progress
    summaryTitle: "Validation Progress",
    totalRequirements: "Total Requirements",
    mandatoryDocs: "Mandatory Documents",
    optionalDocs: "Optional Documents",
    readyCount: "Ready to Submit",
    blockingIssues: "Blocking Issues",
    packageStatus: "Package Status",
    readyToGenerate: "Ready for Package Generation",
    generationBlocked: "Action Required Before Generation",
    
    // Document List & Table
    documentRequirements: "Document Requirements Checklist",
    order: "Order",
    requirementTitle: "Document Requirement",
    mandatoryTag: "Mandatory",
    optionalTag: "Optional",
    hasExpiryTag: "Expiry Required",
    matchedFile: "Attached PDF File",
    pages: "Pages",
    expiryDate: "Document Expiry Date",
    status: "Verification Status",
    actions: "Actions",
    
    // Statuses
    statusOK: "OK",
    statusMissing: "Missing",
    statusExpiryNeeded: "Expiry Date Needed",
    statusExpired: "Expired",
    statusNotProvided: "Not Provided",
    
    // Status descriptions
    descOK: "Document attached and valid.",
    descMissing: "Mandatory document is missing a file.",
    descExpiryNeeded: "Expiry date is required for this document.",
    descExpired: "Document expires before the submission deadline ({date}).",
    descNotProvided: "Optional document is not provided.",
    
    // Uploaded Files Section
    uploadedFiles: "Uploaded Document Pool",
    uploadPDFs: "Upload PDF Documents",
    dragPDFs: "Drag & drop one or multiple PDF files here, or click to upload",
    supportedFormats: "Supports standard PDF files up to 50 MB total",
    totalFilesUploaded: "Total Files Uploaded",
    duplicateFound: "Duplicate Content Detected",
    duplicateWarning: "This file has identical content to '{filename}'. Duplicate files cannot be assigned to multiple requirements.",
    previewPDF: "Preview Document",
    removeFile: "Remove File",
    matchToRequirement: "Assign to Requirement...",
    unmatched: "Unassigned",
    assignedTo: "Assigned to",
    autoMatchAll: "Auto-Match All Files",
    autoMatchHint: "Automatically matches uploaded PDFs to requirements based on filename similarity",
    
    // Auto-match modal / alert
    autoMatchSuccess: "Successfully matched {count} documents automatically!",
    autoMatchNone: "No new automatic matches found.",
    
    // Package Generator
    generatePackage: "Generate Tender Package PDF",
    generating: "Generating High-Quality Package...",
    downloadPackage: "Download Tender Package (<tender_id>_Package.pdf)",
    packageGeneratedSuccess: "Package generated successfully!",
    packageDetails: "Package Details",
    totalPages: "Total Pages",
    coverPageIncluded: "Branded Cover Page Included",
    indexPageIncluded: "Table of Contents Index Included",
    allFootersAdded: "Universal Header & Footer Stamp Applied",
    
    // Seal / Signature Tool
    sealModalTitle: "Digital Seal & Authorized Signature Placement",
    sealModalDesc: "Upload an official company stamp or signature PNG to brand the generated tender package.",
    uploadSeal: "Upload Seal / Signature Image (PNG)",
    selectStampPages: "Apply Stamp to Pages:",
    stampCover: "Cover Page Only",
    stampAll: "All Pages",
    stampDeclaration: "Declaration & Financial Proposals Only",
    stampCustom: "Custom Page Range",
    sealPosition: "Position",
    bottomRight: "Bottom Right",
    bottomLeft: "Bottom Left",
    topRight: "Top Right",
    centerBottom: "Bottom Center",
    sealApplied: "Seal configured successfully",
    
    // Bad File / Errors
    invalidFileError: "Invalid file: Only valid PDF documents are accepted.",
    corruptFileError: "Error reading PDF file. The file may be damaged or password protected.",
    fileTooLargeError: "File is too large. Maximum allowed size is 50 MB.",
    
    // TOC / Cover details
    coverTitle: "TENDER SUBMISSION PACKAGE",
    tableOfContents: "TABLE OF CONTENTS",
    dateGenerated: "Date Generated",
    pageRange: "Page Range",
    documentId: "Doc ID",
    preparedBy: "Prepared By",
    submittedTo: "Submitted To",
    
    // AI Helper
    aiHelperTitle: "AI Assistant (Optional)",
    aiHelperDesc: "Enter your personal OpenAI or Google Gemini API key to analyze document text and auto-extract dates.",
    aiApiKey: "API Key",
    aiApiKeyPlaceholder: "Enter your personal API key...",
    analyzeDocs: "Analyze Documents with AI",
    aiDisclaimer: "Your key is stored locally in your browser memory and never uploaded to any server.",
    
    // Export / Import
    projectSaved: "Project state saved successfully!",
    projectLoaded: "Project loaded successfully!",
    invalidProjectFile: "Invalid project file format.",
    
    // Footer & Credits
    footerText: "AI DevFest 2026 Solo AI Vibe-Coding Contest | Daffodil International University (CPC & CSE-TECH)",
    developedWith: "Frontend Only Architecture • Client-side PDF Processing • Zero Backend Dependency"
  },
  bn: {
    appTitle: "টেন্ডার ডকুমেন্ট প্যাকেজ বিল্ডার",
    appSubtitle: "এআই ডেভফেস্ট ২০২৬ অফিসিয়াল দরপত্র প্যাকেজ তৈরি ও যাচাইকরণ সিস্টেম",
    language: "ভাষা",
    english: "English",
    bangla: "বাংলা",
    
    // Header actions
    loadSampleData: "নমুনা ডাটা লোড করুন",
    loadSampleFiles: "নমুনা ফাইলসমূহ লোড করুন",
    resetAll: "সব রিসেট করুন",
    exportProject: "প্রজেক্ট সংরক্ষণ",
    importProject: "প্রজেক্ট খুলুন",
    exportChecklistExcel: "এক্সেল চেকলিস্ট ডাউনলোড",
    exportChecklistCSV: "সিএসভি চেকলিস্ট ডাউনলোড",
    sealSignature: "সিল ও স্বাক্ষর",
    aiAssistant: "এআই সহকারী",
    themeToggle: "থিম",
    
    // Tender details
    tenderDetails: "দরপত্রের বিবরণ",
    tenderId: "দরপত্র আইডি",
    tenderTitle: "দরপত্রের শিরোনাম",
    procuringEntity: "সংগ্রহকারী প্রতিষ্ঠান",
    bidderName: "দরদাতা প্রতিষ্ঠানের নাম",
    submissionDeadline: "জমার শেষ তারিখ",
    noTenderLoaded: "কোনো রিকোয়ারমেন্ট লোড করা হয়নি। requirements.json আপলোড করুন অথবা 'নমুনা ডাটা লোড করুন' বাটনে ক্লিক করুন।",
    uploadRequirements: "রিকোয়ারমেন্ট ফাইল আপলোড (.json)",
    dragRequirements: "requirements.json ফাইলটি এখানে টেনে আনুন অথবা ক্লিক করে নির্বাচন করুন",
    
    // Stats & Progress
    summaryTitle: "যাচাইকরণের অগ্রগতি",
    totalRequirements: "মোট নথির প্রয়োজনীয়তা",
    mandatoryDocs: "বাধ্যতামূলক নথি",
    optionalDocs: "ঐচ্ছিক নথি",
    readyCount: "জমার জন্য প্রস্তুত",
    blockingIssues: "সমাধানযোগ্য সমস্যা",
    packageStatus: "প্যাকেজের বর্তমান অবস্থা",
    readyToGenerate: "প্যাকেজ তৈরির জন্য সম্পূর্ণ প্রস্তুত",
    generationBlocked: "প্যাকেজ তৈরির পূর্বে সমস্যা সমাধান করুন",
    
    // Document List & Table
    documentRequirements: "প্রয়োজনীয় নথিপত্রের তালিকা ও চেকলিস্ট",
    order: "ক্রম",
    requirementTitle: "নথির বিবরণ",
    mandatoryTag: "বাধ্যতামূলক",
    optionalTag: "ঐচ্ছিক",
    hasExpiryTag: "মেয়াদ প্রয়োজন",
    matchedFile: "সংযুক্ত পিডিএফ ফাইল",
    pages: "পৃষ্ঠা",
    expiryDate: "নথির মেয়াদোত্তীর্ণের তারিখ",
    status: "যাচাই স্ট্যাটাস",
    actions: "অ্যাকশন",
    
    // Statuses
    statusOK: "ঠিক আছে (OK)",
    statusMissing: "অনুপস্থিত (Missing)",
    statusExpiryNeeded: "মেয়াদ প্রদান আবশ্যক",
    statusExpired: "মেয়াদোত্তীর্ণ (Expired)",
    statusNotProvided: "দেওয়া হয়নি (Not Provided)",
    
    // Status descriptions
    descOK: "নথি সংযুক্ত এবং বৈধ রয়েছে।",
    descMissing: "বাধ্যতামূলক নথিটিতে কোনো ফাইল সংযুক্ত করা হয়নি।",
    descExpiryNeeded: "এই নথির জন্য মেয়াদোত্তীর্ণের তারিখ প্রদান বাধ্যতামূলক।",
    descExpired: "নথির মেয়াদ দরপত্র জমার তারিখের ({date}) পূর্বে শেষ হয়ে গেছে।",
    descNotProvided: "ঐচ্ছিক নথি সংযুক্ত করা হয়নি।",
    
    // Uploaded Files Section
    uploadedFiles: "আপলোডকৃত নথির তালিকা",
    uploadPDFs: "পিডিএফ নথি আপলোড করুন",
    dragPDFs: "এক বা একাধিক পিডিএফ ফাইল এখানে টেনে আনুন অথবা ক্লিক করে সিলেক্ট করুন",
    supportedFormats: "সর্বোচ্চ ৫০ মেগাবাইট পর্যন্ত পিডিএফ ফাইল সমর্থিত",
    totalFilesUploaded: "মোট আপলোডকৃত ফাইল",
    duplicateFound: "একই কনটেন্টের নকল ফাইল সনাক্ত হয়েছে",
    duplicateWarning: "এই ফাইলের কনটেন্ট হুবহু '{filename}' ফাইলের মতো। একই ফাইল একাধিক নথিতে যুক্ত করা যাবে না।",
    previewPDF: "নথি প্রিভিউ",
    removeFile: "ফাইল মুছুন",
    matchToRequirement: "নথির সাথে মিল করুন...",
    unmatched: "অনির্ধারিত",
    assignedTo: "নির্ধারিত হয়েছে",
    autoMatchAll: "স্বয়ংক্রিয় ফাইল ম্যাচিং",
    autoMatchHint: "ফাইলের নামের ওপর ভিত্তি করে রিকোয়ারমেন্টের সাথে স্বয়ংক্রিয়ভাবে মিল করে",
    
    // Auto-match modal / alert
    autoMatchSuccess: "সফলভাবে {count} টি নথি স্বয়ংক্রিয়ভাবে ম্যাচ করা হয়েছে!",
    autoMatchNone: "নতুন কোনো স্বয়ংক্রিয় ম্যাচ পাওয়া যায়নি।",
    
    // Package Generator
    generatePackage: "দরপত্র প্যাকেজ পিডিএফ তৈরি করুন",
    generating: "উচ্চমানের পিডিএফ প্যাকেজ তৈরি হচ্ছে...",
    downloadPackage: "দরপত্র প্যাকেজ ডাউনলোড (<tender_id>_Package.pdf)",
    packageGeneratedSuccess: "প্যাকেজ সফলভাবে তৈরি হয়েছে!",
    packageDetails: "প্যাকেজের বিবরণ",
    totalPages: "সর্বমোট পৃষ্ঠা",
    coverPageIncluded: "কভার পেজ অন্তর্ভুক্ত",
    indexPageIncluded: "সূচিপত্র (TOC) অন্তর্ভুক্ত",
    allFootersAdded: "প্রতিটি পৃষ্ঠায় অফিসিয়াল ফুটার যুক্ত",
    
    // Seal / Signature Tool
    sealModalTitle: "ডিজিটাল সিল ও অনুমোদিত স্বাক্ষর সংযোজন",
    sealModalDesc: "দরপত্র প্যাকেজে ব্যবহারের জন্য প্রতিষ্ঠানের সিল বা স্বাক্ষরের পিএনজি (PNG) ছবি আপলোড করুন।",
    uploadSeal: "সিল / স্বাক্ষরের ছবি আপলোড (PNG)",
    selectStampPages: "কোন পৃষ্ঠাগুলোতে সিল যুক্ত হবে:",
    stampCover: "শুধু কভার পৃষ্ঠায়",
    stampAll: "সকল পৃষ্ঠায়",
    stampDeclaration: "শুধুমাত্র ঘোষণাপত্র ও আর্থিক প্রস্তাবে",
    stampCustom: "নির্দিষ্ট পৃষ্ঠাগুলোতে",
    sealPosition: "অবস্থান",
    bottomRight: "নিচে ডানপাশে",
    bottomLeft: "নিচে বামপাশে",
    topRight: "উপরে ডানপাশে",
    centerBottom: "নিচে মাঝখানে",
    sealApplied: "সিল সফলভাবে কনফিগার করা হয়েছে",
    
    // Bad File / Errors
    invalidFileError: "ভুল ফাইল ফরম্যাট: শুধুমাত্র পিডিএফ (.pdf) ফাইল গ্রহণযোগ্য।",
    corruptFileError: "পিডিএফ পড়তে সমস্যা হয়েছে। ফাইলটি নষ্ট অথবা পাসওয়ার্ড সুরক্ষিত হতে পারে।",
    fileTooLargeError: "ফাইলের আকার অতিরিক্ত বড়। সর্বোচ্চ ৫০ মেগাবাইট ফাইল গ্রহণযোগ্য।",
    
    // TOC / Cover details
    coverTitle: "দরপত্র দাখিল প্যাকেজ",
    tableOfContents: "সূচিপত্র",
    dateGenerated: "তৈরির তারিখ",
    pageRange: "পৃষ্ঠা পরিসীমা",
    documentId: "নথি নং",
    preparedBy: "প্রস্তুতকারক",
    submittedTo: "প্রাপক",
    
    // AI Helper
    aiHelperTitle: "এআই সহকারী (ঐচ্ছিক)",
    aiHelperDesc: "নথির তথ্য স্বয়ংক্রিয়ভাবে যাচাই এবং মেয়াদ তারিখ খোঁজার জন্য আপনার নিজস্ব API Key ব্যবহার করুন।",
    aiApiKey: "এপিআই কী (API Key)",
    aiApiKeyPlaceholder: "আপনার ব্যক্তিগত API Key দিন...",
    analyzeDocs: "এআই দিয়ে নথি বিশ্লেষণ",
    aiDisclaimer: "আপনার এপিআই কী শুধুমাত্র ব্রাউজারের মেমরিতে থাকবে, কোনো সার্ভারে পাঠানো হবে না।",
    
    // Export / Import
    projectSaved: "প্রজেক্টের অবস্থা সফলভাবে সংরক্ষণ করা হয়েছে!",
    projectLoaded: "প্রজেক্ট সফলভাবে লোড হয়েছে!",
    invalidProjectFile: "প্রজেক্ট ফাইলটি সঠিক নয়।",
    
    // Footer & Credits
    footerText: "এআই ডেভফেস্ট ২০২৬ এআই ভাইব-কোডিং কনটেস্ট | ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি (CPC ও CSE-TECH)",
    developedWith: "ফ্রন্টএন্ড-অনলি আর্কিটেকচার • ব্রাউজার-সাইড পিডিএফ প্রসেসিং • জিরো ব্যাকএন্ড নির্ভরতা"
  }
};
