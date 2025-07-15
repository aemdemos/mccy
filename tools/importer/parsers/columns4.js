/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find main content container with columns (desktop or mobile)
  let mainContent = element.querySelector(':scope > div.lg\\:block:not(.hidden)')
    || element.querySelector(':scope > div.lg\\:hidden:not(.hidden)')
    || element.querySelector(':scope > div');

  let columns = [];

  if (mainContent) {
    // Try desktop grid layout
    let grid = mainContent.querySelector('div.grid, div[class*="grid-cols"]');
    if (grid) {
      // The desktop layout's grid columns: direct children
      let gridChildren = Array.from(grid.children);
      // Only columns with actual content
      gridChildren = gridChildren.filter(col =>
        col.textContent.trim().length > 0 || col.querySelector('a,svg,img')
      );
      // Only use the first two as visually parallel columns
      columns = gridChildren.slice(0, 2).map(col => col);
    } else {
      // On mobile, after heading, the first two flex divs are columns
      let children = Array.from(mainContent.children);
      if (children[0] && /^H\d$/i.test(children[0].tagName)) {
        children = children.slice(1);
      }
      // Only non-empty divs
      columns = children.filter(el =>
        el.tagName === 'DIV' && el.textContent.trim().length > 0
      ).slice(0, 2).map(col => col);
    }
  }
  // Fallback: if no columns found, put mainContent as a single cell
  if (columns.length < 2 && mainContent) {
    columns = [mainContent];
  }
  // Final fallback: just use the element itself
  if (!columns.length) {
    columns = [element];
  }
  // Create Columns block table
  const headerRow = ['Columns'];
  const dataRow = columns;
  const cells = [headerRow, dataRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
