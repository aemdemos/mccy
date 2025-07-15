/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area (left column, contains main section)
  let mainContent = null;
  const children = element.querySelectorAll(':scope > div');
  for (const child of children) {
    if (child.classList.contains('lg:col-span-9')) {
      mainContent = child;
      break;
    }
  }
  if (!mainContent) return;
  // Within main content, find the actual content div
  // The first div is the toc/sidebar, the second div is the main content
  const mainSections = mainContent.querySelectorAll(':scope > div');
  if (mainSections.length < 2) return;
  const content = mainSections[1];

  // Prepare first column: Everything up to and including Funding
  const col1 = [];
  // Image
  const img = content.querySelector('img');
  if (img) col1.push(img);
  // What we do
  const whatWeDoH2 = content.querySelector('h2[id="7261ee534bd195c64518acabb35390ca"]');
  if (whatWeDoH2) {
    col1.push(whatWeDoH2);
    let node = whatWeDoH2.nextElementSibling;
    while (node && node.tagName !== 'H2') {
      col1.push(node);
      node = node.nextElementSibling;
    }
  }
  // Policies
  const policiesH2 = content.querySelector('h2[id="7cfe6eeb0650dce03e5ffa20e9c99a2c"]');
  if (policiesH2) {
    col1.push(policiesH2);
    let node = policiesH2.nextElementSibling;
    while (node && node.tagName !== 'H2') {
      col1.push(node);
      node = node.nextElementSibling;
    }
  }
  // Funding
  const fundingH2 = content.querySelector('h2[id="fc09e5013795d639ccbbb38a99d99927"]');
  if (fundingH2) {
    col1.push(fundingH2);
    let node = fundingH2.nextElementSibling;
    // Only append the immediate paragraph (as structure shows)
    if (node && node.tagName === 'P') col1.push(node);
  }

  // Prepare second column: Initiatives section and following paragraph
  const col2 = [];
  const initiativesSection = content.querySelector('section#f603412058476d81528c5ef6278c5cd8');
  if (initiativesSection) {
    col2.push(initiativesSection);
    let after = initiativesSection.nextElementSibling;
    if (after && after.tagName === 'P') col2.push(after);
  }

  // Table header exactly per example
  const headerRow = ['Columns (columns4)'];
  // Content row, two columns
  const contentRow = [col1, col2];

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
