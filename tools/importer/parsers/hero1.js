/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero'];

  // 2. Background image row
  // Extract background-image URL from style
  let bgUrl = '';
  const style = element.getAttribute('style') || '';
  const match = style.match(/background-image\s*:\s*url\((['"]?)(.*?)\1\)/i);
  if (match) {
    bgUrl = match[2];
  }
  let bgImgEl = null;
  if (bgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    bgImgEl.alt = '';
  }
  const bgImgRow = [bgImgEl];

  // 3. Content row
  // Find the innermost content div that contains h1 and p
  let contentDiv = null;
  // Try to find .component-content or its relevant descendants
  const contentCandidate = element.querySelector('.component-content');
  if (contentCandidate) {
    // The div with both h1 and p is a child (usually two levels down)
    const innerDivs = contentCandidate.querySelectorAll('div');
    for (const d of innerDivs) {
      if (
        d.querySelector('h1, h2, h3, h4, h5, h6') ||
        d.querySelector('p')
      ) {
        contentDiv = d;
        break;
      }
    }
  }
  // Fallbacks if structure changes
  if (!contentDiv) {
    // Try to find any direct child with heading or p
    const allDivs = element.querySelectorAll('div');
    for (const d of allDivs) {
      if (
        d.querySelector('h1, h2, h3, h4, h5, h6') ||
        d.querySelector('p')
      ) {
        contentDiv = d;
        break;
      }
    }
  }
  // If nothing found, fallback to the whole element
  if (!contentDiv) {
    contentDiv = element;
  }
  const contentRow = [contentDiv];

  // 4. Compose table
  const cells = [headerRow, bgImgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
