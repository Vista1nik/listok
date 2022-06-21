import chalk from 'chalk'
import fs from 'fs'
import glob from "glob"
import path from "path"
import http from 'http'
import mime from 'mime'
import engine from '../engine'

export default () => {
    try {
        const projectPath = process.cwd()

        const {
            templates,
            extensions,
            markdownFiles
        } = engine.parser(projectPath)
    
        http.createServer(async (req, res) => {

            if (req.url?.startsWith('/public/')) {
                let filepath = path.join(projectPath, 'template', req.url!)

                if (fs.existsSync(filepath)) {
                    res.writeHead(200, { 
                        'Content-Type': mime.getType(filepath) || 'plain/text',
                        'Content-Length': fs.statSync(filepath).size
                    })
                    res.write(fs.readFileSync(filepath))
                    res.end()
                    return;
                }
            }


            let file = markdownFiles.find(file => file.slice(projectPath.length + 1) === (req.url!.slice(1) ? req.url!.slice(1).concat('.md') : 'index.md'))

            if (!file) {
                file = markdownFiles.find(file => file.slice(projectPath.length + 1) === req.url!.slice(1) + '/index.md')
            }
    
            if (!file) {
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.write(`<body> <div> <style> body { margin: 0; height: 100%; width: 100%; display: flex; justify-content: center; align-items: center; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; } div { display: flex; gap: 48px; align-items: center; justify-content: center; } .number { font-size: 72px; margin: 0; } .ru { margin: 0; } .en { font-size: 16px; margin-top: 12px; margin-bottom: 0; font-weight: normal; color: #777; font-style: italic; } </style> <h1 class="number">404</h1> <h1 class="ru"> Ne Naideno <p class="en">From Russian: Not Found</p> </h1> </div> </body>`)
                res.end()
                return
            }
    
            try {
                const html = await engine.render({
                    file,
                    templates,
                    extensions
                })
        
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.write(html)
                res.end()
            } catch (error) {
                // @ts-ignore
                const html = error.toString()
        
                res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
                res.write(html)
                res.end()
            }
        })
        .listen(3000)
        .on('listening', () => {
            console.log(`${chalk.green.bold('Ready!')} Your site is available at ${chalk.underline('http://localhost:3000')}`)
        })
    } catch (error) {
        console.log(`${chalk.red.bold('Error:')} ${error}`)
        process.exit(1)
    }
}