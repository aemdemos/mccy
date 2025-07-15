/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per the example, exactly one cell
  const cells = [['Columns (columns5)']];

  // Find the first visible (not hidden) child div (the main footer block)
  const visibleDiv = Array.from(element.children).find(
    child => child.tagName === 'DIV' && !child.classList.contains('hidden')
  );

  const contentContainer = visibleDiv || element;

  // Gather all meaningful direct children from the main contentContainer
  const contentBlocks = Array.from(contentContainer.children).filter(
    child => child.textContent.trim().length > 0 || child.querySelector('a,svg,img,p,h1,h2,h3,h4,h5')
  );

  // Place ALL content blocks into ONE cell as an array (not as multiple cells!)
  // This is the exact fix for the error above
  cells.push([contentBlocks]);

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
