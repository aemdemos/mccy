/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header EXACTLY as example
  const headerRow = ['Hero'];

  // 2. Extract background image from style
  let bgImgUrl = '';
  if (element.hasAttribute('style')) {
    const style = element.getAttribute('style') || '';
    const match = style.match(/background-image\s*:\s*url\(['"]?([^'"]+)['"]?\)/i);
    if (match && match[1]) {
      bgImgUrl = match[1];
    }
  }

  let bgImgEl = null;
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = '';
  }

  // 3. Extract inner content that forms the text portion of hero
  // Find the deepest content block that has a heading (usually .component-content)
  let contentContainer = null;
  const possible = element.querySelectorAll('.component-content, .flex, .content-center');
  for (const c of possible) {
    if (c.querySelector('h1, h2, h3, h4, h5, h6')) {
      contentContainer = c;
      break;
    }
  }
  if (!contentContainer) {
    contentContainer = element;
  }

  // Find the main heading, and any subheading/paragraphs immediately after
  // Sometimes structure is: heading, then p (possibly wrapped in a div)
  let contentElements = [];
  // Find the first heading
  let heading = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    contentElements.push(heading);
    // Gather all subsequent siblings that are P or headings, or DIV that only contains those
    let curr = heading.nextElementSibling;
    while (curr) {
      if (curr.tagName === 'P' || curr.tagName.match(/^H[1-6]$/)) {
        contentElements.push(curr);
      } else if (curr.tagName === 'DIV') {
        // Only include if it contains p/heading
        const inner = curr.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
        if (inner.length > 0) {
          inner.forEach(e => contentElements.push(e));
        }
      }
      curr = curr.nextElementSibling;
    }
  } else {
    // Fallback: include all <p> in contentContainer
    contentElements = Array.from(contentContainer.querySelectorAll('p'));
  }

  // Remove duplicates by using a Set
  contentElements = [...new Set(contentElements)];
  // Filter empty elements
  contentElements = contentElements.filter(e => e && (e.textContent || e.querySelector('*')));
  // If no content found, fallback to the main container
  if (contentElements.length === 0) {
    contentElements = [contentContainer];
  }

  // 4. Compose table structure, matching example: 1 col, 3 rows
  const cells = [
    headerRow,                          // row 1: block name
    [bgImgEl ? bgImgEl : ''],           // row 2: bg image or blank
    [contentElements]                   // row 3: headline, subheadings, paragraphs (all as original elements)
  ];

  // 5. Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
