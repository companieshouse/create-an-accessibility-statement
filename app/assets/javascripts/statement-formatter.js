function formatHTML(html) {
  const blockElements = ['article', 'section', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'pre', 'code'];
  let formatted = '';
  let indent = 0;
  let i = 0;
  let currentLine = '';

  while (i < html.length) {
    let tagStart = html.indexOf('<', i);
    
    if (tagStart === -1) {
      let text = html.substring(i).trim();
      if (text) {
        currentLine += text;
      }
      if (currentLine.trim()) {
        formatted += '  '.repeat(indent) + currentLine + '\n';
      }
      break;
    }

    // Get text before tag
    if (tagStart > i) {
      let text = html.substring(i, tagStart);
      let trimmedText = text.trim();
      if (trimmedText) {
        currentLine += trimmedText;
        // Check if original text ended with space
        if (text !== trimmedText && text.endsWith(' ')) {
          currentLine += ' ';
        }
      }
    }

    // Find tag end
    let tagEnd = html.indexOf('>', tagStart);
    let tag = html.substring(tagStart, tagEnd + 1);
    
    // Extract tag name
    let tagNameMatch = tag.match(/<\/?(\w+)/);
    let tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : '';

    // Check if closing tag
    const isClosing = tag.startsWith('</');
    const isSelfClosing = tag.endsWith('/>');
    const isBlockElement = blockElements.includes(tagName);

    if (isClosing && isBlockElement) {
      indent = Math.max(0, indent - 1);
      if (currentLine.trim()) {
        formatted += '  '.repeat(indent) + currentLine + '\n';
        currentLine = '';
      }
      formatted += '  '.repeat(indent) + tag + '\n';
    } else if (isBlockElement && !isClosing) {
      if (currentLine.trim()) {
        formatted += '  '.repeat(indent) + currentLine + '\n';
        currentLine = '';
      }
      formatted += '  '.repeat(indent) + tag + '\n';
      if (!isSelfClosing) {
        indent++;
      }
    } else {
      // Inline element - add to current line
      currentLine += tag;
    }

    i = tagEnd + 1;
  }

  return formatted.trim();
}

function htmlToMarkdown(html) {
  let markdown = '';
  let i = 0;
  let currentLine = '';

  while (i < html.length) {
    let tagStart = html.indexOf('<', i);
    
    if (tagStart === -1) {
      let text = html.substring(i).trim();
      if (text) {
        currentLine += text;
      }
      if (currentLine.trim()) {
        markdown += currentLine + '\n\n';
      }
      break;
    }

    // Get text before tag
    if (tagStart > i) {
      let text = html.substring(i, tagStart);
      let trimmedText = text.trim();
      if (trimmedText) {
        currentLine += trimmedText;
        // Check if original text ended with space
        if (text !== trimmedText && text.endsWith(' ')) {
          currentLine += ' ';
        }
      }
    }

    // Find tag end
    let tagEnd = html.indexOf('>', tagStart);
    let tag = html.substring(tagStart, tagEnd + 1);
    
    // Extract tag name
    let tagNameMatch = tag.match(/<\/?(\w+)/);
    let tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : '';

    // Check if closing tag
    const isClosing = tag.startsWith('</');

    if (tagName === 'h1' && isClosing) {
      markdown += 'TITLE: ' + currentLine + '\n\n';
      currentLine = '';
    } else if (tagName === 'h2' && isClosing) {
      markdown += '## ' + currentLine + '\n\n';
      currentLine = '';
    } else if (tagName === 'h3' && isClosing) {
      markdown += '### ' + currentLine + '\n\n';
      currentLine = '';
    } else if (tagName === 'p' && isClosing) {
      markdown += currentLine + '\n\n';
      currentLine = '';
    } else if (tagName === 'li' && isClosing) {
      markdown += '- ' + currentLine + '\n';
      currentLine = '';
    } else if ((tagName === 'ul' || tagName === 'ol') && isClosing) {
      markdown += '\n';
    } else if (tagName === 'a' && !isClosing) {
      let href = tag.match(/href=["']([^"']+)["']/);
      let hrefValue = href ? href[1] : '#';
      let linkText = '';
      let linkEnd = html.indexOf('</a>', tagEnd);
      if (linkEnd > tagEnd) {
        linkText = html.substring(tagEnd + 1, linkEnd).trim();
      }
      currentLine += '[' + linkText + '](' + hrefValue + ')';
      i = linkEnd + 4; // Move past </a>
      continue;
    }

    i = tagEnd + 1;
  }

  return markdown.trim();
}

document.addEventListener('DOMContentLoaded', function() {
  const statementContent = document.getElementById('statement-content').innerHTML;
  const htmlOutput = document.getElementById('html-output');
  const markdownOutput = document.getElementById('markdown-output');
  
  // Format and display HTML
  const formattedHTML = formatHTML(statementContent);
  htmlOutput.textContent = formattedHTML;
  Prism.highlightElement(htmlOutput);
  
  // Convert and display Markdown
  const markdownText = htmlToMarkdown(statementContent);
  markdownOutput.textContent = markdownText;
  Prism.highlightElement(markdownOutput);
  
  // Copy HTML to clipboard
  document.getElementById('copy-html-btn').addEventListener('click', function() {
    const text = htmlOutput.textContent;
    navigator.clipboard.writeText(text).then(() => {
      alert('HTML copied to clipboard');
    });
  });
  
  // Copy Markdown to clipboard
  document.getElementById('copy-markdown-btn').addEventListener('click', function() {
    const text = markdownOutput.textContent;
    navigator.clipboard.writeText(text).then(() => {
      alert('Markdown copied to clipboard');
    });
  });
});

// Copy Preview tab to clipboard


document.addEventListener("DOMContentLoaded", function () {
  const previewButton = document.querySelector('[data-module="copy-preview"]');
  const previewPanel = document.querySelector("#preview");

  if (!previewButton || !previewPanel) return;

  previewButton.addEventListener("click", function () {
    const textToCopy = previewPanel.innerText.trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      alert("Preview text copied to clipboard");
    });
  });
});

