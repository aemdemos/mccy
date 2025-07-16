/* global WebImporter */
export default function parse(element, { document }) {
  // Find tab buttons container
  const tabButtonsContainer = element.querySelector('#suitabilityButtons, .home-activities-purpose.cards-slider-category');
  const tabButtons = tabButtonsContainer ? Array.from(tabButtonsContainer.querySelectorAll('button.slider-card')) : [];
  if (!tabButtons.length) return;

  // Build header: single cell 'Tabs'
  const headerRow = ['Tabs'];
  const rows = [headerRow];

  // Each tab: its label and (if present) content. Here, content is missing.
  tabButtons.forEach((btn) => {
    const tabLabel = btn.textContent.trim();
    // Each row must be a single cell containing BOTH the label and content (which may be empty)
    // We create a 2-column row: first cell = label, second cell = content (empty)
    rows.push([tabLabel, '']);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
