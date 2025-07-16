/* global WebImporter */
export default function parse(element, { document }) {
  // Use the desktop block if available, else fallback to element
  const desktop = element.querySelector('.lg\\:block');
  const root = desktop || element;
  // Get main container (best effort)
  const mainWrap = root.querySelector('.mx-auto, .flex.flex-col') || root;

  // Find grid container for columns
  const grid = mainWrap.querySelector('.lg\:grid, .grid-cols-\[1fr_min-content\], .grid');
  let leftCol = null, rightCol = null;
  if (grid) {
    const gridChildren = Array.from(grid.children).filter(e => e.nodeType === 1);
    leftCol = gridChildren[0] || null;
    rightCol = gridChildren[1] || null;
  }

  // --- LEFT COLUMN CELL ---
  let leftCellEls = [];
  // Add heading if present
  const orgHeading = mainWrap.querySelector('h2');
  if (orgHeading) leftCellEls.push(orgHeading);
  // Add links/content in leftCol
  if (leftCol) {
    Array.from(leftCol.children).forEach(child => {
      // Only add if contains visible text or a link
      if (child.textContent.trim() || child.querySelector('a')) {
        leftCellEls.push(child);
      }
    });
  }
  // Fallback: try to avoid empty left cell
  if (leftCellEls.length === 0) {
    // Try to collect mainWrap children except the grid and known bottom bars
    Array.from(mainWrap.children).forEach(child => {
      if (child !== grid && child.textContent.trim()) {
        leftCellEls.push(child);
      }
    });
  }

  // --- RIGHT COLUMN CELL ---
  let rightCellEls = [];
  if (rightCol) {
    Array.from(rightCol.children).forEach(child => {
      if (child.textContent.trim() || child.querySelector('a')) {
        rightCellEls.push(child);
      }
    });
  }
  // Fallback: try to find 'Reach us' or social/contact as a block
  if (rightCellEls.length === 0) {
    // Try to find any h3 (Reach us), social icons, contact, feedback, etc
    let fallback = [];
    Array.from(mainWrap.querySelectorAll('h3, .flex-row, .flex-wrap, .prose-body-sm, a')).forEach(child => {
      if (child.textContent.trim() && !leftCellEls.includes(child)) {
        if (!fallback.includes(child)) fallback.push(child);
      }
    });
    rightCellEls = fallback;
  }

  // --- BOTTOM ROW (FOOTER BAR) ---
  // Find a .flex with two children that is not the grid
  let bottomLeftCellEls = [], bottomRightCellEls = [];
  let allFlexes = Array.from(mainWrap.querySelectorAll(':scope > div.flex'));
  let bottomGrid = allFlexes.find(flex => flex !== grid && flex.children.length === 2);
  if (bottomGrid) {
    let [left, right] = bottomGrid.children;
    if (left) {
      Array.from(left.children).forEach(child => {
        if (child.textContent.trim() || child.querySelector('a')) {
          bottomLeftCellEls.push(child);
        }
      });
    }
    if (right) {
      Array.from(right.children).forEach(child => {
        if (child.textContent.trim() || child.querySelector('svg')) {
          bottomRightCellEls.push(child);
        }
      });
    }
  }
  // Only add footer row if it has any content
  const hasBottomRow = bottomLeftCellEls.length > 0 || bottomRightCellEls.length > 0;

  // Build the block table
  const headerRow = ['Columns (columns6)'];
  const columnsRow = [leftCellEls, rightCellEls];
  const tableRows = hasBottomRow ? [headerRow, columnsRow, [bottomLeftCellEls, bottomRightCellEls]] : [headerRow, columnsRow];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
