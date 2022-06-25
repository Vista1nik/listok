---
title: "Anchors"
category: 'Extensions'
---
```js
// template/extensions/anchor.js
module.exports = (marked) => {
    // Override function
    const renderer = {
        heading(text, level) {
            const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
        
            return `
                    <h${level} class="md-heading" id="${escapedText}">
                        ${text}
                        <a class="anchor" href="#${escapedText}">#</a>
                    </h${level}>`;
        }
    };
    
    marked.use({ renderer });
}
```