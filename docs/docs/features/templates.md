---
title: "Templates"
category: 'Features'
---
As templating language Listok uses [EJS](https://ejs.co/) which based on JavaScript syntax.

By default you can use the following variables in your template:
* **content** — HTML content generated from the markdown file.
* **url** — URL of the current page.
* **path** — Path to current markdown file.
* All attributes from [frontmatter](/docs/features/frontmatter).
* Data returned by [extensions](/docs/features/extensions).

---

Lets implement a basic template with header and footer.

For a start, create a **includes** folder inside your **template** folder with header and footer.
```ejs
<!-- template/includes/header.ejs -->
<div class="header">
    <h1>Example</h1>
    <div class="name">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contacts">Contacts</a>
    </div>
</div>
```

```ejs
<!-- template/includes/footer.ejs -->
<div class="footer">
    <p>2022 &copy; Listok</p>
</div>
```

And include them into your main template:

```ejs
<!-- template/index.ejs -->
<%- include('/includes/header') %> 
<%- content %>
<%- include('/includes/footer') %>
```