import fs from 'fs'
import path from 'path'
import glob from 'glob'
import ora from "ora"
import fm from 'front-matter'
import engine from '../engine'
import inquirer from 'inquirer'
import chalk from 'chalk'

export default async () => {
    const projectPath = process.cwd()

    // Create output directory
    if (fs.existsSync(path.join(projectPath, 'out'))) {
        await inquirer.prompt([
            {
                type: 'confirm',
                name: 'overwrite',
                message: `Output directory ${chalk.cyan(path.join(projectPath, 'out'))} already exists. Overwrite?`,
                default: false
            }
        ]).then(answers => {
            if (answers.overwrite) {
                fs.rmSync(path.join(projectPath, 'out'), { recursive: true })
            } else {
                process.exit(1)
            }
        })
    }

    const spinner = ora(`Building...`).start()
    
    fs.mkdirSync(path.join(projectPath, 'out'))

    // Import templates, extensions and markdown files
    if (!fs.existsSync(path.join(projectPath, "template"))) {
        spinner.fail(`Template directory not found.`)
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

    await Promise.all(
        markdownFiles.map(async file => {
            const html = await engine.render({
                file,
                templates,
                extensions
            })

            const pathToHtml = path.join(projectPath, 'out', path.relative(projectPath, file).replace('.md', '.html'))
            const pathToHtmlDir = path.dirname(pathToHtml)

            fs.mkdirSync(pathToHtmlDir, { recursive: true })
            fs.writeFileSync(pathToHtml, html)
        })
    )

    spinner.succeed(`Project successfully built!`)
}