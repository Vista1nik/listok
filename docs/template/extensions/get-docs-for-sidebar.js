const fs = require('fs')
const glob = require('glob')
const path = require('path')
const fm = require('front-matter')
const _ = require('lodash')

module.exports = () => {
    const docs = _.groupBy(glob.sync(path.join(process.cwd(), 'docs', '**/*.md')).map(doc => {
        let frontmatter = fm(fs.readFileSync(doc, 'utf-8'))

        return {
            title: frontmatter.attributes.title,
            category: frontmatter.attributes.category,
            url: doc.slice(process.cwd().length).replace('.md', '').replace('/index', '')
        }
    }), 'category')

    return {
        docs: {
            'Getting Started': docs['Getting Started'],
            'Features': docs['Features'],
            'Extensions': docs['Extensions'],
            'Deploy': docs['Deploy']
        }
    }
}