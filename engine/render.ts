import { marked } from 'marked';
import ejs from 'ejs'
import fm from 'front-matter';
import fs from 'fs'
import path from 'path';

export default ({
    file,
    templates,
    extensions
}: {
    file: string
    templates: string[]
    extensions: any[]
}) => {
    return new Promise<string>((resolve, reject) => {
        const parsed = fm(fs.readFileSync(file, 'utf-8'))

        let template = path.join(process.cwd(), 'template', 'index.ejs')

        // @ts-ignore
        if (parsed.attributes.template) {
            // @ts-ignore
           template = templates.find(template => template === path.join(process.cwd(), 'template', parsed.attributes.template + '.ejs'))
        }

        extensions.forEach(extension => {
            marked.use(extension)
        })
    
        ejs.renderFile(template, {
            // @ts-ignore
            ...parsed.attributes,
            content: marked(parsed.body)
        }, (err, html) => {
            if (err) {
                reject(err)
            }

            resolve(html)
        })
    })
}