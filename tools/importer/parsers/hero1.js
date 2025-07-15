/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header
  const headerRow = ['Hero (hero1)'];

  // 2. Background image row
  let imageEl = null;
  const style = element.getAttribute('style') || '';
  const bgImgMatch = style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
  if (bgImgMatch && bgImgMatch[1]) {
    imageEl = document.createElement('img');
    imageEl.src = bgImgMatch[1];
    imageEl.alt = '';
  }
  const imageRow = [imageEl];

  // 3. Text content row
  // Find the deepest .flex-col.gap-6, which contains the h1 and p
  let textContent = null;
  let contentDiv = element.querySelector('div.flex.flex-col.gap-6');
  if (!contentDiv) {
    // fallback: take the first h1/p in the block
    const h1 = element.querySelector('h1');
    const p = element.querySelector('p');
    if (h1 || p) {
      const wrapper = document.createElement('div');
      if (h1) wrapper.appendChild(h1);
      if (p) wrapper.appendChild(p);
      textContent = wrapper;
    }
  } else {
    textContent = contentDiv;
  }
  const textRow = [textContent];
  
  // Compose table cells
  const cells = [headerRow, imageRow, textRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
