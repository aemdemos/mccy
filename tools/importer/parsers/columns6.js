/* global WebImporter */
export default function parse(element, { document }) {
  // Helper function: collect all direct children, including text nodes, with all text preserved, from a parent element
  function collectContent(parent) {
    const arr = [];
    for (const node of parent.childNodes) {
      if (node.nodeType === 3) { // Text node
        if (node.textContent.trim()) arr.push(document.createTextNode(node.textContent));
      } else if (node.nodeType === 1) {
        arr.push(node);
      }
    }
    return arr;
  }

  // Find desktop and mobile main wrappers
  const wrappers = element.querySelectorAll(':scope > div');
  const desktop = Array.from(wrappers).find(div => div.classList.contains('lg:block'));
  const mobile = Array.from(wrappers).find(div => div.classList.contains('lg:hidden'));

  let col1Content = [];
  let col2Content = [];

  if (desktop && desktop.querySelector('.mx-auto')) {
    const mx = desktop.querySelector('.mx-auto');
    // The children: usually [h2, grid, footerBlock1, footerBlock2]
    const mxChildren = Array.from(mx.children);
    const h2 = mxChildren.find(c => c.tagName === 'H2');
    const grid = mxChildren.find(c => c.className && c.className.includes('grid'));
    let gridCols = [];
    if (grid) {
      gridCols = Array.from(grid.querySelectorAll(':scope > div'));
    }
    // col1: heading + all content from first grid column
    if (h2) col1Content.push(h2);
    if (gridCols[0]) {
      col1Content.push(...collectContent(gridCols[0]));
    }
    // col2: all content from second grid column
    if (gridCols[1]) {
      col2Content.push(...collectContent(gridCols[1]));
    }
    // Now, for the remainder blocks (footer, credits, etc):
    // Place ALL remaining blocks after the grid into col1 (as in example: one column, two rows)
    for (let i = mxChildren.indexOf(grid) + 1; i < mxChildren.length; i++) {
      const blockContent = collectContent(mxChildren[i]);
      if (blockContent.length) {
        // For a two-row table, we need to create a second row with both columns populated correctly
        // But the example wants all footer extra content to be in a single row/column
        // So we add an extra row only if there is actual content
        // We'll build the cells array below based on what we collect
        col1Content.push(...blockContent);
      }
    }
  } else if (mobile) {
    const children = Array.from(mobile.children);
    // The order: h2, block1, block2, block3, ...
    const h2 = children.find(c => c.tagName === 'H2');
    const divs = children.filter(c => c.tagName === 'DIV');
    if (h2) col1Content.push(h2);
    if (divs[0]) {
      col1Content.push(...collectContent(divs[0]));
    }
    if (divs[1]) {
      col2Content.push(...collectContent(divs[1]));
    }
    for (let i = 2; i < divs.length; i++) {
      const blockContent = collectContent(divs[i]);
      if (blockContent.length) {
        col1Content.push(...blockContent);
      }
    }
  } else {
    // fallback: split all children between columns
    const allChildren = Array.from(element.children);
    const mid = Math.ceil(allChildren.length / 2);
    for (let i = 0; i < mid; i++) {
      col1Content.push(...collectContent(allChildren[i]));
    }
    for (let i = mid; i < allChildren.length; i++) {
      col2Content.push(...collectContent(allChildren[i]));
    }
  }

  // Ensure both columns have something (never empty cells)
  if (col1Content.length === 0) col1Content.push(document.createTextNode(''));
  if (col2Content.length === 0) col2Content.push(document.createTextNode(''));

  // Compose table: header (one col), then row with two columns (col1, col2)
  const cells = [
    ['Columns (columns6)'],
    [col1Content, col2Content]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
