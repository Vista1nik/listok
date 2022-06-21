---
title: "Syntax Highlighting"
category: 'Extensions'
---
You can add syntax highlighting to your website by using PrismJS library
```js
// template/extensions/syntax-highlighting.js
const prism = require("prismjs");

require("prismjs/components/prism-markup-templating");
require("prismjs/components/prism-css");
require("prismjs/components/prism-php");
require("prismjs/components/prism-json");
require("prismjs/components/prism-javascript");
require("prismjs/components/prism-jsx");
require("prismjs/components/prism-bash");
require("prismjs/components/prism-yaml");
require("prismjs/components/prism-toml");
require("prismjs/components/prism-diff");

module.exports = (marked) => {
    marked.setOptions({
    highlight: (code, lang) => {
        if (prism.languages[lang]) {
        return prism.highlight(code, prism.languages[lang], lang);
        } else {
        return code;
        }
    },
    });
}
```

After adding extension, you need to choose [PrismJS Theme](https://github.com/PrismJS/prism-themes) and add it's CSS file into template.

```diff
## template/includes/header.ejs
<head>
     <link rel="stylesheet" href="/public/style.css">
+    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prism-themes@1.9.0/themes/prism-atom-dark.min.css">
</head>
```