#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var inquirer = __importStar(require("inquirer"));
var chalk_1 = __importDefault(require("chalk"));
var utils_1 = require("./utils/utils");
var CURR_DIR = process.cwd();
var CHOICES = fs.readdirSync(path.join(__dirname, 'templates'));
var QUESTIONS = [
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
    .then(function (answers) {
    var projectChoice = answers['template'];
    var modName = answers['name'];
    var modNameSafe = (0, utils_1.toPascalCase)((0, utils_1.sanitize)(modName));
    var templatePath = path.join(__dirname, 'templates', projectChoice);
    var tartgetPath = path.join(CURR_DIR, modNameSafe);
    if (!createProject(tartgetPath)) {
        return;
    }
    var options = {
        modName: modName,
        modNameSafe: modNameSafe
    };
    createDirectoryContents(templatePath, modNameSafe, options);
});
function createProject(projectPath) {
    if (fs.existsSync(projectPath)) {
        console.log(chalk_1.default.red("Folder ".concat(projectPath, " exists. Delete or use another name.")));
        return false;
    }
    fs.mkdirSync(projectPath);
    return true;
}
// list of file/folder that should not be copied
var SKIP_FILES = ['node_modules', '.template.json', '.gitkeep'];
function createDirectoryContents(templatePath, rootFolder, options) {
    // read all files/folders (1 level) from template folder
    var filesToCreate = fs.readdirSync(templatePath);
    // loop each file/folder
    filesToCreate.forEach(function (templateFileName) {
        var origFilePath = path.join(templatePath, templateFileName);
        // get stats about the current file
        var stats = fs.statSync(origFilePath);
        // skip files that should not be copied
        if (SKIP_FILES.indexOf(templateFileName) > -1)
            return;
        var fileName = templateFileName;
        if ((0, utils_1.isFileOrDirectoryToRename)(templateFileName)) {
            fileName = (0, utils_1.generateFileOrDirectoryNameForEJS)(fileName, options);
        }
        if (fileName.endsWith(".png")) {
            var writePath_1 = path.join(CURR_DIR, rootFolder, fileName);
            fs.copyFileSync(origFilePath, writePath_1);
            return;
        }
        if (stats.isDirectory()) {
            // create folder in destination folder
            fs.mkdirSync(path.join(CURR_DIR, rootFolder, fileName));
            // copy files/folder inside current folder recursively
            createDirectoryContents(path.join(templatePath, templateFileName), // Use original file name, instead of the renamedOne
            path.join(rootFolder, fileName), options);
            return;
        }
        if (!stats.isFile()) {
            // Idk what the hell it would be
            return;
        }
        // Else, Then it's a text file and we can use the template engine
        // read file content and transform it using template engine
        var contents = fs.readFileSync(origFilePath, 'utf8');
        contents = (0, utils_1.renderTemplate)(contents, options);
        // write file to destination folder
        var writePath = path.join(CURR_DIR, rootFolder, fileName);
        fs.writeFileSync(writePath, contents, 'utf8');
    });
}
//# sourceMappingURL=index.js.map