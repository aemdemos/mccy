/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container
  const container = element.querySelector('.container');
  if (!container) return;

  // Find the multidropdown-section
  const mdSection = container.querySelector('.multidropdown-section');
  if (!mdSection) return;

  // Get all dropdown option blocks (they are columns)
  const optionDivs = Array.from(mdSection.querySelectorAll(':scope > .multidropdown-dd-option'));

  // Build each column's cell
  const cells = optionDivs.map((div) => {
    // Include the label and dropdown value
    const label = div.querySelector('label');
    const dropdown = div.querySelector('span.k-dropdownlist');
    let value = '';
    if (dropdown) {
      const valueText = dropdown.querySelector('.k-input-value-text');
      if (valueText) {
        const span = document.createElement('span');
        span.textContent = valueText.textContent;
        value = span;
      }
    }
    return [label, value].filter(Boolean);
  });

  // Add the Go button as a column
  const goBtn = container.querySelector('input#MultiDDQuickLinkBtn');
  if (goBtn) cells.push([goBtn]);

  // Build the data array for the table
  const data = [ ['Columns (columns5)'], cells ];

  // Create the table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable(data, document);

  // Fix: Set colspan on the header cell (th) to span all columns
  const th = table.querySelector('th');
  if (th && cells.length > 1) {
    th.setAttribute('colspan', cells.length);
  }

  // Replace the original element
  element.replaceWith(table);
}
