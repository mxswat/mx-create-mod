#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as inquirer from 'inquirer';
import chalk from 'chalk';
import {
    TemplateOptions,
    renderTemplate,
    sanitize,
    toPascalCase,
    isFileOrDirectoryToRename,
    generateFileOrDirectoryNameForEJS,
    getTemplateDefaultSettings
} from "./utils/utils";
import { execFile } from 'child_process';

const CURR_DIR = process.cwd();
const CHOICES = fs.readdirSync(path.join(__dirname, 'templates'));
const QUESTIONS = [
    {
        name: 'template',
        type: 'list',
        message: 'What project template would you like to generate?',
        choices: CHOICES
    },
    {
        name: 'name',
        type: 'input',
        message: 'Project name:'
    }
];

inquirer.prompt(QUESTIONS)
    .then(answers => {
        const projectChoice = answers['template'];
        const modName = answers['name'];
        const modNameSafe = toPascalCase(sanitize(modName))
        const templatePath = path.join(__dirname, 'templates', projectChoice);
        const targetPath = path.join(CURR_DIR, modNameSafe);
        if (!createProject(targetPath)) {
            return;
        }

        const options: TemplateOptions = {
            modName,
            modNameSafe
        }

        createDirectoryContents(templatePath, modNameSafe, options);

        let templateSettings = getTemplateDefaultSettings();

        if (fs.existsSync(path.join(templatePath, '_template.json'))) {
            templateSettings = JSON.parse(fs.readFileSync(path.join(templatePath, '_template.json'), 'utf8'));
        }

        if (!templateSettings.postProcess) {
            return;
        }

        postProcess(targetPath);
    });

function createProject(projectPath: string) {
    if (fs.existsSync(projectPath)) {
        console.log(chalk.red(`Folder ${projectPath} exists. Delete or use another name.`));
        return false;
    }
    fs.mkdirSync(projectPath);

    return true;
}

// list of file/folder that should not be copied
const SKIP_FILES = ['node_modules', '_template.json', '.template.json', '.gitkeep'];
function createDirectoryContents(templatePath: string, rootFolder: string, options: TemplateOptions) {
    // read all files/folders (1 level) from template folder
    const filesToCreate = fs.readdirSync(templatePath);
    // loop each file/folder
    filesToCreate.forEach(templateFileName => {
        const origFilePath = path.join(templatePath, templateFileName);

        // get stats about the current file
        const stats = fs.statSync(origFilePath);

        // skip files that should not be copied
        if (SKIP_FILES.indexOf(templateFileName) > -1) return;

        let fileName = templateFileName;
        if (isFileOrDirectoryToRename(templateFileName)) {
            fileName = generateFileOrDirectoryNameForEJS(fileName, options);
        }

        if (fileName.endsWith(".png")) {
            const writePath = path.join(CURR_DIR, rootFolder, fileName);
            fs.copyFileSync(origFilePath, writePath)
            return;
        }

        if (stats.isDirectory()) {
            // create folder in destination folder
            fs.mkdirSync(path.join(CURR_DIR, rootFolder, fileName));
            // copy files/folder inside current folder recursively
            createDirectoryContents(
                path.join(templatePath, templateFileName), // Use original file name, instead of the renamedOne
                path.join(rootFolder, fileName),
                options
            );
            return;
        }

        if (!stats.isFile()) {
            // Idk what the hell it would be
            return;
        }

        // Else, Then it's a text file and we can use the template engine

        // read file content and transform it using template engine
        let contents = fs.readFileSync(origFilePath, 'utf8');
        contents = renderTemplate(contents, options);
        // write file to destination folder
        const writePath = path.join(CURR_DIR, rootFolder, fileName);
        fs.writeFileSync(writePath, contents, 'utf8');
    });
}

function postProcess(targetPath: string) {
    execFile('git', ['init'], {
        cwd: targetPath
    }, (error, stdout, stderr) => {
        if (error) {
            console.log(chalk.red(`Attempted to run git init, but git is not installed`));
            return;
        }
        console.log('Git inititalized in the mod folder');
    });
}