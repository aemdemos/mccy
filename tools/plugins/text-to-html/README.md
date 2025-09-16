# Text to HTML Plugin

A Document Authoring (DA) sidekick plugin for converting plain text into properly formatted HTML. Perfect for quickly transforming text content into semantic HTML with various formatting options.

## 🎯 Overview

The Text to HTML plugin provides a simple interface for converting plain text content into HTML markup. It offers real-time preview and multiple formatting options to suit different content needs.

## ✨ Features

### 📝 **Text Input Interface**
- Large, resizable textarea for comfortable text editing
- Real-time HTML preview as you type
- Sample text provided for quick testing
- Paste support for content from external sources

### ⚙️ **Flexible HTML Options**
- **Auto-wrap paragraphs**: Automatically converts double line breaks into `<p>` tags
- **Preserve line breaks**: Converts single line breaks to `<br>` tags
- **Escape HTML entities**: Safely handles special characters (`<`, `>`, `&`)
- **Auto-detect links**: Converts URLs into clickable `<a>` tags

### 👀 **Live Preview**
- Real-time HTML output with syntax highlighting
- Monospace font for clear code viewing
- Interactive preview that updates as you type or change options

### 📤 **Export Options**
- **Copy HTML**: Copy generated HTML to clipboard
- **Insert into Document**: Direct insertion using DA SDK
- Visual feedback for successful operations

## 🚀 How to Use

### Step 1: Open the Plugin
1. Open Document Authoring
2. Navigate to your page
3. Open the sidekick and select "Text to HTML"

### Step 2: Enter Your Text
1. **Type or paste** your content in the text area
2. The plugin loads with sample text for demonstration
3. **Real-time preview** shows HTML output immediately

### Step 3: Configure Options
Choose from these formatting options:
- ☑️ **Auto-wrap paragraphs** (enabled by default)
- ☐ **Preserve line breaks** 
- ☐ **Escape HTML entities**
- ☐ **Auto-detect links**

### Step 4: Use the HTML
1. **Copy HTML** to clipboard for use elsewhere
2. **Insert into Document** to add directly to your page
3. Preview updates instantly as you make changes

## 📋 Example Conversions

### Basic Paragraph Conversion
**Input:**
```
Welcome to our website

This is a sample paragraph with some content.
It spans multiple lines but should be one paragraph.

This is a second paragraph after a line break.
```

**Output (with auto-paragraphs):**
```html
<p>Welcome to our website</p>
<p>This is a sample paragraph with some content. It spans multiple lines but should be one paragraph.</p>
<p>This is a second paragraph after a line break.</p>
```

### Link Auto-Detection
**Input:**
```
Visit our website at https://example.com for more info.
You can also check https://docs.example.com for documentation.
```

**Output (with auto-detect links):**
```html
<p>Visit our website at <a href="https://example.com" target="_blank" rel="noopener">https://example.com</a> for more info.</p>
<p>You can also check <a href="https://docs.example.com" target="_blank" rel="noopener">https://docs.example.com</a> for documentation.</p>
```

### HTML Entity Escaping
**Input:**
```
Code example: <script>alert('hello')</script>
Use the <div> tag for containers.
```

**Output (with escape HTML entities):**
```html
<p>Code example: &lt;script&gt;alert('hello')&lt;/script&gt;</p>
<p>Use the &lt;div&gt; tag for containers.</p>
```

## 🎯 Perfect For

### 📄 **Content Migration**
- Converting plain text content to HTML
- Cleaning up pasted content from other sources  
- Bulk text processing for multiple pages

### 📝 **Quick Formatting**
- Adding proper paragraph structure to text
- Converting simple text lists to HTML
- Preparing content for web publishing

### 🔗 **Link Processing**
- Auto-converting URLs in text content
- Preparing reference lists with links
- Processing user-generated content

### 🛡️ **Safe HTML Generation**
- Escaping user input for security
- Converting special characters safely
- Preparing content for display

## 🛠️ Technical Details

### Requirements
- Modern browser with ES6+ support
- Document Authoring environment
- Clipboard API support (for copy functionality)

### File Structure
```
tools/plugins/text-to-html/
├── text-to-html.html    # Plugin interface
├── text-to-html.css     # Styling  
├── text-to-html.js      # Main functionality
└── README.md            # This documentation
```

## 🎨 Design Features

### DA Platform Native
- Adobe Clean font family consistency
- Matches DA design system colors and spacing
- Professional button styling and interactions

### 600x600 Dialog Optimized
- Efficient two-column layout
- Scrollable content areas
- Responsive design for smaller screens

### User Experience
- Real-time feedback and updates
- Clear visual separation of input/output
- Intuitive option controls

## 🔧 Processing Logic

### Paragraph Detection
The plugin intelligently handles text structure:
- **Double line breaks** (`\n\n`) create new paragraphs
- **Single line breaks** within paragraphs can be preserved as `<br>` or merged to spaces
- Empty lines are ignored to prevent empty paragraphs

### URL Detection
Uses a robust regex pattern to identify:
- HTTP and HTTPS URLs
- Proper link boundaries (stops at whitespace, quotes, etc.)
- Adds `target="_blank"` and `rel="noopener"` for security

### HTML Escaping
Safely converts:
- `<` becomes `&lt;`
- `>` becomes `&gt;`
- `&` becomes `&amp;`
- Preserves other characters unchanged

## 💡 Tips & Best Practices

1. **Use auto-paragraphs** for most content - it creates the cleanest structure
2. **Enable link detection** when processing user content or references
3. **Escape HTML entities** when dealing with code examples or user input
4. **Preserve line breaks** for poetry, addresses, or formatted text
5. **Test different combinations** - options can work together effectively

## 🐛 Troubleshooting

### Copy/Insert Not Working
- Ensure browser supports Clipboard API
- Check DA SDK connection for insert functionality
- Use manual copy as fallback (text selection method)

### Preview Not Updating
- Check browser console for JavaScript errors
- Refresh the plugin and try again
- Verify all option checkboxes are responding

### Formatting Issues
- Review option combinations - some work better together
- Check source text for unexpected characters
- Test with simpler text first

## 🚀 Future Enhancements

Potential improvements for future versions:
- **Markdown support** for richer text formatting
- **Custom HTML templates** for repeated structures  
- **Batch processing** for multiple text blocks
- **Advanced link options** (custom titles, different targets)
- **Text formatting detection** (bold, italic recognition)

---

**Transform your text instantly! ✨** This plugin makes HTML conversion quick and professional for any content needs.
