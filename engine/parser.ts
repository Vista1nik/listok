import fs from 'fs'
import glob from "glob"
import path from "path"

export default (projectPath: string) => {
    // Import templates, extensions and markdown files
    if (!fs.existsSync(path.join(projectPath, "template"))) {
        throw new Error("No template found");
    }

    const templates = glob.sync(path.join(projectPath, 'template/**/*.ejs'), {
        ignore: [
            path.join(projectPath, "template/includes/**"),
            path.join(projectPath, "template/mixins/**"),
            path.join(projectPath, "template/partials/**"),
            path.join(projectPath, "template/extensions/**"),
            path.join(projectPath, "template/public/**"),
        ]
    })

    const extensions = glob.sync(path.join(projectPath, 'template/extensions/*.js')).map(file => require(file))

    const markdownFiles = glob.sync(path.join(projectPath, "**/*.md"), {
        ignore: [
            path.join(projectPath, "template/**"),
        ]
    })

    return {
        templates,
        extensions,
        markdownFiles
    }
}