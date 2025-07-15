/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main content column (central block of cards info)
  let contentCol = element.querySelector(
    '.col-span-12.flex.flex-col.gap-16.break-words.lg\\:col-span-9'
  );
  if (!contentCol) {
    // fallback: first .flex.flex-col with multiple children
    contentCol = Array.from(element.querySelectorAll('.flex.flex-col'))
      .find(d => d.children && d.children.length > 3);
  }

  const cells = [['Cards']];

  // CARD 1: Hero image + What we do
  const heroImg = contentCol.querySelector('img');
  const whatWeDoTitle = contentCol.querySelector('h2[id^="7261ee"]');
  const whatWeDoDesc = whatWeDoTitle && whatWeDoTitle.nextElementSibling && whatWeDoTitle.nextElementSibling.tagName === 'P' ? whatWeDoTitle.nextElementSibling : null;
  if (heroImg && whatWeDoTitle && whatWeDoDesc) {
    cells.push([
      heroImg,
      [whatWeDoTitle, whatWeDoDesc]
    ]);
  }

  // CARD 2: Did you know box
  const didYouKnowBox = contentCol.querySelector('.prose-headline-lg-regular');
  if (didYouKnowBox) {
    // Find all <p> inside this box
    const didYouKnowPs = didYouKnowBox.querySelectorAll('p');
    if (didYouKnowPs.length > 0) {
      // Use first <p> as title ("Did you know?"), second as content if available
      const iconSpan = document.createElement('span');
      iconSpan.textContent = 'ℹ️';
      // If SVG present as icon, can use didYouKnowBox.querySelector('svg')
      cells.push([
        iconSpan,
        Array.from(didYouKnowPs)
      ]);
    }
  }

  // CARD 3: Latest news
  const latestNewsTitle = contentCol.querySelector('h2[id^="ef04c48d"]');
  if (latestNewsTitle) {
    let descs = [];
    let n = latestNewsTitle.nextElementSibling;
    while (n && n.tagName !== 'H2') {
      if (n.tagName === 'P') descs.push(n);
      n = n.nextElementSibling;
    }
    if (descs.length > 0) {
      const iconSpan = document.createElement('span');
      iconSpan.textContent = '📰';
      cells.push([
        iconSpan,
        [latestNewsTitle, ...descs]
      ]);
    }
  }

  // CARD 4: Policies
  const policiesTitle = contentCol.querySelector('h2[id^="7cfe6eeb"]');
  if (policiesTitle) {
    const policiesDesc = policiesTitle.nextElementSibling && policiesTitle.nextElementSibling.tagName === 'P' ? policiesTitle.nextElementSibling : null;
    const policiesList = policiesDesc && policiesDesc.nextElementSibling && policiesDesc.nextElementSibling.tagName === 'UL' ? policiesDesc.nextElementSibling : null;
    const block = [policiesTitle];
    if (policiesDesc) block.push(policiesDesc);
    if (policiesList) block.push(policiesList);
    const iconSpan = document.createElement('span');
    iconSpan.textContent = '📜';
    cells.push([
      iconSpan,
      block
    ]);
  }

  // CARD 5: Initiatives (use section with grid of cards)
  const initiativesSection = contentCol.querySelector('section[id^="f925c0a8"]');
  if (initiativesSection) {
    const initiativesTitle = initiativesSection.querySelector('h2');
    const grid = initiativesSection.querySelector('[class*=grid]');
    const gridLinks = grid ? Array.from(grid.querySelectorAll('a')) : [];
    // Compose links as a list
    let linksList = null;
    if (gridLinks.length > 0) {
      linksList = document.createElement('ul');
      gridLinks.forEach(link => {
        const li = document.createElement('li');
        li.appendChild(link);
        linksList.appendChild(li);
      });
    }
    const block = [initiativesTitle];
    if (linksList) block.push(linksList);
    const iconSpan = document.createElement('span');
    iconSpan.textContent = '💡';
    cells.push([
      iconSpan,
      block
    ]);
  }

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
