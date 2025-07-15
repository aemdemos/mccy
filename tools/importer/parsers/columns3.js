/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be a single cell (not one per column!)
  const headerRow = ['Columns (columns3)'];

  // Gather all top-level columns (should be <a> elements)
  const columns = Array.from(element.querySelectorAll(':scope > a'));

  // For each column, extract and assemble its content for one cell
  const contentRow = columns.map((col) => {
    // Use a fragment to gather content
    const frag = document.createDocumentFragment();
    const inner = col.querySelector('div');
    if (!inner) return '';
    // Grab the relevant elements
    const date = inner.querySelector('p.prose-label-sm-medium');
    if (date) frag.appendChild(date);
    const h3 = inner.querySelector('h3');
    if (h3) {
      const h3Clone = h3.cloneNode(true);
      Array.from(h3Clone.querySelectorAll('svg')).forEach(svg => svg.remove());
      const headlineLink = document.createElement('a');
      headlineLink.href = col.href;
      while (h3Clone.firstChild) {
        headlineLink.appendChild(h3Clone.firstChild);
      }
      frag.appendChild(headlineLink);
    }
    const type = inner.querySelector('p.prose-label-sm-regular');
    if (type) frag.appendChild(type);
    return frag;
  });

  // The table must have a single-cell header row, second row with N cells (one per column)
  const cells = [
    headerRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
