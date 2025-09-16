/* eslint-disable import/no-unresolved */
import DA_SDK from 'https://da.live/nx/utils/sdk.js';

// HTML escape function
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Simple URL detection regex
const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/gi;

// Auto-detect and convert URLs to links
function autoLinkUrls(text) {
  return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener">$1</a>');
}

// Convert text to HTML based on options
function convertTextToHtml(text, options) {
  if (!text.trim()) return '';

  let html = text;

  // Escape HTML entities if requested
  if (options.escapeHtml) {
    html = escapeHtml(html);
  }

  // Auto-detect links if requested
  if (options.detectLinks && !options.escapeHtml) {
    html = autoLinkUrls(html);
  }

  // Handle line breaks and paragraphs
  if (options.autoParagraphs) {
    // Split by double line breaks to create paragraphs
    const paragraphs = html.split(/\n\s*\n/);
    html = paragraphs
      .map(para => para.trim())
      .filter(para => para.length > 0)
      .map(para => {
        // Handle single line breaks within paragraphs
        if (options.preserveBreaks) {
          para = para.replace(/\n/g, '<br>');
        } else {
          para = para.replace(/\n/g, ' ');
        }
        return `<p>${para}</p>`;
      })
      .join('\n');
  } else if (options.preserveBreaks) {
    // Just convert line breaks to <br> tags
    html = html.replace(/\n/g, '<br>');
  }

  return html;
}

// Add basic syntax highlighting to HTML preview
function highlightHtml(html) {
  return html
    .replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)/g, '$1<span class="tag">$2</span>')
    .replace(/(\s)([a-zA-Z-]+)(=)/g, '$1<span class="attr">$2</span>$3')
    .replace(/(=")([^"]*?)(")/g, '=$1<span class="string">$2</span>$3')
    .replace(/(=')([^']*?)(')/g, '=$1<span class="string">$2</span>$3');
}

// Update the HTML preview
function updatePreview() {
  const textInput = document.getElementById('text-input');
  const htmlPreview = document.getElementById('html-preview');
  const copyButton = document.getElementById('copy-html');
  const insertButton = document.getElementById('insert-html');
  
  const text = textInput.value;
  
  // Get current options
  const options = {
    autoParagraphs: document.getElementById('auto-paragraphs').checked,
    preserveBreaks: document.getElementById('preserve-breaks').checked,
    escapeHtml: document.getElementById('escape-html').checked,
    detectLinks: document.getElementById('detect-links').checked
  };
  
  if (!text.trim()) {
    htmlPreview.innerHTML = `
      <div class="empty-state">
        <p>Enter text to see HTML output</p>
      </div>
    `;
    copyButton.disabled = true;
    insertButton.disabled = true;
    return;
  }
  
  // Convert text to HTML
  const html = convertTextToHtml(text, options);
  
  // Store the raw HTML for copying/inserting
  htmlPreview.dataset.rawHtml = html;
  
  // Display with syntax highlighting
  const escapedHtml = escapeHtml(html);
  const highlightedHtml = highlightHtml(escapedHtml);
  htmlPreview.innerHTML = highlightedHtml;
  
  // Enable buttons
  copyButton.disabled = false;
  insertButton.disabled = false;
}

// Copy HTML to clipboard
async function copyHtml() {
  const htmlPreview = document.getElementById('html-preview');
  const copyButton = document.getElementById('copy-html');
  const rawHtml = htmlPreview.dataset.rawHtml;
  
  if (!rawHtml) return;
  
  try {
    await navigator.clipboard.writeText(rawHtml);
    
    // Show success state
    const originalText = copyButton.textContent;
    copyButton.textContent = 'Copied!';
    copyButton.classList.add('success');
    
    setTimeout(() => {
      copyButton.textContent = originalText;
      copyButton.classList.remove('success');
    }, 2000);
  } catch (error) {
    console.error('Failed to copy HTML:', error);
    
    // Fallback: select text for manual copy
    const textArea = document.createElement('textarea');
    textArea.value = rawHtml;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    copyButton.textContent = 'Copied!';
    copyButton.classList.add('success');
    
    setTimeout(() => {
      copyButton.textContent = 'Copy HTML';
      copyButton.classList.remove('success');
    }, 2000);
  }
}

// Insert HTML into document using DA SDK
async function insertHtml() {
  const htmlPreview = document.getElementById('html-preview');
  const rawHtml = htmlPreview.dataset.rawHtml;
  
  if (!rawHtml) return;
  
  try {
    const { actions } = await DA_SDK;
    actions.sendHTML(rawHtml);
    actions.closeLibrary();
  } catch (error) {
    console.error('Failed to insert HTML:', error);
    
    // Fallback: copy to clipboard
    await copyHtml();
  }
}

// Initialize event listeners
function initializeEventListeners() {
  // Text input changes
  const textInput = document.getElementById('text-input');
  textInput.addEventListener('input', updatePreview);
  textInput.addEventListener('paste', () => {
    // Small delay to allow paste to complete
    setTimeout(updatePreview, 10);
  });
  
  // Option changes
  const options = [
    'auto-paragraphs',
    'preserve-breaks', 
    'escape-html',
    'detect-links'
  ];
  
  options.forEach(optionId => {
    const checkbox = document.getElementById(optionId);
    checkbox.addEventListener('change', updatePreview);
  });
  
  // Button clicks
  document.getElementById('copy-html').addEventListener('click', copyHtml);
  document.getElementById('insert-html').addEventListener('click', insertHtml);
  
  // Handle mutual exclusivity between auto-paragraphs and preserve-breaks
  const autoParagraphs = document.getElementById('auto-paragraphs');
  const preserveBreaks = document.getElementById('preserve-breaks');
  
  autoParagraphs.addEventListener('change', () => {
    if (autoParagraphs.checked) {
      // Both can be enabled together for breaks within paragraphs
    }
    updatePreview();
  });
  
  preserveBreaks.addEventListener('change', () => {
    updatePreview();
  });
}

// Sample text for demonstration
function loadSampleText() {
  const textInput = document.getElementById('text-input');
  
  // Only load sample if input is empty
  if (!textInput.value.trim()) {
    const sampleText = `Welcome to Text to HTML Converter

This plugin helps you convert plain text into properly formatted HTML.

Here's what you can do:
- Convert paragraphs automatically
- Preserve line breaks as <br> tags  
- Escape HTML entities like <script> tags
- Auto-detect URLs like https://example.com

Try editing this text and see the HTML output update in real-time!

You can also paste content from other sources and convert it to clean HTML for your documents.`;
    
    textInput.value = sampleText;
    updatePreview();
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  loadSampleText();
  updatePreview();
});
