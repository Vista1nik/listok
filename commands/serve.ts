import chalk from 'chalk'
import fs from 'fs'
import glob from "glob"
import path from "path"
import http from 'http'
import engine from '../engine'

export default () => {
    const projectPath = process.cwd()

    // Import templates, extensions and markdown files
    if (!fs.existsSync(path.join(projectPath, "template"))) {
        console.error(`${chalk.red.bold('Error!')} Template directory not found.`)
        process.exit(1)
    }

    const templates = glob.sync(path.join(projectPath, 'template/*.ejs'), {
        ignore: [
            path.join(projectPath, "template/includes/**"),
            path.join(projectPath, "template/mixins/**"),
        ]
    })

    const extensions = glob.sync(path.join(projectPath, 'extensions/*.js')).map(file => require(file))

    const markdownFiles = glob.sync(path.join(projectPath, "**/*.md"), {
        ignore: [
            path.join(projectPath, "template/**"),
            path.join(projectPath, "extensions/**"),
        ]
    })

    http.createServer(async (req, res) => {
        // @ts-ignore
        const file = markdownFiles.find(file => file.slice(projectPath.length + 1) === (req.url.slice(1) ? req.url.slice(1).concat('.md') : 'index.md'))

        if (!file) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write(`<body> <div> <style> body { margin: 0; height: 100%; width: 100%; display: flex; justify-content: center; align-items: center; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; } div { display: flex; gap: 48px; align-items: center; justify-content: center; } .number { font-size: 72px; margin: 0; } .ru { margin: 0; } .en { font-size: 16px; margin-top: 12px; margin-bottom: 0; font-weight: normal; color: #777; } </style> <h1 class="number">404</h1> <h1 class="ru"> Не найдено <p class="en">From Russian: Not Found</p> </h1> </div> </body>`)
            res.end()
            return
        }

        const html = await engine.render({
            file,
            templates,
            extensions
        })

        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.write(html)
        res.end()
    })
    .listen(3000)
    .on('listening', () => {
        console.log(`${chalk.green.bold('Ready!')} Your site is available at ${chalk.underline('http://localhost:3000')}`)
    })
}