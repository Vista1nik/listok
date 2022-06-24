<img height="200" src="https://github.com/Vista1nik/listok/blob/master/docs/template/public/logo.png?raw=true" />

# Listok
*From Russian: A leaf or a piece of paper*

A lightweight static site generator powered by Markdown and EJS.

# Features
- Zero JS on the client side.
- Beautiful and minimalistic project structure.
- Easy templating with EJS.
- Powerful extension system.
- Deploy on any static hosting service like GitHub Pages, Netlify, etc.

# Quick start
Create a new project using:
```bash
npx listok new
```

And start development server:
```bash
yarn dev # or npx listok serve
```

There will be a **template** folder and a **index.md** file. Template folder contains your EJS templates.

**index.ejs** is default template which will be applied to all your pages. You can change templates for each page using template property in front-matter. 

Also you can use front-matter to pass data from your pages to the template.

# Extensions
You can extend Listok functionality by creating extensions.

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
