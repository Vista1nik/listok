---
title: "Quick Start"
category: 'Getting Started'
---
Listok is a static site generator that takes Markdown files with EJS layouts and transforms them into ready to deploy websites!

The following tools are required to use Listok:
* **LTS or current version** of NodeJS


## Instructions
Bootstrap a new static site using:
```bash
npx listok new
```

This will create a new folder with empty template and automatically install dependencies and setup a new Git repository.

The folder structure of project looks like this:
* **template** — The main folder where everything related to site generation is stored.
    * **extensions** — JS functions which runs on page compilation. [Learn more...](/docs/features/extensions)
    * **includes** — EJS partials.
    * **public** — Folder for static files like CSS, JS, pictures, etc.
    * **index.ejs** — Default template for pages where is no template option specified in [front-matter](/docs/features/frontmatter).

Start development server using:
```bash
yarn dev # or npx listok serve
```

And you're ready!