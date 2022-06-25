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
    const parsed = fm(fs.readFileSync(file, 'utf-8'))
    const attributes = parsed.attributes as any

    let template = path.join(process.cwd(), 'template', 'index.ejs')

    if (attributes.template) {
        template = templates.find(template => template === path.join(process.cwd(), 'template', attributes.template + '.ejs'))!
    }

    const extensionsResult = extensions.map(extension => extension(marked, attributes, parsed.body))

    return ejs.render(
        fs.readFileSync(template, 'utf-8'), 
        {
            ...attributes,
            ...Object.assign({}, ...extensionsResult),
            url: file.slice(process.cwd().length, path.extname(file).length * -1).replace('/index', '') || '/',
            path: file.slice(process.cwd().length),
            content: marked(parsed.body)
        },
        {
            root: path.join(process.cwd(), 'template')
        }
    )
}