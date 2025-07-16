/* global WebImporter */
export default function parse(element, { document }) {
  // Block header must be exactly as required
  const headerRow = ['Embed (embedVideo10)'];
  // The embed block requires a single cell with (optionally) an image, then a link to a video platform

  // Check for possible video embeds (iframe, embed, video, or anchor link to vimeo/youtube)
  // First, look for iframe/embed/video with a src to an external video
  let srcUrl = null;
  let imageEl = null;
  
  // Find iframes, embeds, or video links
  const iframe = element.querySelector('iframe');
  if (iframe && iframe.src && /vimeo\.com|youtube\.com|youtu\.be/.test(iframe.src)) {
    srcUrl = iframe.src;
  }
  if (!srcUrl) {
    const embed = element.querySelector('embed');
    if (embed && embed.src && /vimeo\.com|youtube\.com|youtu\.be/.test(embed.src)) {
      srcUrl = embed.src;
    }
  }
  if (!srcUrl) {
    const video = element.querySelector('video');
    if (video && video.src && /vimeo\.com|youtube\.com|youtu\.be/.test(video.src)) {
      srcUrl = video.src;
    }
    // Some videos use <source> tags inside <video>
    if (video && !srcUrl) {
      const source = video.querySelector('source');
      if (source && source.src && /vimeo\.com|youtube\.com|youtu\.be/.test(source.src)) {
        srcUrl = source.src;
      }
    }
  }
  
  // If not found, check for anchor links to video platforms
  if (!srcUrl) {
    const anchors = element.querySelectorAll('a');
    for (const a of anchors) {
      if (/vimeo\.com|youtube\.com|youtu\.be/.test(a.href)) {
        srcUrl = a.href;
        break;
      }
    }
  }
  // If nothing found, do not create the block
  if (!srcUrl) return;

  // Per requirements: if a poster/image is present, add above the link
  // Look for an image above/beside the embed
  // In typical cases, there is a preview image for the video. If there's an <img> in the block, use it.
  const imgs = Array.from(element.querySelectorAll('img'));
  if (imgs.length) {
    // Use the first image found as poster
    imageEl = imgs[0];
  }

  // Build the cell contents
  const cellContent = [];
  if (imageEl) cellContent.push(imageEl);
  // Always output the link below the image (if present)
  const link = document.createElement('a');
  link.href = srcUrl;
  link.textContent = srcUrl;
  cellContent.push(link);

  const cells = [
    headerRow,
    [cellContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
