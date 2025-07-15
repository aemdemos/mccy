/* global WebImporter */
export default function parse(element, { document }) {
  // The block expects a table with header 'Columns (columns4)' and a row with 2 columns (main + sidebar)

  // 1. Find the two major visual columns (large left, narrow right)
  // Left: main content (col-span-12 flex flex-col gap-16 ...)
  // Right: sidebar (relative col-span-3 hidden lg:block)
  let leftCol = null;
  let rightCol = null;

  // The grid may have multiple direct children, find by structure
  const children = Array.from(element.children);
  for (let child of children) {
    if (
      child.classList.contains('flex') &&
      child.classList.contains('flex-col') &&
      child.classList.contains('gap-16')
    ) {
      leftCol = child;
    } else if (
      child.classList.contains('relative') &&
      child.classList.contains('col-span-3')
    ) {
      rightCol = child;
    }
  }

  // Compose table rows: Always output 2 columns (if rightCol missing, second cell is empty)
  const cells = [
    ['Columns (columns4)'],
    [leftCol, rightCol || ''],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original (entire grid) element
  element.replaceWith(block);
}
