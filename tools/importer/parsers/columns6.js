/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Collect all child nodes (including text) as array
  function collectContentArray(el) {
    if (!el) return [];
    const nodes = [];
    el.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent;
        nodes.push(span);
      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        !node.classList.contains('hidden') &&
        node.style.display !== 'none'
      ) {
        nodes.push(node);
      }
    });
    return nodes;
  }

  // HEADER ROW
  const headerRow = ['Columns (columns6)'];

  // Prefer desktop structure for best separation
  let leftMain = [], rightMain = [], leftFooter = [], rightFooter = [];
  const desktop = element.querySelector('div.lg\\:block');
  if (desktop) {
    // --- MAIN ROW ---
    // Left: h2 + all nav links (first flex-col.gap-3)
    const h2 = desktop.querySelector('h2');
    const navLinks = desktop.querySelector('.prose-body-sm.flex > .flex-col.gap-3');
    if (h2) leftMain.push(h2);
    if (navLinks) leftMain = leftMain.concat(collectContentArray(navLinks));

    // Right: Reach us/content block (contains h3, socials, contact/feedback)
    // It is the '.flex.flex-col.gap-6.lg\:w-fit' (or fallback to '.flex.flex-col.gap-6')
    let rightMainBlock = desktop.querySelector('.flex.flex-col.gap-6.lg\\:w-fit');
    if (!rightMainBlock) {
      const candidates = Array.from(desktop.querySelectorAll('.flex.flex-col.gap-6'));
      // Skip ones inside .gap-9 (footer)
      rightMainBlock = candidates.filter(el => !el.closest('.gap-9'))[0];
    }
    if (rightMainBlock) rightMain = rightMain.concat(collectContentArray(rightMainBlock));

    // --- FOOTER ROW ---
    // Left: copyright/meta (.flex.h-full inside .gap-9)
    const footerMeta = desktop.querySelector('.flex-col.gap-9 .flex.h-full');
    if (footerMeta) leftFooter = leftFooter.concat(collectContentArray(footerMeta));
    // Right: build/by (.flex-col.gap-6, .gap-8, .gap-20 inside gap-9, all isomer/build links)
    // We want both 'Made with Isomer' and 'Built by Open Government Products'
    let footerBuilds = Array.from(desktop.querySelectorAll('.flex-col.gap-9 a'))
      .filter(a => /isomer|open gov/i.test(a.textContent));
    // get their shared container(s)
    const buildContainers = Array.from(new Set(footerBuilds.map(a => a.closest('.prose-label-md-regular.flex, .flex-col.gap-6, .flex-col.gap-8, .flex-row, .gap-20)'))).filter(Boolean);
    buildContainers.forEach(cont => {
      rightFooter = rightFooter.concat(collectContentArray(cont));
    });
    // fallback to explicit .prose-label-md-regular.flex (if above is empty)
    if (rightFooter.length === 0) {
      const fallbackBuild = desktop.querySelector('.flex-col.gap-9 .prose-label-md-regular.flex');
      if (fallbackBuild) rightFooter = rightFooter.concat(collectContentArray(fallbackBuild));
    }
  } else {
    // MOBILE fallback
    const mobile = element.querySelector('div.px-6') || element;
    const h2 = mobile.querySelector('h2');
    const navLinks = mobile.querySelector('.prose-body-sm.flex > .flex-col.gap-3');
    if (h2) leftMain.push(h2);
    if (navLinks) leftMain = leftMain.concat(collectContentArray(navLinks));
    let rightMainBlock = mobile.querySelector('.flex.flex-col.gap-6');
    if (rightMainBlock) rightMain = rightMain.concat(collectContentArray(rightMainBlock));
    const footerMeta = mobile.querySelector('.flex.h-full');
    if (footerMeta) leftFooter = leftFooter.concat(collectContentArray(footerMeta));
    let footerBuild = mobile.querySelector('.prose-label-md-regular.flex') || mobile.querySelector('.flex-col.gap-6');
    if (footerBuild) rightFooter = rightFooter.concat(collectContentArray(footerBuild));
  }

  // If any cell is still empty, fill with '' to keep column count correct
  const mainRow = [leftMain.length ? leftMain : '', rightMain.length ? rightMain : ''];
  const footerRow = [leftFooter.length ? leftFooter : '', rightFooter.length ? rightFooter : ''];
  const cells = [headerRow, mainRow, footerRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
