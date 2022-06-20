import path from "path"
import fs from 'fs'
import { spawn, exec } from 'child_process'
import ora from "ora"
import inquirer from "inquirer"
import git from 'simple-git'
import packagejson from '../package.json'
import chalk from "chalk"

export default async (name: string) => {    
    if (!name) {
        name = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is your project name?',
                validate: (input: string) => {
                    if (input.length < 1) {
                        return 'Please enter a name'
                    }
                    return true
                }
            }
        ]).then(answers => answers.name)
    }

    const spinner = ora(`Initializing project...`).start()

    let projectPath = path.resolve(name)

    if (name === '.') {
        name = path.basename(projectPath)
    }

    if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath)
    }

    if (fs.readdirSync(projectPath).length > 0) {
        spinner.fail(`Directory ${chalk.cyan(projectPath)} is not empty.`)
        process.exit(1)
    }
    
    // Creating package.json and installing dependencies
    let author = (await git(projectPath).getConfig('user.name')).value

    fs.writeFileSync(path.join(projectPath, "package.json"), JSON.stringify({
        name: name,
        version: "1.0.0",
        description: "",
        author: author,
        license: "UNLICENSED",
        scripts: {
            dev: "listok serve",
            build: "listok build",
        },
        dependencies: {
            listok: `^${packagejson.version}`,
        },
    }, null, 2))

    await new Promise((resolve, reject) => {
        // Check if yarn is installed
        exec('yarn --version', (err, stdout, stderr) => {
            if (err) {
                spinner.text = 'Installing dependencies with npm...'
                exec('npm install', { cwd: projectPath }, (err, stdout, stderr) => {
                    if (err) {
                        spinner.fail(`Failed to install dependencies: ${stderr}`)
                        process.exit(1)
                    }
                    resolve('')
                })
            } else {
                spinner.text = 'Installing dependencies with yarn...'
                exec('yarn', { cwd: projectPath }, (err, stdout, stderr) => {
                    if (err) {
                        spinner.fail(`Failed to install dependencies: ${stderr}`)
                        process.exit(1)
                    }
                    resolve('')
                })
            }
        })
    })

    spinner.start()
    spinner.text = 'Creating project files...'
    

    // Creating project files
    fs.writeFileSync(path.join(projectPath, "index.md"), `# Hello World!\n\nThis is a new listok project.`)
    fs.mkdirSync(path.join(projectPath, "template"))

    fs.writeFileSync(path.join(projectPath, "template", "index.ejs"), `<h1>${name}</h1>\n<%- content %>`)
    
    // Initializing git
    spinner.text = 'Initializing git...'
    fs.writeFileSync(path.join(projectPath, ".gitignore"), `.DS_Store\nnode_modules\nout`)
    await git(projectPath).init()
    await git(projectPath).add('./*')
    await git(projectPath).commit('Initial commit')
    
    spinner.succeed(`Project successfully initialized!`)
    console.log(`\nTo start your project, run: \n\n${chalk.cyan(`cd ${name} && yarn dev`)}\n`)
}