/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero1)'];

  // 2. Background image row
  let bgImgUrl = '';
  if (element.hasAttribute('style')) {
    const styleVal = element.getAttribute('style');
    const match = styleVal.match(/background-image:url\(['"]?([^'")]+)['"]?\)/i);
    if (match) {
      bgImgUrl = match[1];
    }
  }
  let bgImgEl = null;
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = '';
  }
  const bgImgRow = [bgImgEl ? bgImgEl : ''];

  // 3. Gather content (title, subheading, cta)
  // Structure: section > div > div > div > div (text content is in the last innermost div)
  let contentCell = '';
  // Find the inner-most div with text content (usually after several wrappers)
  let contentDiv = null;
  // Try to find a div that contains an h1 or a p
  const allDivs = element.querySelectorAll('div');
  for (let div of allDivs) {
    // We want the first div containing an h1 or p (title/subheading)
    if (div.querySelector('h1, .prose-display-xl, p, .prose-title-lg-regular')) {
      // But it should not be a wrapper with only other divs, so check if it contains direct h1/p
      const hasDirect = Array.from(div.children).some(child => ['H1', 'P'].includes(child.tagName));
      if (hasDirect) {
        contentDiv = div;
        break;
      }
      // If not found, fallback to first div anyway
      contentDiv = div;
      break;
    }
  }

  // If found, append all direct child h1 and p elements (preserving order)
  if (contentDiv) {
    const nodes = [];
    Array.from(contentDiv.children).forEach(child => {
      if (
        (child.tagName === 'H1') ||
        (child.tagName === 'P')
      ) {
        nodes.push(child);
      }
    });
    // If nothing found, fallback to contentDiv itself. Else, use the nodes.
    contentCell = nodes.length ? nodes : contentDiv;
  }

  const contentRow = [contentCell];

  // Compose table in the required format
  const cells = [headerRow, bgImgRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
