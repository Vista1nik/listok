---
title: "Extensions"
category: 'Features'
---
Extensions are JavaScript functions which will execute on page compilation.

Lets look into an example of extension:
```js
// template/extensions/current-date.js
module.exports = (marked, attributes, content) => {
    return {
        date: new Date()
    }
}
```

Extensions functions accepts 3 arguments:
* **marked** — Listok uses [Marked](https://marked.js.org/) to transform Markdown. You can configure it using [marked.use()](https://marked.js.org/using_pro#use).
* **attributes** — Attributes from [front-matter](/docs/features/frontmatter) of current page.
* **content** — Markdown Body.

And return object with properties that will be available in page template.

```ejs
<div>
    <%= date %>
</div>
```