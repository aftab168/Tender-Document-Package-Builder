/**
 * Calculate SHA-256 hash of an ArrayBuffer or File
 */
export async function calculateFileHash(arrayBuffer) {
  if (window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback simple checksum if crypto subtle is not available
  let hash = 0;
  const uint8 = new Uint8Array(arrayBuffer);
  for (let i = 0; i < uint8.length; i++) {
    hash = ((hash << 5) - hash) + uint8[i];
    hash |= 0;
  }
  return 'simple_' + Math.abs(hash).toString(16) + '_' + uint8.length;
}

/**
 * Scan a list of files and annotate duplicate status
 */
export function analyzeDuplicates(files) {
  const hashMap = new Map();
  
  // Group files by hash
  files.forEach(file => {
    if (!file.hash) return;
    if (!hashMap.has(file.hash)) {
      hashMap.set(file.hash, []);
    }
    hashMap.get(file.hash).push(file);
  });
  
  return files.map(file => {
    if (!file.hash) return { ...file, isDuplicate: false, duplicateOf: null };
    const matching = hashMap.get(file.hash) || [];
    if (matching.length > 1) {
      // Find the first occurrence (original)
      const original = matching[0];
      const isOriginal = original.id === file.id;
      const otherNames = matching.filter(f => f.id !== file.id).map(f => f.name);
      return {
        ...file,
        isDuplicate: true,
        isDuplicateCopy: !isOriginal,
        duplicateWith: otherNames,
        duplicateOf: !isOriginal ? original.name : otherNames[0]
      };
    }
    return {
      ...file,
      isDuplicate: false,
      isDuplicateCopy: false,
      duplicateWith: [],
      duplicateOf: null
    };
  });
}
