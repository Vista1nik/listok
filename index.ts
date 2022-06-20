#!/usr/bin/env node
import { Command } from 'commander'
const program = new Command()

import packagejson from './package.json'

import newCommand from './commands/new'
import build from './commands/build'
import serve from './commands/serve'

program
    .name('listok')
    .description(packagejson.description)
    .version(packagejson.version)

program.command('new')
    .description('Initialize a new listok project')
    .argument('[name]', 'Name of the project')
    .action(newCommand)

program.command('build')
    .description('Build your static site from markdown files and ejs templates')
    .action(build)

program.command('serve')
    .description('Development server for your static site')
    .action(serve)

program.parse()