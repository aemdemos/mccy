/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main layout: desktop (.lg:block) or fallback
  let mainLayout = element.querySelector('.lg\\:block');
  if (!mainLayout) mainLayout = element.querySelector(':scope > div');
  if (!mainLayout) mainLayout = element;

  // Find the columns grid
  let columnsGrid = mainLayout.querySelector('.lg\\:grid');
  if (!columnsGrid) columnsGrid = mainLayout.querySelector('.prose-body-sm.flex');
  if (!columnsGrid) columnsGrid = mainLayout.querySelector(':scope > div');

  // Find left/right column content
  let columnDivs = [];
  if (columnsGrid) {
    columnDivs = Array.from(columnsGrid.children)
      .filter(div => div.childElementCount > 0 || div.textContent.trim().length > 0)
      .slice(0, 2);
  }

  // Left column: h2 and first column's content
  const leftColWrapper = document.createElement('div');
  const h2 = mainLayout.querySelector('h2');
  if (h2) leftColWrapper.appendChild(h2);
  if (columnDivs[0]) {
    Array.from(columnDivs[0].childNodes).forEach(child => leftColWrapper.appendChild(child));
  }

  // Right column: second column's content
  const rightColWrapper = document.createElement('div');
  if (columnDivs[1]) {
    Array.from(columnDivs[1].childNodes).forEach(child => rightColWrapper.appendChild(child));
  }

  // --- CRITICAL FIX: include all non-empty siblings after the mainLayout ---
  // Find the last main content node (columnsGrid or last columnDiv)
  let lastContentNode = columnsGrid;
  if (!lastContentNode && columnDivs.length) lastContentNode = columnDivs[columnDivs.length - 1];
  if (!lastContentNode) lastContentNode = mainLayout.lastElementChild;
  // For desktop, copyright/builder are outside the grid, as siblings of mainLayout; for mobile, as children after the column stack
  // We want to get all non-empty elements that appear after either columnsGrid or mainLayout in the parent
  let afterNodes = [];
  // Try after mainLayout in its parent (footer is element)
  let mainSib = mainLayout.nextElementSibling;
  while (mainSib) {
    if (mainSib.childElementCount > 0 || mainSib.textContent.trim().length > 0) {
      afterNodes.push(mainSib);
    }
    mainSib = mainSib.nextElementSibling;
  }
  // Also, after columnsGrid in mainLayout
  if (columnsGrid) {
    let sib = columnsGrid.nextElementSibling;
    while (sib) {
      if (sib.childElementCount > 0 || sib.textContent.trim().length > 0) {
        afterNodes.push(sib);
      }
      sib = sib.nextElementSibling;
    }
  }
  // For some layouts, copyright/builder may be nested in another wrapper after the grid
  // To ensure we don't double-insert, only append each node once
  const seen = new Set();
  afterNodes.forEach(n => {
    if (!seen.has(n)) {
      rightColWrapper.appendChild(n);
      seen.add(n);
    }
  });

  // Compose the block table
  const rows = [
    ['Columns (columns5)'],
    [leftColWrapper, rightColWrapper]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
